# Mentions légales — ce qui a été fait, ce qui reste à valider

> Les informations que vous avez fournies ont été intégrées. **Un point
> demande une vérification avant publication.** Ce document n'est pas un
> avis juridique.

## Ce qui figure désormais sur le site

Sur la page `/mentions-legales`, et **nulle part ailleurs** :

| Mention | Valeur |
|---|---|
| Nom commercial | YG Services |
| Exploitant | Guiot |
| Forme | activité indépendante en nom propre, non inscrite au registre du commerce |
| Adresse | Avenue Général Guisan 61, 1400 Yverdon-les-Bains, Suisse |
| E-mail | info@yg-services.ch |
| Hébergeur | Netlify, Inc. |

Une section a été ajoutée qui couvre explicitement les quatre exigences de
l'art. 3 al. 1 let. s LCD : identité et adresse de contact, prix en francs
suisses suppléments compris, étapes techniques menant au contrat,
confirmation de commande sans délai par voie électronique.

## Ce qui n'a PAS changé : votre anonymat commercial

J'ai vérifié, fichier par fichier, que l'identité n'apparaît que là où elle
est nécessaire. Résultat du contrôle sur l'ensemble du code et du contenu :

- **Page d'accueil** : aucune occurrence.
- **Pages de prestations et fiches** : aucune occurrence.
- **Blog** : aucune occurrence. Les articles sont signés « YG Services ».
- **Balises SEO** (title, meta description, Open Graph) : aucune occurrence.
- **Données structurées** : l'organisation est `YG Services`. Aucun schéma
  `Person`, aucun `founder`, aucun `author` nominatif.
- **Éléments marketing et réseaux sociaux** : aucune occurrence.
- **Pages de commande et de confirmation** : aucune occurrence.
- **Photo et biographie** : aucune, ni fichier ni référence.

L'adresse apparaît dans les mentions légales uniquement. Elle n'est pas
reprise dans le pied de page, ni dans les données structurées de lieu, ni
dans les fiches.

## Le point à valider : faut-il le prénom ?

C'est le seul vrai doute, et je ne veux pas le présenter comme réglé.

**Ce que j'ai pu établir :**

- L'art. 3 al. 1 let. s LCD exige « l'identité » du fournisseur et son
  adresse de contact. Les sources consultées s'accordent sur le fait que,
  pour une personne physique, il s'agit du **nom ou de la raison sociale de
  l'exploitant du site**, avec son adresse postale complète.
- Pour une raison individuelle **inscrite** au registre du commerce, la
  raison de commerce doit contenir le **nom de famille** de l'entrepreneur,
  et la mention doit correspondre à l'inscription. Vous n'êtes pas inscrit,
  donc cette règle ne s'applique pas directement.
- **Aucune des sources consultées n'exige explicitement le prénom** pour
  une activité en nom propre non inscrite.

**Ce que je n'ai pas pu établir :** s'il existe une pratique ou une
jurisprudence qui considère que « Guiot » seul ne suffit pas à identifier la
personne, le prénom étant nécessaire pour la distinguer. L'argument serait
qu'une identification doit permettre de joindre et, le cas échéant,
d'actionner le fournisseur — ce que le nom de famille seul, avec une adresse
précise, permet probablement, mais je ne peux pas l'affirmer.

**Mon avis, donné comme un avis :** l'ensemble « YG Services — Guiot,
Avenue Général Guisan 61, 1400 Yverdon-les-Bains » identifie une personne de
manière suffisamment précise pour qu'on puisse la joindre à une adresse
déterminée. Le risque résiduel me paraît faible. Il n'est pas nul, et
ajouter l'initiale du prénom (« Y. Guiot ») l'écarterait presque entièrement
tout en restant discret dans une page que personne ne lit pour faire
connaissance.

**Comment lever le doute, concrètement :** un appel ou un courriel au
**Bureau fédéral de la consommation** ou à une **permanence juridique**
locale, en posant exactement cette question : « Pour une activité
indépendante en nom propre non inscrite au registre du commerce qui vend des
prestations en ligne, le nom de famille et l'adresse postale suffisent-ils
au sens de l'art. 3 al. 1 let. s LCD, ou le prénom est-il nécessaire ? »

## Les deux autres points à surveiller

**L'adresse est votre domicile.** Elle est désormais publique sur le site.
C'est conforme et c'est votre choix ; sachez simplement qu'elle sera indexée
par les moteurs de recherche et reprise par des annuaires. La case postale
reste une alternative si vous changez d'avis — environ CHF 70 à 200 par an.
Je n'ai rien commandé.

**L'inscription au registre du commerce** devient obligatoire pour une
activité exercée en la forme commerciale dès CHF 100'000 de chiffre
d'affaires annuel — le même seuil que la TVA, par coïncidence. Le tableau
de bord suit ce cumul et vous alerte à CHF 70'000 : l'alerte vaut pour les
deux sujets.

## Décision attendue de votre part

1. Garder « Guiot » seul, ou ajouter l'initiale du prénom ?
2. Souhaitez-vous faire vérifier le point ci-dessus avant publication, ou
   publier en l'état en acceptant le risque résiduel ?

Pour modifier la mention, un seul endroit : `operator` dans
`src/config/site.ts`.

Sources : [SECO / PME — e-commerce](https://www.kmu.admin.ch/fr/obligations-legales-les-lois-suisses-et-europeennes-sur-le-e-commerce), [PME — registre du commerce](https://www.kmu.admin.ch/fr/registre-du-commerce-son-fonctionnement), [Directive de l'OFJ sur le droit des raisons de commerce](https://www.bj.admin.ch/dam/bj/fr/data/wirtschaft/handelsregister/weisung-firmenrecht-f.pdf). Le texte qui fait foi est la LCD (RS 241) sur fedlex.admin.ch.
