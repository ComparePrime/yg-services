# Documents des clients — proposition avant implémentation

> **Rien n'a été implémenté.** Le parcours de commande ne collecte
> aujourd'hui **aucun document** : c'est une décision de conception, pas un
> oubli. Ce document propose une solution et attend votre arbitrage.

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
