import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protection du tableau de bord des commandes.
 *
 * Le tableau de bord affiche des données personnelles de clients : il ne
 * peut pas être accessible sans authentification. La protection est une
 * authentification HTTP simple, adossée à deux variables d'environnement.
 *
 *   ADMIN_USER      identifiant
 *   ADMIN_PASSWORD  mot de passe
 *
 * Tant que ces variables ne sont pas définies, /admin répond 404 : la
 * page n'existe pas pour un visiteur, et aucune version non protégée du
 * tableau de bord n'est jamais servie. C'est volontaire : l'absence de
 * configuration ne doit pas ouvrir l'accès, elle doit le fermer.
 *
 * LIMITE À CONNAÎTRE : une authentification HTTP simple n'offre ni
 * second facteur, ni limitation des tentatives, ni expiration de session.
 * Elle convient à un tableau de bord à un seul utilisateur derrière HTTPS.
 * Pour aller plus loin, il faudra une véritable session et une limitation
 * des tentatives — à décider selon l'usage réel.
 */

const PROTEGE = ['/admin', '/api/admin'];

/** Comparaison à durée constante, pour ne pas renseigner un attaquant. */
function egal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let different = 0;
  for (let i = 0; i < a.length; i += 1) {
    different |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return different === 0;
}

export default function proxy(request: NextRequest) {
  const chemin = request.nextUrl.pathname;
  if (!PROTEGE.some((prefixe) => chemin === prefixe || chemin.startsWith(`${prefixe}/`))) {
    return NextResponse.next();
  }

  const utilisateur = process.env.ADMIN_USER;
  const motDePasse = process.env.ADMIN_PASSWORD;

  // Non configuré : la zone n'existe pas.
  if (!utilisateur || !motDePasse) {
    return new NextResponse(null, { status: 404 });
  }

  const entete = request.headers.get('authorization');

  if (entete?.startsWith('Basic ')) {
    try {
      const decode = atob(entete.slice(6));
      const separateur = decode.indexOf(':');
      const fourniUtilisateur = decode.slice(0, separateur);
      const fourniMotDePasse = decode.slice(separateur + 1);

      if (egal(fourniUtilisateur, utilisateur) && egal(fourniMotDePasse, motDePasse)) {
        return NextResponse.next();
      }
    } catch {
      // En-tête illisible : traité comme une absence d'authentification.
    }
  }

  // Le libellé du domaine doit rester en ASCII : un en-tête HTTP ne peut
  // pas contenir de caractère au-delà de 255 (un tiret cadratin y lève une
  // erreur et transforme le 401 en 500).
  return new NextResponse('Authentification necessaire.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="YG Services commandes", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
