# TVA — fonctionnement, seuil et structure préparée

> Analyse préparatoire. **Aucune TVA n'est appliquée aux prix du site.**
> Vous n'êtes pas considéré comme assujetti. Ce document n'est pas un avis
> fiscal.

## Le seuil

L'assujettissement devient **obligatoire** dès que le chiffre d'affaires
annuel provenant de prestations imposables, réalisées en Suisse et à
l'étranger, atteint **CHF 100'000**. Points importants :

- C'est le **chiffre d'affaires brut** qui compte, pas le bénéfice.
- Pour une **activité qui démarre**, l'assujettissement court **dès le
  début** si les CHF 100'000 sont prévisibles sur douze mois. Pour une
  activité existante, il intervient à la fin de l'exercice où le seuil est
  atteint.
- En cas de dépassement non annoncé, **l'assujettissement remonte au début
  de l'exercice concerné**, avec intérêts moratoires. C'est le risque
  principal : il ne se règle pas après coup sans coût.
- Sous le seuil, l'inscription reste **facultative**. Elle peut avoir un
  intérêt si vous avez des achats professionnels importants, puisqu'elle
  permet de récupérer l'impôt préalable. Pour une activité de services avec
  peu de charges, l'intérêt est faible.

Taux en vigueur : **8,1 %** (normal), 2,6 % (réduit), 3,8 % (hébergement).
Vos prestations relèvent du taux normal.

## Ce que cela signifie concrètement pour YG Services

Le catalogue compte des prestations de CHF 25 à CHF 299, plus des
abonnements mensuels. Pour atteindre CHF 100'000, il faudrait de l'ordre de
700 à 1'500 commandes par an selon le panier moyen. Le seuil n'est donc pas
un sujet immédiat — mais il devient un sujet de **surveillance** le jour où
l'activité prend, parce que le dépassement a un effet rétroactif.

**Ce que je vous recommande de suivre** : le cumul du chiffre d'affaires
depuis le 1er janvier, et une alerte à CHF 70'000. À ce niveau, il est temps
de décider, pas de constater.

## La structure préparée dans le code

Tout le régime de TVA est centralisé dans un seul fichier,
`src/config/tva.ts`. Les prix du catalogue n'ont **pas** à être retouchés le
jour de l'assujettissement. Pour basculer :

```ts
export const tva = {
  assujetti: true,              // au lieu de false
  taux: 8.1,
  numero: 'CHE-123.456.789 TVA',
  mode: 'incluse',              // ou 'ajoutee'
};
```

Les deux modes :

- **`'incluse'`** — les prix affichés ne bougent pas et la TVA est extraite
  du montant. Un prix de CHF 159 devient CHF 147.09 hors taxe + CHF 11.91 de
  TVA. **Recommandé pour une clientèle de particuliers** : aucun prix
  n'augmente, votre marge baisse de 7,5 %.
- **`'ajoutee'`** — la TVA s'ajoute au prix affiché. CHF 159 devient
  CHF 171.88. Adapté à une clientèle d'entreprises, qui récupère la TVA.

Ce que la bascule met à jour automatiquement, sans autre intervention :
la mention sous chaque prix, le détail du récapitulatif de commande, les
totaux envoyés à Stripe, les récapitulatifs des courriels de confirmation,
et le total affiché dans le panneau de commande.

## Points à valider

1. Confirmez-vous rester non assujetti pour l'instant ? (c'est l'état
   actuel du code)
2. Souhaitez-vous que j'ajoute une page de suivi du chiffre d'affaires, ou
   préférez-vous le tenir hors du site ?
3. Le jour de l'assujettissement : mode `'incluse'` ou `'ajoutee'` ?

Sources : guides privés concordants sur le seuil et les taux 2026 —
[Rister](https://www.rister.ch/post/assujettissement-tva-suisse/),
[Juriup — LTVA](https://juriup.ch/terme-juridique/assujettissement-a-la-tva-en-suisse-ltva/),
[Simplifaq](https://simplifaq.ch/blog/tva-en-suisse-guide-clair-pour-independants-2026).
Pour votre date exacte d'assujettissement, l'**AFC** est la seule référence
qui fasse foi.
