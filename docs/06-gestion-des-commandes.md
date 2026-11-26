# Gestion des commandes et paiement — état réel

> Ce document distingue strictement ce qui est **implémenté et testé**, ce
> qui est **implémenté mais non testé en conditions réelles**, et ce qui
> **reste à décider**.

## Ce qui fonctionne, et que j'ai testé

Le parcours de commande complet est en place et vérifié :

- **71 pages de commande**, une par prestation, avec un formulaire dont les
  questions dépendent de la prestation choisie.
- **Trois étapes** : options, informations, récapitulatif.
- **Calcul du total recalculé côté serveur** à partir du catalogue seul. Une
  option qui n'est pas proposée par la prestation est rejetée — j'ai testé
  l'injection d'un identifiant d'option inventé : HTTP 422.
- **Validation serveur complète**, indépendante du navigateur : champs
  manquants, adresse e-mail invalide, NPA à deux chiffres, prestation
  inexistante, conditions non acceptées. Tous rejetés en 422.
- **Référence de commande** de la forme `YG-26XLRDK0-6CB`, affichée au
  client et reprise dans les deux courriels.
- **Deux courriels** : le détail complet vers `info@yg-services.ch`, et un
  accusé de réception au client avec le montant, le délai, la liste des
  pièces attendues et le rappel qu'aucun document ne passe par le site.
  L'ordre est voulu : si l'accusé au client échoue, la commande est déjà
  partie chez vous.
- **Limitation de débit** : 8 commandes par tranche de 10 minutes et par
  adresse IP. **Champ piège anti-robot** : testé, la commande est acceptée
  en apparence et n'est pas acheminée.
- **Accessibilité** : 0 violation WCAG 2.1 AA (axe-core) sur les trois
  étapes, à 390, 768 et 1280 px. 0 débordement horizontal.
- **164 URL parcourues** après l'ajout : 0 erreur, un seul H1 par page,
  aucun titre ni description hors limite.

## Ce qui est implémenté mais pas testé en conditions réelles

**Le paiement Stripe.** Le code est écrit et branché. Ce que j'ai
réellement testé, et ce que je n'ai pas pu tester :

| Point | Testé ? |
|---|---|
| Aucune donnée de carte sur le site (Checkout hébergé) | Par conception : il n'existe aucun champ de carte dans le code |
| Montant envoyé à Stripe recalculé côté serveur | Oui — le montant du navigateur n'est jamais lu |
| Vérification de signature du webhook | **Oui, réellement** : requête non signée → 400 ; signature forgée → 400 ; signature valide calculée avec le secret de test → 200 ; **corps modifié après signature → 400** |
| Refus de considérer la redirection comme preuve de paiement | **Oui** : une session forgée dans l'URL n'affiche pas « Paiement reçu » |
| Dégradation si la clé est absente ou invalide | **Oui** : la commande est enregistrée et facturée, aucune perte |
| Un paiement réel, de bout en bout | **Non.** Il n'y a pas de compte Stripe ni de clé. |

Le point le plus important de ce tableau est l'avant-dernière ligne du test
de signature : une personne qui intercepterait un événement et gonflerait le
montant verrait sa requête rejetée. C'est ce contrôle, et non la redirection
du navigateur, qui établit qu'un paiement a eu lieu.

**Tant que `STRIPE_SECRET_KEY` est absente**, le paiement est désactivé
partout, et le site l'écrit : « le règlement par carte n'est pas encore
actif ». Il n'y a aucune affirmation fausse affichée au client.

### Pour activer le paiement, il faudra

1. Que **vous** ouvriez un compte Stripe. Je ne souscris rien.
2. Renseigner dans les variables d'environnement Netlify, **par vous** :
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. Déclarer le webhook `https://yg-services.ch/api/stripe/webhook` dans
   Stripe, sur l'événement `checkout.session.completed`.
4. Faire un paiement réel en mode test, puis un en mode réel. **Je ne
   déclarerai le paiement opérationnel qu'après ce test-là.**

## Ce qui reste à décider : la persistance des commandes

C'est la limite réelle de l'état actuel, et je préfère l'écrire clairement.

**Aujourd'hui, une commande n'existe que sous forme de deux courriels.** Il
n'y a pas de base de données. Conséquences concrètes :

- pas de tableau de bord des commandes ;
- pas de statut (reçue, en cours, livrée, payée) ;
- le rapprochement entre un paiement Stripe et une commande se fait **à la
  main**, par la référence, qui figure des deux côtés ;
- un courriel perdu est une commande perdue.

Pour quelques commandes par semaine, c'est tenable : la boîte de réception
fait office de file d'attente, et la référence suffit à retrouver un dossier.
**Au-delà, ce ne l'est plus.**

Trois voies, du plus simple au plus complet :

1. **Rien de plus, et un tableur.** Vous reportez les commandes dans un
   tableur à la main. Coût nul, aucun développement, mais la saisie est
   manuelle et le risque d'oubli réel.
2. **Une base hébergée, avec un tableau de bord protégé par mot de passe sur
   le site.** Les commandes y sont écrites automatiquement, les statuts se
   mettent à jour, le paiement Stripe se rapproche tout seul de la commande.
   C'est la solution que je recommande dès que le volume dépasse quelques
   commandes par semaine. Elle demande de choisir un hébergeur de base de
   données — **et pour des données de clients suisses, je proposerai un
   hébergement en Suisse ou en Europe**, pas une offre américaine par
   défaut. À chiffrer avant de commencer.
3. **Un outil externe de gestion** connecté par automatisation. Rapide à
   mettre en place, mais fait sortir des données de clients vers un
   prestataire tiers de plus — ce que vos propres consignes demandent
   d'éviter quand ce n'est pas nécessaire.

**Je n'ai rien engagé dans cette direction.** Dites-moi laquelle des trois
voies vous voulez, et je la construis.

## Récapitulatif des variables d'environnement

Aucune clé ni aucun secret ne figure dans le dépôt. À renseigner dans
Netlify, par vous :

| Variable | Rôle | État |
|---|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Envoi des courriels (Infomaniak) | Déjà en place |
| `CONTACT_INBOX` | Boîte de réception, par défaut `info@yg-services.ch` | Facultatif |
| `STRIPE_SECRET_KEY` | Active le paiement par carte | **Absente — paiement désactivé** |
| `STRIPE_WEBHOOK_SECRET` | Vérification de signature des webhooks | **Absente** |
