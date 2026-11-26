# Scripts de vérification

Ces scripts tournent contre un site déjà démarré. Ils ne modifient rien.

```bash
npm run build && npx next start -p 3000 &
node scripts/crawl.mjs            # parcourt toutes les URL : statut, H1, titres, descriptions
node scripts/test-commande.mjs    # parcours de commande complet + axe-core, à 3 largeurs
```

`BASE_URL` permet de viser une autre adresse (par exemple le site déployé).
`SCREENSHOT_DIR` indique où déposer la capture du récapitulatif.
