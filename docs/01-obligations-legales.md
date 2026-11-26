# Obligations légales — vente de prestations en ligne

> Analyse préparatoire. Aucune modification des mentions légales n'a été
> appliquée : les éléments ci-dessous attendent votre validation.
> Ce document n'est pas un avis juridique.

## Ce qui change avec la vente en ligne

Jusqu'ici, le site présentait une activité et recueillait des demandes de
contact. Il propose désormais des prestations à prix affiché, commandables
depuis le site. Cela fait entrer YG Services dans le champ de
l'**art. 3 al. 1 let. s LCD** (loi contre la concurrence déloyale), qui vise
le commerce électronique.

Le compromis retenu lors de la dépersonnalisation — « identité communiquée
sur demande » — ne tient plus pour cette partie du site. L'art. 3 al. 1
let. s LCD exige quatre choses de qui propose des prestations en ligne :

| Exigence | État actuel du site |
|---|---|
| Identité et adresse de contact du fournisseur | **Manquant** (`mentions-legales` : nom, adresse et responsable laissés vides) |
| Adresse électronique | Présent — `info@yg-services.ch` |
| Indication claire des étapes techniques menant au contrat | Présent — page catalogue, section « Comment se passe une commande » |
| Confirmation de commande sans délai par voie électronique | **Fait** — accusé de réception automatique au client |

Le prix doit par ailleurs être indiqué **en francs suisses, suppléments non
optionnels compris**. C'est le cas : les prix sont en CHF et les options sont
annoncées avant la commande, avec leur supplément.

## Ce qui doit être ajouté, et ce que cela implique pour votre anonymat

L'obligation porte sur l'**identification du fournisseur**, pas sur une
présentation personnelle. La distinction est utile pour vous :

**Ce qui est obligatoire et doit figurer :**
1. **Le nom du fournisseur.** Comme vous n'êtes pas inscrit au registre du
   commerce, l'entreprise est une raison individuelle : le nom et le prénom
   de l'exploitant doivent apparaître. « YG Services » seul ne suffit pas à
   identifier le fournisseur. La formule usuelle est
   « YG Services — Yoann Guiot » ou « Yoann Guiot, YG Services ».
2. **Une adresse postale** permettant de joindre le fournisseur.
3. **L'adresse électronique** — déjà en place.

**Ce qui n'est pas obligatoire et peut rester hors du site :**
- votre photo ;
- toute présentation personnelle, biographie ou parcours ;
- votre nom dans les titres, les pages de présentation, les données
  structurées ou la communication marketing ;
- un numéro de téléphone (contrairement à ce qu'affirment certains guides de
  certification privés, la LCD ne l'exige pas) ;
- un numéro IDE ou de registre du commerce, tant que vous n'y êtes pas
  inscrit.

Autrement dit : votre nom doit figurer **dans les mentions légales**, pas sur
la page d'accueil. L'identité visuelle et marketing du site reste neutre.

## Point à trancher : l'adresse postale

C'est le seul vrai arbitrage. Trois voies, à votre choix :

1. **Votre adresse personnelle.** Conforme, gratuite, mais publique.
2. **Une case postale.** Admise comme adresse de contact par la pratique
   usuelle. Environ CHF 70 à 200 par an selon le format.
3. **Une adresse de domiciliation commerciale.** Plus coûteuse (CHF 300 à
   900 par an) et généralement conçue pour des sociétés inscrites au RC.

**Je vous recommande la case postale** : elle satisfait l'obligation sans
exposer votre domicile, pour un coût faible. Je n'ai rien souscrit.

## Autres points relevés

- **Pas de droit de rétractation à prévoir.** Le droit suisse ne connaît pas
  de droit de révocation général pour les achats en ligne ; l'art. 40a CO
  vise le démarchage, pas le commerce électronique. Vos conditions de
  prestation prévoient déjà, à votre initiative, une annulation sans frais
  tant que le traitement n'a pas commencé — c'est un avantage contractuel
  que vous accordez, pas une obligation. Rien à changer.
- **nLPD.** Les mentions au sens de la LCD ne couvrent pas la protection des
  données. La page de confidentialité existe ; elle devra décrire le circuit
  réel des documents une fois celui-ci arrêté (voir `04-stockage-documents.md`).
- **Sous-traitants.** Dès qu'un prestataire traite des données pour vous
  (Netlify pour l'hébergement, Infomaniak pour la messagerie, Stripe pour le
  paiement), la politique de confidentialité doit les nommer et indiquer le
  pays. Netlify et les États-Unis y figurent déjà ; Stripe devra être ajouté
  le jour où le paiement est activé.
- **Pas d'autorité de contrôle systématique**, mais la LCD prévoit des
  sanctions pénales et un concurrent ou un client peut agir. Le risque n'est
  pas théorique dès lors que le site encaisse des commandes.

## Décision attendue de votre part

1. Formulation exacte du nom à faire figurer dans les mentions légales.
2. Adresse postale retenue (personnelle, case postale, domiciliation).
3. Accord pour que je mette à jour `mentions-legales` et
   `confidentialite` en conséquence.

Sources principales : [SECO / PME — obligations légales e-commerce](https://www.kmu.admin.ch/fr/obligations-legales-les-lois-suisses-et-europeennes-sur-le-e-commerce), [FRC — loi suisse et réglementation européenne](https://www.frc.ch/loi-suisse-versus-reglementation-europeenne), [Bureau fédéral de la consommation — FAQ](https://www.konsum.admin.ch/fr/foire-aux-questions-faq).
