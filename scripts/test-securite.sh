#!/usr/bin/env bash
# Contrôles de sécurité du site, rejouables contre un site démarré.
#
#   BASE_URL        adresse du site (défaut http://127.0.0.1:3000)
#   ADMIN_USER      identifiant du tableau de bord, tel que configuré
#   ADMIN_PASSWORD  mot de passe du tableau de bord
#   STRIPE_WEBHOOK_SECRET  secret de signature, pour tester le webhook
#
# Chaque ligne affiche le code attendu et le code obtenu.
set -uo pipefail

BASE="${BASE_URL:-http://127.0.0.1:3000}"
ECHECS=0

verifier() {
  local libelle="$1" attendu="$2" obtenu="$3"
  if [ "$obtenu" = "429" ] && [ "$attendu" != "429" ]; then
    printf '  ----  %-58s limite de débit atteinte\n' "$libelle"
    printf '        relancer sur un serveur neuf, ou le démarrer avec ORDER_RATE_LIMIT=100\n'
    ECHECS=$((ECHECS + 1))
    return
  fi
  if [ "$attendu" = "$obtenu" ]; then
    printf '  ok    %-58s %s\n' "$libelle" "$obtenu"
  else
    printf '  ECHEC %-58s attendu %s, obtenu %s\n' "$libelle" "$attendu" "$obtenu"
    ECHECS=$((ECHECS + 1))
  fi
}

code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

