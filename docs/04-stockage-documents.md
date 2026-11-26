# Documents des clients — proposition avant implémentation

> **État au 26 novembre 2026 : la solution est retenue et intégrée au
> parcours client.** Il reste une action de votre part : créer la boîte de
> dépôt dans votre Manager Infomaniak et coller son lien. Tant que ce lien
> n'existe pas, le site ne promet aucun dépôt — il annonce que les pièces
> seront demandées par un message séparé. Le parcours de commande ne
> collecte toujours **aucun document** : c'est une décision de conception.
>
> Ce qui a été construit depuis la première version de ce document est
> décrit à la fin, sous « Ce qui est en place ».

## Le problème

Les prestations du catalogue supposent des pièces qui sont, pour certaines,
des **données sensibles** au sens de la nLPD ou des données dont la fuite
causerait un dommage réel :

| Pièce | Nature |
|---|---|
| Certificats de salaire, relevés bancaires | Données financières |
| Frais médicaux, attestations d'assurance maladie | **Données de santé — sensibles (nLPD art. 5 let. c)** |
| Pièces d'identité, permis de séjour | Identité, risque d'usurpation |
| Décisions de subside, dossiers sociaux | **Données sensibles** |
| Baux, décomptes de charges | Données personnelles ordinaires |

L'infrastructure actuelle **ne convient pas** pour ces pièces :

- **Netlify** sert des fichiers statiques et des fonctions sans état. Il n'y
  a aucun stockage de fichiers, et l'hébergeur est américain.
- **Le formulaire de contact** accepte déjà une pièce jointe de 5 Mo, qui
  part par **courriel** et finit dans la boîte Infomaniak. Pour un plan de
  situation ou une capture d'écran, c'est acceptable. Pour un certificat de
  salaire ou un frais médical, non : le courriel n'est pas chiffré de bout en
  bout, la pièce reste dans la boîte sans durée de conservation définie, et
  elle se retrouve dupliquée dans les sauvegardes et sur chaque appareil
  synchronisé.

C'est pourquoi le parcours de commande affiche, à chaque étape :
« Aucun document ne se transmet à cette étape. »

## Ce que je recommande

### Solution retenue : boîte de dépôt kDrive (Infomaniak)

Vous êtes déjà chez Infomaniak pour la messagerie. kDrive propose une
fonction de **boîte de dépôt** : vous créez un lien de dépôt, le client y
envoie ses pièces, elles arrivent dans un dossier chez vous. Le client ne
voit rien d'autre et ne peut rien télécharger.

Pourquoi c'est la bonne réponse ici :

- **Données en Suisse**, chez un hébergeur suisse, sous droit suisse. C'est
  l'argument déterminant pour des données de santé.
- **Aucun document ne transite par le site.** La surface d'attaque du site
  reste nulle sur ce point : pas de stockage, pas de lien de téléchargement,
  pas de donnée sensible dans une base.
- **Lien par dossier, à durée limitée et protégé par mot de passe** : le lien
  est transmis dans le message de confirmation, il expire, il ne donne accès
  à rien d'autre que le dépôt.
- **Aucun développement**, donc aucune faille introduite par moi. C'est un
  avantage réel, pas une facilité : un système de dépôt fait maison est
  exactement le genre de composant où une erreur coûte cher.
- **Coût** : inclus dans une offre kDrive, de l'ordre de CHF 50 à 120 par an
  selon l'espace. **Je n'ai souscrit à rien.**

Ce qu'il reste à mettre en place, et qui ne dépend pas du code :
1. un dossier par commande, nommé avec la référence (`YG-26XXXX-XXX`) ;
2. une durée de conservation écrite, puis appliquée — je suggère la durée
   légale de conservation des pièces comptables pour ce qui la concerne, et
   la suppression à la fin du mandat pour le reste ;
3. le lien de dépôt inséré dans le message de confirmation que vous envoyez
   après la commande.

### Ce que je ne recommande pas

- **SwissTransfer** : gratuit et suisse, mais le lien est utilisable par
  quiconque le possède et la durée de rétention est imposée. Acceptable pour
  un document anodin, pas pour un dossier fiscal.
- **Un dépôt construit dans le site**, avec un stockage objet suisse
  (Infomaniak Swiss Backup, Exoscale SOS) et des liens signés. C'est
  techniquement faisable et ce serait la meilleure expérience client. Mais
  cela demande une base de données, une authentification, une gestion des
  durées de conservation, une journalisation des accès et un chiffrement au
  repos — et surtout, cela vous rend **responsable de la sécurité d'un
  système que vous exploitez**. À envisager quand le volume le justifiera,
  pas pour démarrer.
- **Google Drive, Dropbox, WeTransfer** : hébergement hors de Suisse pour des
  données de santé. À écarter.

## Correctif que je propose en attendant

Le formulaire de contact accepte toujours une pièce jointe de 5 Mo acheminée
par courriel. Je propose, **avec votre accord** :

1. d'ajouter sous le champ une mention explicite : « N'joignez pas de
   document contenant des données médicales, financières ou une pièce
   d'identité. Ces pièces vous seront demandées par un canal sécurisé. » ;
