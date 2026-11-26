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

## La persistance : décidée et construite

> **Mise à jour du 26 novembre 2026.** Cette section décrivait une limite ;
> elle est levée. La solution 2 a été retenue et construite. Ce qui suit
> décrit l'état réel, et le texte d'origine est conservé plus bas pour
> mémoire.

**Solution retenue : Netlify Blobs**, avec un tableau de bord protégé sur
le site. Le raisonnement, critère par critère :

| Critère | Pourquoi Netlify Blobs |
|---|---|
| Coût | Inclus dans l'offre Netlify déjà utilisée. Aucun abonnement de plus, aucune carte à donner. |
| Sécurité | Aucun identifiant de base de données à faire circuler. Les commandes ne contiennent aucune donnée sensible et aucun document. |
| Simplicité | Aucun serveur à administrer, aucune migration à écrire. |
| Fiabilité | L'écriture passe avant l'envoi des courriels. Un courriel perdu ne fait plus perdre une commande. Un échec d'écriture refuse la commande au lieu de la perdre. |
| Évolutivité | L'interface tient en six fonctions. Remplacer le pilote par une base SQL ne demande de réécrire qu'un fichier, pas les pages ni les routes. |
| Facilité de gestion | Un tableau de bord sur le site, sans outil tiers à ouvrir. |
| Compatibilité | Fonctionne avec le runtime Next déjà en place. Un pilote de fichiers prend le relais en développement, pour que tout reste testable. |

**La limite à connaître, dite clairement :** Netlify est un hébergeur
américain. Les commandes contiennent des données personnelles ordinaires —
nom, adresse, courriel — mais **aucune donnée sensible et aucun document** :
les pièces passent par Infomaniak, en Suisse. Netlify est déjà l'hébergeur
du site et figure nommément dans la politique de confidentialité. Si vous
préférez un hébergement suisse ou européen pour ces données aussi, le pilote
est remplaçable sans toucher au reste.

### Ce que le tableau de bord vous donne

À l'adresse `/admin`, protégée par authentification :

- la liste des commandes, de la plus récente à la plus ancienne, avec
  référence, date, client, prestation, montant, statut et paiement ;
- le détail de chaque commande : options, déroulement choisi, zone de
  déplacement, réponses au formulaire, session Stripe, date de paiement ;
- la **modification du statut** (reçue, en cours, livrée, annulée) et du
  **paiement** (en attente, payée, facturée, remboursée) ;
- des **notes internes** par commande ;
- le champ du **lien de dépôt** des documents pour cette commande ;
- les **indicateurs de l'année** : encaissé ou facturé, en attente de
  paiement, commandes à traiter, progression vers le seuil de TVA ;
- l'**état technique** en un coup d'œil : pilote de stockage en service,
  paiement actif ou non, webhook configuré ou non, régime de TVA, frais de
  déplacement actifs ou non.

### La protection de l'accès

Authentification HTTP simple, par `ADMIN_USER` et `ADMIN_PASSWORD`, avec
comparaison à durée constante. **Tant que ces deux variables ne sont pas
définies, `/admin` répond 404** : une configuration absente ferme l'accès au
lieu de l'ouvrir, et aucune version non protégée du tableau de bord n'est
jamais servie. La zone est en plus exclue du plan du site et de
`robots.txt`, et marquée `noindex`.

**La limite, dite franchement :** une authentification HTTP simple n'offre
ni second facteur, ni limitation des tentatives, ni expiration de session.
Elle convient à un tableau de bord à un seul utilisateur derrière HTTPS.
Pour aller plus loin, il faudra une vraie session et une limitation des
tentatives — à décider selon l'usage réel.

### Le rapprochement des paiements

Il n'est plus manuel. La référence de commande est transmise à Stripe comme
`client_reference_id`, et l'identifiant de session est enregistré sur la
commande. À la réception du webhook, après vérification de la signature, la
commande passe en « payée » avec l'horodatage. Si le montant payé diffère du
montant attendu, l'écart n'est pas avalé en silence : il est journalisé et
inscrit dans les notes de la commande.

---

## Texte d'origine, conservé pour mémoire

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
| `ADMIN_USER` | Identifiant du tableau de bord | **Absente — /admin répond 404** |
| `ADMIN_PASSWORD` | Mot de passe du tableau de bord | **Absente** |
| `ORDERS_DIR` | Dossier du pilote de secours, en développement | Facultatif |
