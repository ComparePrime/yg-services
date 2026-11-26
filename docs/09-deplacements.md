# Déplacements — proposition de zones, de frais et de conditions

> **Aucun frais de déplacement n'est facturé aujourd'hui.** La structure est
> en place mais inactive (`deplacement.fraisActifs: false`). Le parcours de
> commande l'écrit noir sur blanc. Rien ne s'ajoute en silence à un total.
> Ce document est la proposition que vous avez demandée, à valider.

## Le raisonnement

Trois contraintes guidaient le choix :

1. **Ne pas décourager la première commande.** Un supplément visible sur une
   prestation à CHF 49 pèse lourd. La zone proche doit être sans frais.
2. **Ne pas travailler à perte.** Un aller-retour à Payerne, c'est une heure
   de route. À un moment, cela se paie.
3. **Ne rien cacher.** Un frais annoncé après la commande est la meilleure
   façon de perdre un client et de s'en faire un détracteur.

D'où une grille à trois niveaux, où le gratuit est assumé comme un coût
d'acquisition et non comme une faveur.

## La grille proposée

| Zone | Rayon | Frais proposés | Rendez-vous sous |
|---|---|---|---|
| **Yverdon-les-Bains et proches environs** | ~10 km | **CHF 0** | 3 à 5 jours ouvrables |
| **Nord vaudois et Broye** | ~30 km | **CHF 25** | 5 à 7 jours ouvrables |
| **Au-delà** (Lausanne, Neuchâtel, Fribourg) | — | **sur devis** | à convenir |

Communes citées à titre indicatif sur le site :

- **Zone 1** : Yverdon-les-Bains, Grandson, Yvonand, Chavornay, Orbe,
  Cheseaux-Noréaz, Montagny-près-Yverdon.
- **Zone 2** : Sainte-Croix, Vallorbe, Échallens, Moudon, Payerne,
  Estavayer-le-Lac, Avenches.
- **Zone 3** : Lausanne, Morges, Neuchâtel, Fribourg, Bulle.

### Pourquoi CHF 25 pour la zone 2

C'est un montant qui couvre le trajet sans ressembler à une pénalité. Plus
bas, il ne couvre rien et crée une ligne de facture pour rien. Plus haut, il
devient un motif de renoncement sur une prestation à CHF 59. À CHF 25, un
client qui a deux cartons de papiers à trier ne regarde pas la ligne ; un
client qui hésitait entre distance et sur place choisit en connaissance de
cause.

### Pourquoi la zone 1 à zéro

Parce que c'est votre marché naturel et que la gratuité y est un argument
réel, pas une concession. Et parce que facturer CHF 10 de déplacement à
Grandson coûterait plus en explications qu'il ne rapporte.

### Pourquoi la zone 3 sur devis

Un déplacement à Fribourg ou à Bulle n'a de sens que pour une prestation
d'un certain volume. Un montant fixe serait soit dissuasif, soit déficitaire.
« Faisabilité et frais confirmés avant tout engagement » est la bonne
réponse, et c'est ce que le site affiche.

## Ce qui est déjà appliqué dans le parcours

- La zone n'est demandée **que** si la modalité choisie suppose un
  déplacement. Un client qui prend « à distance » ne voit jamais la question.
- La zone retenue affiche son délai de rendez-vous et ses communes
  d'exemple, au moment du choix.
- Tant que les frais sont inactifs, le parcours affiche : « aucun frais
  n'est ajouté à votre total aujourd'hui. Si un déplacement en implique, le
  montant vous est annoncé par écrit et vous le validez avant tout
  engagement. »
- Le jour de l'activation, les frais apparaîtront **sur une ligne distincte**
  du récapitulatif, jamais fondus dans le prix de la prestation. C'est aussi
  ce qu'exige la LCD en matière d'indication des prix.
- La zone et le délai de rendez-vous figurent dans la commande enregistrée,
  dans le courriel interne et dans la confirmation au client.

## Conditions de rendez-vous proposées

Elles sont déjà affichées sur la page catalogue et sur les fiches concernées :

1. Le rendez-vous est fixé par écrit après la commande, selon vos
   disponibilités.
2. Un rendez-vous peut être déplacé sans frais jusqu'à 24 heures avant
   l'heure convenue.
3. Un rendez-vous manqué sans avertissement peut être facturé au prorata du
   temps réservé.
4. Les frais de déplacement éventuels sont annoncés avant la commande et
   figurent sur une ligne distincte.
5. Hors des zones couvertes, la faisabilité et les frais sont confirmés avant
   tout engagement.

**Disponibilités annoncées** : en semaine en journée et en début de soirée,
le samedi matin sur demande.
**Durée d'un rendez-vous** : 45 à 90 minutes selon la prestation.

Ces deux dernières valeurs sont à ajuster à votre réalité : ce sont des
annonces publiques, et mieux vaut annoncer moins et tenir.

## Faut-il un système de réservation ?

Vous demandiez d'évaluer la pertinence. **Mon avis : pas maintenant.**

Un agenda en ligne a du sens quand le volume rend la prise de rendez-vous par
écrit pénible — disons au-delà de cinq ou six rendez-vous par semaine. En
dessous, il crée surtout des problèmes : des créneaux réservés puis annulés,
une disponibilité affichée qui ne correspond pas à votre semaine réelle, et
un outil tiers de plus qui reçoit le nom et le courriel de vos clients, ce
que vos propres consignes demandent d'éviter quand ce n'est pas nécessaire.

La commande recueille déjà la zone et l'échéance éventuelle. Fixer le
rendez-vous par écrit, en deux messages, suffit au démarrage — et vous
permet de garder la main sur votre agenda.

Si le volume le justifie plus tard, la structure est prête : les créneaux
viendraient se brancher sur l'étape « Déroulement », après le choix de la
zone.

## Pour activer les frais

Deux lignes dans `src/config/intervention.ts` :

```ts
export const deplacement = {
  fraisActifs: true,   // au lieu de false
  …
};
```

et, si vous changez les montants, `fraisProposes` dans le tableau `zones`.
Rien d'autre à toucher : l'affichage, le récapitulatif, le total, les
courriels et la commande enregistrée suivent.

## Décision attendue de votre part

1. La grille à trois zones vous convient-elle, et les communes sont-elles
   les bonnes ?
2. CHF 0 / CHF 25 / sur devis : validez-vous, ou ajustez-vous ?
3. Activer les frais maintenant, ou garder « confirmés avant engagement » le
   temps de voir la demande réelle ?
4. Les disponibilités annoncées correspondent-elles à votre semaine ?