2. de restreindre les types acceptés aux formats de capture et de texte, en
   retirant le reste ;
3. ou, si vous préférez, de retirer purement et simplement la pièce jointe
   du formulaire de contact une fois la boîte de dépôt en place.

## Décision attendue de votre part

1. Accord pour la boîte de dépôt kDrive, et souscription de l'offre par
   vous-même.
2. Durée de conservation que vous souhaitez annoncer dans la politique de
   confidentialité.
3. Lequel des trois correctifs ci-dessus pour le formulaire de contact.

Dès que la boîte de dépôt existe, j'ajoute le lien dans le message de
confirmation et je mets à jour la page de confidentialité pour décrire le
circuit réel des documents.


---

## Ce qui est en place

### Dans le code

- **`src/config/documents.ts`** — toute la configuration du dépôt : lien,
  protection par mot de passe, durée de validité, durées de conservation,
  marche à suivre, garanties annoncées, et la liste de ce qui ne doit jamais
  partir par courriel.
- **Deux modes, qui cohabitent.** Une boîte commune (`depotUrl`), ou un lien
  propre à chaque commande, collé depuis le tableau de bord. Le lien de la
  commande prend le pas sur le lien commun.
- **Contrôle du lien.** Le champ du tableau de bord n'accepte qu'une adresse
  `https` d'Infomaniak. Une erreur de copie ne peut pas envoyer un client
  déposer ses pièces ailleurs.
- **Dégradation honnête.** Sans lien configuré, la confirmation et le
  courriel disent que les pièces seront demandées séparément. Aucune
  promesse de dépôt n'est affichée tant que le dépôt n'existe pas.

### Dans le parcours client

- La **page de confirmation** affiche le bouton de dépôt, avec le rappel de
  nommer les fichiers par la référence de commande.
- Le **courriel de confirmation** reprend le lien, la consigne de nommage,
  la durée de validité et la liste des pièces à ne jamais envoyer par
  courriel.
- Une **page publique** `/transmission-securisee` explique le circuit, les
  garanties, les durées de conservation, et répond aux cinq questions qui
  reviennent — dont « si quelqu'un trouve mon lien, peut-il voir mes
  documents ? ».
- Le **formulaire de contact** avertit désormais explicitement de ne pas y
  joindre de certificat de salaire, de relevé bancaire, de frais médicaux ni
  de pièce d'identité, et renvoie vers le dépôt. C'était le correctif n° 1
  proposé plus haut ; il est appliqué.
- La **politique de confidentialité** décrit le circuit réel et nomme les
  sous-traitants avec leur pays.

### Vérifications faites sur la solution Infomaniak

| Point demandé | Ce que j'ai pu établir |
|---|---|
| Sécurité | Transfert chiffré en TLS 1.3 et chiffrement au repos en AES-256 avec une clé par espace kDrive, selon la documentation d'Infomaniak. Certains tests de presse mentionnent encore AES-128, ce qui contredit la documentation officielle. |
| Droits d'accès | Une boîte de dépôt n'autorise que l'envoi. Celui qui a le lien ne peut ni lister, ni ouvrir, ni télécharger. C'est la propriété de sécurité déterminante. |
| Risques des liens publics | Un lien de dépôt qui fuite permet de recevoir un fichier indésirable, pas de lire un dossier. Un lien de **partage**, à l'inverse, donne accès au contenu : il ne doit jamais servir pour ces documents. Le tableau de bord ne le dit pas seulement, il le rappelle sous le champ. |
| Protection par mot de passe et expiration | Disponibles sur la boîte de dépôt, avec notification par courriel à chaque envoi et limitation de l'espace. **Certaines de ces options sont réservées aux offres payantes** : à vérifier sur votre formule avant de vous y fier. |
| Localisation des données | Centres de données d'Infomaniak en Suisse, certifiés ISO 27001 selon leur FAQ. Les sources divergent sur la communication de l'emplacement précis. |
| Durée de conservation et suppression | À définir par vous dans kDrive ; les durées annoncées au client sont déjà écrites dans `documents.conservation` et affichées sur la page publique. |
| Compatibilité avec le site | Totale, et c'est l'intérêt : aucun document ne transite par le site, aucun fichier n'y est stocké, aucun lien de téléchargement n'y est publié. Il n'y a donc rien à y dérober. |
| Chiffrement avec votre propre clé | Annoncé comme à venir par Infomaniak. Aujourd'hui, les clés sont détenues par l'hébergeur. |

### Ce qui reste à faire, de votre côté

1. Créer la boîte de dépôt dans le Manager Infomaniak, avec mot de passe et
   date d'expiration.
2. Vérifier que votre formule donne accès à ces options avancées.
3. Me communiquer le lien, ou le coller dans `documents.depotUrl`.
4. Décider des durées de conservation à annoncer.

Sources : [Infomaniak — gérer les boîtes de dépôt kDrive](https://www.infomaniak.com/en/support/faq/2386/manage-kdrive-drop-boxes), [Infomaniak — sécurité des données kDrive](https://www.infomaniak.com/en/support/faq/2462/understanding-kdrive-data-security), [Clubic — test de kDrive](https://www.clubic.com/stockage-en-ligne/avis-372130-kdrive.html).
