import { tva } from '@/config/tva';
import {
  alerteDejaEnvoyee,
  chiffreAffaires,
  marquerAlerteEnvoyee,
  type Chiffres,
} from '@/lib/store';
import { notifierSeuilTva } from '@/lib/order-mailer';

/**
 * Surveillance du seuil d'assujettissement à la TVA.
 *
 * COMMENT CELA FONCTIONNE, concrètement :
 *
 * 1. OÙ LE CALCUL SE FAIT — `chiffreAffaires()` additionne le champ `total`
 *    des commandes enregistrées dans le stockage, pour l'année civile en
 *    cours, en écartant les commandes annulées. Deux cumuls sont produits :
 *      - `encaisse` : commandes payées ou facturées. C'est la base retenue
 *        pour le seuil, parce que c'est elle qui correspond au chiffre
 *        d'affaires réalisé.
 *      - `engage` : toutes les commandes non annulées, paiement en attente
 *        compris. Indicateur avancé, affiché au tableau de bord.
 *
 * 2. QUAND LA VÉRIFICATION A LIEU — à deux moments, sans intervention :
 *      - à l'enregistrement de chaque nouvelle commande ;
 *      - à chaque paiement confirmé par le webhook Stripe.
 *    Il n'y a donc pas de tâche planifiée à maintenir, et la vérification
 *    ne peut pas « s'arrêter » sans que le site s'arrête aussi.
 *
 * 3. COMMENT VOUS ÊTES ALERTÉ — par un courriel à la boîte de réception de
 *    YG Services, avec le montant cumulé, le seuil franchi et la marche à
 *    suivre. Le franchissement est enregistré dans le stockage : l'alerte
 *    ne part qu'une seule fois par seuil et par année.
 *
 * 4. CE QUE L'ALERTE NE FAIT PAS — elle ne modifie aucun prix et n'active
 *    pas la TVA. Elle vous informe ; la décision reste la vôtre.
 *
 * LIMITE À CONNAÎTRE : le calcul ne porte que sur les commandes passées par
 * le site. Un revenu facturé en dehors (prestation digitale, mandat direct)
 * n'y figure pas et doit être ajouté à la main pour juger du seuil réel.
 */

export type ResultatVerification = {
  chiffres: Chiffres;
  /** Seuils franchis pour lesquels une alerte vient d'être envoyée. */
  alertesEnvoyees: number[];
};

export async function verifierSeuilTva(): Promise<ResultatVerification> {
  const chiffres = await chiffreAffaires();
  const alertesEnvoyees: number[] = [];

  // Hors assujettissement uniquement : une fois la TVA active, l'alerte
  // n'a plus d'objet.
  if (tva.assujetti) return { chiffres, alertesEnvoyees };

  for (const seuil of tva.seuilsAlerte) {
    if (chiffres.encaisse < seuil) continue;
    if (await alerteDejaEnvoyee(chiffres.annee, seuil)) continue;

    try {
      await notifierSeuilTva({ seuil, chiffres });
      // Le marquage n'a lieu qu'après l'envoi : si le courriel échoue,
      // l'alerte sera retentée à la commande suivante.
      await marquerAlerteEnvoyee(chiffres.annee, seuil);
      alertesEnvoyees.push(seuil);
    } catch (error) {
      console.error('[tva] Alerte de seuil non délivrée', error);
    }
  }

  return { chiffres, alertesEnvoyees };
}

/** Part du seuil d'assujettissement atteinte, en pourcentage. */
export function progressionSeuil(encaisse: number): number {
  return Math.min(100, Math.round((encaisse / tva.seuilAssujettissement) * 100));
}
