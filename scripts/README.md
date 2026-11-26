# Scripts de vérification

Trois scripts, à lancer contre un site déjà démarré. Ils ne modifient ni le
code ni le contenu.

```bash
npm run build
npx next start -p 3000 &
```

## `crawl.mjs` — parcours de toutes les URL

Suit tous les liens internes depuis l'accueil et contrôle, page par page :
le code HTTP, la présence d'un seul `h1`, la longueur du `title` (65
caractères) et de la `meta description` (165 caractères).

```bash
node scripts/crawl.mjs
```

## `test-commande.mjs` — parcours de commande et accessibilité

Déroule une commande complète à 390, 768 et 1280 px : étapes affichées,
choix du déroulement, demande de zone, calcul du total, blocages de
validation, enregistrement. Passe axe-core (WCAG 2.1 AA) à chaque étape.
Vérifie aussi qu'une prestation sans alternative n'affiche pas l'étape
« Déroulement », et qu'une session de paiement forgée dans l'URL n'est
jamais présentée comme payée.

```bash
node scripts/test-commande.mjs
```

## `test-securite.sh` — contrôles serveur

Authentification du tableau de bord, validation serveur des commandes,
vérification de signature des webhooks Stripe, et contrôle que l'identité et
l'adresse n'apparaissent que sur la page des mentions légales.

```bash
BASE_URL=http://127.0.0.1:3000 \
ADMIN_USER=… ADMIN_PASSWORD=… STRIPE_WEBHOOK_SECRET=… \
./scripts/test-securite.sh
```

Le comportement dépend de ce qui est configuré, et c'est voulu :

| Configuration | Ce qui est vérifié |
|---|---|
| `ADMIN_USER` et `ADMIN_PASSWORD` absents | `/admin` et `/api/admin` répondent 404 |
| Les deux présents | 401 sans ou avec de mauvais identifiants, 200 avec les bons |
| `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` absents | le webhook répond 503 |
| Les deux présents | signature absente, forgée ou altérée rejetée en 400, valide acceptée en 200 |

La suite envoie plus de commandes que la limite de débit n'en autorise. Pour
la jouer d'un bout à l'autre, démarrer le serveur avec `ORDER_RATE_LIMIT=200`
et passer la même valeur au script. Sans cette variable, le script teste la
limite elle-même et signale les contrôles qu'elle a empêchés.

## Variables utiles

| Variable | Rôle |
|---|---|
| `BASE_URL` | Adresse du site à tester (défaut `http://127.0.0.1:3000`) |
| `SCREENSHOT_DIR` | Où déposer la capture du récapitulatif de commande |
| `ORDER_RATE_LIMIT` | Relève la limite de commandes par IP, pour les tests |
| `ORDERS_DIR` | Dossier du pilote de stockage de secours (défaut `.data/commandes`) |
