import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Modalite } from '@/config/intervention';

/**
 * Persistance des commandes.
 *
 * CHOIX RETENU : Netlify Blobs.
 *
 * Trois solutions étaient sur la table (voir docs/06). Netlify Blobs est
 * celle qui tient le mieux l'ensemble des critères au lancement :
 *   - coût : inclus dans l'offre Netlify déjà utilisée, aucun abonnement
 *     supplémentaire, aucune carte à donner ;
 *   - fiabilité : une commande est écrite avant que le client ne voie sa
 *     confirmation ; elle ne dépend plus de la bonne réception d'un
 *     courriel ;
 *   - simplicité : aucun serveur de base de données à administrer, aucun
 *     mot de passe de connexion à faire circuler ;
 *   - évolutivité : l'interface ci-dessous est volontairement réduite à
 *     six fonctions. Remplacer le pilote par une base SQL ne demande que
 *     de réécrire ce fichier, pas les pages ni les routes.
 *
 * LIMITE À CONNAÎTRE : Netlify est un hébergeur américain. Les commandes
 * contiennent des données personnelles ordinaires (nom, adresse, courriel)
 * mais AUCUNE donnée sensible et AUCUN document : les pièces passent par
 * un canal séparé. Si vous préférez un hébergement en Suisse ou dans
 * l'Union européenne pour ces données aussi, le pilote est remplaçable.
 *
 * En développement, et partout où Netlify Blobs n'est pas disponible, un
 * pilote de fichiers prend le relais afin que le site reste utilisable et
 * testable. Les deux pilotes exposent la même interface.
 */

export type StatutCommande = 'recue' | 'en-cours' | 'livree' | 'annulee';
export type StatutPaiement = 'en-attente' | 'payee' | 'facturee' | 'remboursee';

export const STATUTS_COMMANDE: { value: StatutCommande; label: string }[] = [
  { value: 'recue', label: 'Reçue' },
  { value: 'en-cours', label: 'En cours' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
];

export const STATUTS_PAIEMENT: { value: StatutPaiement; label: string }[] = [
  { value: 'en-attente', label: 'En attente' },
  { value: 'payee', label: 'Payée' },
  { value: 'facturee', label: 'Facturée' },
  { value: 'remboursee', label: 'Remboursée' },
];

export type Commande = {
  reference: string;
  /** Horodatage ISO de la réception. */
  recueLe: string;
  prestation: string;
  prestationTitre: string;
  categorie: string;
  options: string[];
  modalite?: Modalite;
  zone?: string;
  /** Montant total, tel que calculé côté serveur. */
  total: number;
  /** Part de TVA, nulle hors assujettissement. */
  tva: number;
  devise: 'CHF';
  recurrence?: 'mensuel';
  client: {
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    npa?: string;
    localite?: string;
    canton?: string;
  };
  /** Réponses au formulaire, pour le traitement du dossier. */
  reponses: Record<string, string>;
  statut: StatutCommande;
  paiement: StatutPaiement;
  /** Identifiant de session Stripe, lorsqu'un paiement a été lancé. */
  stripeSession?: string;
  /** Horodatage du paiement vérifié côté serveur. */
  payeeLe?: string;
  /** Notes internes, saisies depuis le tableau de bord. */
  notes?: string;
  /**
   * Lien de dépôt kDrive propre à cette commande, collé depuis le tableau
   * de bord. Prend le pas sur la boîte commune lorsqu'il est renseigné.
   */
  depotUrl?: string;
};

/* ------------------------------------------------------------------
   Pilotes
------------------------------------------------------------------- */

type Pilote = {
  nom: 'netlify-blobs' | 'fichiers';
  lire: (cle: string) => Promise<string | null>;
  ecrire: (cle: string, valeur: string) => Promise<void>;
  lister: () => Promise<string[]>;
  supprimer: (cle: string) => Promise<void>;
};

const NOM_STORE = 'commandes';

/** Dossier utilisé par le pilote de secours, hors Netlify. */
const DOSSIER_LOCAL =
  process.env.ORDERS_DIR ?? path.join(process.cwd(), '.data', 'commandes');

let pilote: Pilote | null = null;

async function getPilote(): Promise<Pilote> {
  if (pilote) return pilote;

  // Netlify Blobs n'est disponible que dans l'environnement Netlify. On
  // tente l'accès réel plutôt que de deviner d'après une variable.
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: NOM_STORE, consistency: 'strong' });
    // Un appel de lecture suffit à valider que le store répond.
    await store.get('__sonde__');

    pilote = {
      nom: 'netlify-blobs',
      lire: (cle) => store.get(cle, { type: 'text' }),
      ecrire: async (cle, valeur) => {
        await store.set(cle, valeur);
      },
      lister: async () => {
        const { blobs } = await store.list();
        return blobs.map((blob) => blob.key);
      },
      supprimer: async (cle) => {
        await store.delete(cle);
      },
    };
    return pilote;
  } catch {
    // Pilote de secours : des fichiers sur le disque local.
    await fs.mkdir(DOSSIER_LOCAL, { recursive: true });

    const chemin = (cle: string) =>
      path.join(DOSSIER_LOCAL, `${cle.replace(/[^A-Za-z0-9_.-]/g, '_')}.json`);

    pilote = {
      nom: 'fichiers',
      lire: async (cle) => {
        try {
          return await fs.readFile(chemin(cle), 'utf8');
        } catch {
          return null;
        }
      },
      ecrire: async (cle, valeur) => {
        await fs.mkdir(DOSSIER_LOCAL, { recursive: true });
        await fs.writeFile(chemin(cle), valeur, 'utf8');
      },
      lister: async () => {
        try {
          const noms = await fs.readdir(DOSSIER_LOCAL);
          return noms.filter((n) => n.endsWith('.json')).map((n) => n.slice(0, -5));
        } catch {
          return [];
        }
      },
      supprimer: async (cle) => {
        await fs.rm(chemin(cle), { force: true });
      },
    };
    return pilote;
  }
}

