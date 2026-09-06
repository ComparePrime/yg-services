# Fichiers de marque

`logo-yg-source.png` est le logo d'origine fourni par Yoann : verrouillage
vertical complet, fond transparent, 1254 × 1254.

Ce dossier n'est **pas** publié sur le site. Il conserve le fichier maître pour
pouvoir régénérer les déclinaisons si le logo évolue.

Les versions utilisées par le site se trouvent dans `public/images/` :

| Fichier | Contenu | Utilisé pour |
| --- | --- | --- |
| `logo-yg-horizontal.png` | Monogramme + « SERVICES » côte à côte | En-tête du site |
| `logo-yg-horizontal-clair.png` | Idem, en blanc | Image de partage, fonds sombres |
| `logo-yg-complet.png` | Verrouillage d'origine avec la signature | Fonds clairs, documents |
| `logo-yg-complet-clair.png` | Idem, en blanc | Pied de page |
| `logo-yg-mark.png` | Monogramme YG seul | Avatars, réseaux sociaux |

Les icônes de navigateur sont dans `src/app/icon.png` et `src/app/apple-icon.png`,
plus `public/icon-192.png` et `public/icon-512.png` pour le manifeste.

Le verrouillage horizontal a été composé à partir du fichier d'origine : le logo
vertical devient illisible dans un en-tête de 72 px de haut. Si vous disposez
d'une version horizontale officielle, remplacez simplement les deux fichiers
`logo-yg-horizontal*.png` en conservant les mêmes noms.

## Couleurs de la marque

| Rôle | Valeur |
| --- | --- |
| Encre du logo | `#1c2026` |
| Bleu du logo | `#578ebe` |

Le bleu du logo est repris comme couleur d'accent du site (`--color-accent-500`
dans `src/app/globals.css`). Pour du texte, utilisez les nuances 600 et plus
foncées sur fond clair, 300 et 400 sur fond sombre : ce sont celles qui
respectent le contraste AA.