echo "=== Tableau de bord ==="
if [ -n "${ADMIN_USER:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  verifier "sans en-tête d'authentification" 401 "$(code "$BASE/admin")"
  verifier "mot de passe incorrect" 401 "$(code -u "$ADMIN_USER:faux" "$BASE/admin")"
  verifier "identifiant incorrect" 401 "$(code -u "inconnu:$ADMIN_PASSWORD" "$BASE/admin")"
  verifier "identifiants corrects" 200 "$(code -u "$ADMIN_USER:$ADMIN_PASSWORD" "$BASE/admin")"
  verifier "mise à jour sans authentification" 401 \
    "$(code -X POST "$BASE/api/admin/commande" -F 'reference=X' -F 'statut=annulee' -F 'paiement=payee')"
  verifier "statut invalide, authentifié" 422 \
    "$(code -u "$ADMIN_USER:$ADMIN_PASSWORD" -X POST "$BASE/api/admin/commande" \
       -F 'reference=X' -F 'statut=pirate' -F 'paiement=payee')"
else
  verifier "/admin fermé faute de configuration" 404 "$(code "$BASE/admin")"
  verifier "/api/admin fermé faute de configuration" 404 "$(code -X POST "$BASE/api/admin/commande")"
fi

echo
echo "=== Commandes : contrôles serveur ==="
COMMANDE='{"prestation":"declaration-impots-couple","options":["titres"],"modalite":"distance","reponses":{"prenom":"A","nom":"B","email":"a@b.ch","adresse":"R 1","npa":"1400","localite":"Yverdon","canton":"VD","anneeFiscale":"2025","communeTaxation":"Yverdon","etatCivil":"marie","declarationPrecedente":"oui","bienImmobilier":"non","titres":"oui"},"conditions":true,"consentement":true}'
post() { code -X POST "$BASE/api/commande" -H 'Content-Type: application/json' -d "$1"; }

verifier "commande valide" 200 "$(post "$COMMANDE")"
verifier "option non proposée" 422 "$(post "${COMMANDE/\"titres\"/\"option-inventee\"}")"
verifier "modalité non proposée pour la prestation" 422 \
  "$(post "${COMMANDE/\"modalite\":\"distance\"/\"modalite\":\"domicile\",\"zone\":\"yverdon\"}")"
verifier "zone inexistante" 422 \
  "$(post '{"prestation":"organisation-documents","options":[],"modalite":"domicile","zone":"mars","reponses":{"prenom":"A","nom":"B","email":"a@b.ch","adresse":"R 1","npa":"1400","localite":"Y","canton":"VD","organisme":"X","echeance":"aucune"},"conditions":true,"consentement":true}')"
verifier "modalité absente alors qu'un choix existe" 422 \
  "$(post '{"prestation":"organisation-documents","options":[],"reponses":{"prenom":"A","nom":"B","email":"a@b.ch","adresse":"R 1","npa":"1400","localite":"Y","canton":"VD","organisme":"X","echeance":"aucune"},"conditions":true,"consentement":true}')"
verifier "conditions non acceptées" 422 "$(post "${COMMANDE/\"conditions\":true/\"conditions\":false}")"
verifier "prestation inexistante" 422 \
  "$(post '{"prestation":"nimporte-quoi","options":[],"reponses":{},"conditions":true,"consentement":true}')"
verifier "corps illisible" 400 "$(post 'pas du json')"

if [ -n "${ORDER_RATE_LIMIT:-}" ]; then
  echo "  ----  limite de débit non testée (ORDER_RATE_LIMIT=$ORDER_RATE_LIMIT)"
else
  for _ in 1 2 3 4 5 6 7 8 9 10; do post "$COMMANDE" > /dev/null; done
  verifier "limite de débit après rafale" 429 "$(post "$COMMANDE")"
fi

echo
echo "=== Webhook Stripe : vérification de signature ==="
EVENT='{"id":"evt_test","object":"event","type":"checkout.session.completed","data":{"object":{"id":"cs_test","object":"checkout.session","payment_status":"paid","amount_total":23900,"client_reference_id":"YG-TEST","metadata":{"reference":"YG-TEST","prestation":"declaration-impots-couple"}}}}'

if [ -n "${STRIPE_WEBHOOK_SECRET:-}" ]; then
  verifier "sans signature" 400 \
    "$(code -X POST "$BASE/api/stripe/webhook" -H 'Content-Type: application/json' --data-binary "$EVENT")"
  verifier "signature forgée" 400 \
    "$(code -X POST "$BASE/api/stripe/webhook" -H 'Content-Type: application/json' \
       -H 'stripe-signature: t=1764100000,v1=deadbeef' --data-binary "$EVENT")"

  SIG=$(TS=$(date +%s) SECRET="$STRIPE_WEBHOOK_SECRET" node -e '
    const crypto = require("crypto");
    const ts = process.env.TS;
    const v1 = crypto.createHmac("sha256", process.env.SECRET).update(ts + "." + process.argv[1]).digest("hex");
    console.log("t=" + ts + ",v1=" + v1);
  ' "$EVENT")

  verifier "signature valide" 200 \
    "$(code -X POST "$BASE/api/stripe/webhook" -H 'Content-Type: application/json' \
       -H "stripe-signature: $SIG" --data-binary "$EVENT")"
  verifier "corps modifié après signature" 400 \
    "$(code -X POST "$BASE/api/stripe/webhook" -H 'Content-Type: application/json' \
       -H "stripe-signature: $SIG" --data-binary "${EVENT/23900/999900}")"
else
  verifier "webhook fermé faute de secret" 503 \
    "$(code -X POST "$BASE/api/stripe/webhook" -H 'Content-Type: application/json' --data-binary "$EVENT")"
fi

echo
echo "=== Identité : présente uniquement là où elle est nécessaire ==="
for page in / /assistance-administrative /contact /blog /a-propos /confidentialite; do
  n=$(curl -s "$BASE$page" | grep -ciE 'guiot|yoann|Guisan')
  verifier "aucune identité sur $page" 0 "$n"
done
n=$(curl -s "$BASE/mentions-legales" | grep -ciE 'guiot')
if [ "$n" -ge 1 ]; then
  printf '  ok    %-58s %s\n' "identité présente sur /mentions-legales" "$n"
else
  printf '  ECHEC %-58s manquante\n' "identité présente sur /mentions-legales"
  ECHECS=$((ECHECS + 1))
fi

echo
echo "========== BILAN =========="
if [ "$ECHECS" -eq 0 ]; then echo "Aucun problème détecté."; else echo "$ECHECS contrôle(s) en échec."; fi
exit $((ECHECS > 0))