/** Nom du pilote en service, affiché dans le tableau de bord. */
export async function piloteEnService(): Promise<Pilote['nom']> {
  return (await getPilote()).nom;
}

/* ------------------------------------------------------------------
   Opérations
------------------------------------------------------------------- */

export async function enregistrerCommande(commande: Commande): Promise<void> {
  const p = await getPilote();
  await p.ecrire(commande.reference, JSON.stringify(commande, null, 2));
}

export async function lireCommande(reference: string): Promise<Commande | null> {
  const p = await getPilote();
  const brut = await p.lire(reference);
  if (!brut) return null;
  try {
    return JSON.parse(brut) as Commande;
  } catch {
    return null;
  }
}

/** Toutes les commandes, de la plus récente à la plus ancienne. */
export async function listerCommandes(): Promise<Commande[]> {
  const p = await getPilote();
  const cles = (await p.lister()).filter((cle) => !cle.startsWith('__'));

  const commandes = await Promise.all(cles.map((cle) => lireCommande(cle)));

  return commandes
    .filter((c): c is Commande => c !== null)
    .sort((a, b) => b.recueLe.localeCompare(a.recueLe));
}

/** Met à jour une commande existante. Renvoie la version enregistrée. */
export async function majCommande(
  reference: string,
  modifications: Partial<Commande>,
): Promise<Commande | null> {
  const existante = await lireCommande(reference);
  if (!existante) return null;

  // La référence ne peut pas être réécrite : c'est la clé d'enregistrement.
  const suivante: Commande = { ...existante, ...modifications, reference };
  await enregistrerCommande(suivante);
  return suivante;
}

/* ------------------------------------------------------------------
   Chiffre d'affaires et seuil de TVA
------------------------------------------------------------------- */

export type Chiffres = {
  annee: number;
  /** Cumul des commandes payées ou facturées, hors commandes annulées. */
  encaisse: number;
  /** Cumul de toutes les commandes non annulées, paiement en attente inclus. */
  engage: number;
  nombreCommandes: number;
};

/**
 * Chiffre d'affaires cumulé de l'année civile.
 *
 * `encaisse` est la base du suivi du seuil de TVA : il ne compte que ce qui
 * a été réellement payé ou facturé. `engage` sert d'indicateur d'alerte
 * avancée, puisqu'une commande facturée le sera dans les jours qui suivent.
 */
export async function chiffreAffaires(annee = new Date().getFullYear()): Promise<Chiffres> {
  const commandes = await listerCommandes();
  const retenues = commandes.filter(
    (c) => c.statut !== 'annulee' && new Date(c.recueLe).getFullYear() === annee,
  );

  return {
    annee,
    encaisse: retenues
      .filter((c) => c.paiement === 'payee' || c.paiement === 'facturee')
      .reduce((somme, c) => somme + c.total, 0),
    engage: retenues.reduce((somme, c) => somme + c.total, 0),
    nombreCommandes: retenues.length,
  };
}

/** Clé d'enregistrement des alertes déjà envoyées, pour ne pas les répéter. */
const cleAlerte = (annee: number, seuil: number) => `__alerte-tva-${annee}-${seuil}`;

export async function alerteDejaEnvoyee(annee: number, seuil: number): Promise<boolean> {
  const p = await getPilote();
  return (await p.lire(cleAlerte(annee, seuil))) !== null;
}

export async function marquerAlerteEnvoyee(annee: number, seuil: number): Promise<void> {
  const p = await getPilote();
  await p.ecrire(cleAlerte(annee, seuil), new Date().toISOString());
}
