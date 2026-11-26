/**
 * Questions fréquentes propres à certaines prestations.
 *
 * POURQUOI PAS SUR LES 71 FICHES : une FAQ générée à partir d'un modèle
 * produirait la même question répétée sur des dizaines de pages. C'est
 * exactement le contenu dupliqué artificiel qu'il faut éviter, et cela
 * n'aiderait aucun visiteur. Une FAQ n'est ajoutée que là où il existe de
 * vraies questions, propres à la prestation, auxquelles la fiche ne répond
 * pas déjà.
 *
 * Les fiches sans entrée ici n'affichent pas de bloc FAQ et ne portent pas
 * de données structurées FAQPage. C'est voulu.
 *
 * RÈGLES DE RÉDACTION
 * - Une question réellement posée, formulée comme le visiteur la pose.
 * - Une réponse complète, qui ne renvoie pas à la commande pour conclure.
 * - Aucune promesse de résultat, aucun chiffre non vérifiable.
 */

export type QuestionPrestation = { question: string; answer: string };

export const faqParPrestation: Record<string, QuestionPrestation[]> = {
  /* ============ Impôts ============ */

  'declaration-impots-etudiant': [
    {
      question: 'Je n’ai presque rien gagné cette année : dois-je quand même déclarer ?',
      answer:
        'Oui. Dès qu’une déclaration vous est adressée, elle doit être déposée, même sans revenu ou avec un revenu très faible. Ne rien déposer expose à une taxation d’office, qui est en général moins favorable qu’une déclaration remplie. Déposer une déclaration à revenu nul est une démarche normale et sans conséquence.',
    },
    {
      question: 'Mes parents me déclarent-ils encore, ou dois-je faire la mienne ?',
      answer:
        'Vous faites la vôtre dès que vous êtes majeur, même si vous vivez encore chez vos parents et qu’ils vous soutiennent financièrement. Vos parents peuvent de leur côté continuer à faire valoir certaines déductions ; cela n’empêche pas votre propre déclaration.',
    },
    {
      question: 'Je n’ai pas tous mes documents, puis-je commander quand même ?',
      answer:
        'Oui. Vous recevez après la commande la liste exacte des pièces attendues pour votre situation, et le délai ne commence qu’une fois le dossier complet. S’il manque un certificat de salaire ou une attestation, cela vous est signalé plutôt que découvert à la fin.',
    },
  ],

  'declaration-impots-personne-seule-standard': [
    {
      question: 'Quelle est la différence avec la déclaration « situation simple » ?',
      answer:
        'La version simple couvre un revenu unique, sans bien immobilier ni titres. Dès qu’il y a plusieurs employeurs, des rachats de prévoyance, des frais à faire valoir ou une situation qui a changé en cours d’année, c’est cette prestation-ci qui correspond. Si vous commandez la mauvaise, cela vous est dit avant tout traitement et sans frais.',
    },
    {
      question: 'Mes frais professionnels seront-ils pris en compte ?',
      answer:
        'Les frais que vos documents permettent d’établir sont repris : déplacements, repas, formation, selon ce qui s’applique dans votre canton. Il s’agit de reprendre fidèlement ce à quoi vous avez droit, à partir de vos justificatifs — pas de chercher une optimisation, qui relève du conseil fiscal et n’est pas comprise.',
    },
  ],

  'declaration-impots-couple-enfants': [
    {
      question: 'Les frais de garde sont-ils déductibles ?',
      answer:
        'Les frais de garde effectifs sont déductibles dans les limites fixées par votre canton et par le droit fédéral, sur présentation des justificatifs de la crèche, de la maman de jour ou de l’accueil parascolaire. Les montants plafonds varient : ils sont appliqués tels qu’ils sont en vigueur pour l’année concernée.',
    },
    {
      question: 'Nous sommes séparés en cours d’année : laquelle des déclarations commander ?',
      answer:
        'Une séparation change le mode de taxation, et souvent dès l’année de la séparation. Cette prestation ne couvre pas ce cas : décrivez votre situation avant de commander, et la prestation qui correspond vous sera indiquée, ainsi que son prix.',
    },
  ],

  'declaration-impots-retraite': [
    {
      question: 'Pouvez-vous venir chez moi ?',
      answer:
        'Oui. Cette prestation peut se dérouler entièrement chez vous : vous n’avez rien à numériser ni à envoyer, les documents sont repris sur place. C’est le cas le plus fréquent de demande d’intervention à domicile. La zone de déplacement et le délai de rendez-vous sont indiqués au moment de la commande.',
    },
    {
      question: 'Faut-il déclarer le capital retiré d’un 2e pilier ou d’un 3a ?',
      answer:
        'Oui, et ce type de retrait fait l’objet d’une imposition particulière, séparée du revenu ordinaire. Les attestations correspondantes figurent dans la liste des pièces à fournir. Le retrait est repris dans la déclaration tel que les attestations l’établissent.',
    },
  ],

  'declaration-impots-independant': [
    {
      question: 'Ma comptabilité doit-elle être terminée avant de commander ?',
      answer:
        'Oui. Cette prestation reprend des comptes déjà bouclés : elle ne comprend ni la saisie, ni le classement, ni le bouclement. Si votre comptabilité n’est pas à jour, les prestations du domaine Comptabilité s’en occupent d’abord, et la déclaration vient ensuite.',
    },
    {
      question: 'Est-ce que cela remplace une fiduciaire ?',
      answer:
        'Non, et c’est important à dire clairement. Il s’agit d’assistance administrative : remplir la déclaration à partir de vos comptes et de vos documents. Une fiduciaire apporte un conseil fiscal, une révision et une responsabilité professionnelle qui ne sont pas comprises ici. Pour une situation qui le demande, c’est vers elle qu’il faut aller.',
    },
  ],

  'prolongation-delai-fiscal': [
    {
      question: 'Jusqu’à quand peut-on demander un délai ?',
      answer:
        'Avant l’échéance figurant sur votre déclaration. Une demande déposée après ce terme n’est en principe plus recevable, et l’administration peut passer à une taxation d’office. C’est la raison pour laquelle la date limite est demandée dès la commande : si elle est dépassée, cela vous est dit tout de suite.',
    },
    {
      question: 'Le délai est-il accordé automatiquement ?',
      answer:
        'Non. La décision appartient à l’administration cantonale, et aucun résultat ne peut être garanti. Ce qui est fait ici, c’est une demande déposée dans les formes, dans le délai, auprès du bon service — ce qui est précisément ce qui manque dans la plupart des demandes refusées.',
    },
  ],

  'verification-declaration': [
    {
      question: 'J’ai déjà envoyé ma déclaration, est-ce encore utile ?',
      answer:
        'Oui, pour savoir où vous en êtes. La relecture vous dira ce qui semble incomplet ou incohérent. En revanche, une déclaration déjà déposée ne se corrige plus librement : selon le moment, cela passe par un complément ou par une réclamation après taxation, qui n’est pas comprise dans cette prestation.',
    },
  ],

  /* ============ Logement ============ */

  'demande-baisse-loyer': [
    {
      question: 'Sur quoi se fonde une demande de baisse de loyer ?',
      answer:
        'Le plus souvent sur la baisse du taux hypothécaire de référence depuis la dernière fixation de votre loyer. D’autres éléments peuvent compter, comme l’évolution des charges ou une adaptation jamais répercutée. La demande préparée reprend l’historique de votre loyer et les éléments que vos documents permettent d’établir.',
    },
    {
      question: 'Mon bailleur est-il obligé d’accepter ?',
      answer:
        'Non, et aucun résultat n’est garanti. Le bailleur peut refuser ou contester. Ce que fait cette prestation, c’est présenter une demande motivée, chiffrée et adressée dans les formes et les délais — ce qui change la façon dont elle est traitée, sans jamais en garantir l’issue.',
    },
    {
      question: 'Que se passe-t-il si mon bailleur refuse ?',
      answer:
        'La suite relève de l’autorité de conciliation en matière de baux, qui est une procédure gratuite dans la plupart des cantons. Cette démarche n’est pas comprise dans la prestation, et elle n’est pas un conseil juridique : les associations de locataires et l’autorité de conciliation elle-même sont les bons interlocuteurs à ce stade.',
    },
  ],

  'resiliation-bail': [
    {
      question: 'Puis-je partir avant la fin de mon bail ?',
      answer:
        'Une sortie hors échéance suppose en principe de présenter un locataire de remplacement solvable, prêt à reprendre le bail aux mêmes conditions. Sans cela, le loyer reste dû jusqu’au prochain terme. La résiliation préparée vérifie vos échéances et respecte la forme ; elle ne garantit pas qu’une sortie anticipée soit acceptée.',
    },
    {
      question: 'Faut-il que les deux conjoints signent ?',
      answer:
        'Pour le logement de la famille, la résiliation doit en principe être signée par les deux époux ou partenaires enregistrés, et le bailleur doit notifier séparément chacun d’eux. Une résiliation signée d’une seule main peut être inopérante. Le courrier est préparé en tenant compte de votre situation, et vous le signez vous-même.',
    },
  ],

  'restitution-garantie': [
    {
      question: 'Mon bailleur bloque ma garantie : que peut-on faire ?',
      answer:
        'Une garantie de loyer ne peut pas être conservée indéfiniment : passé un certain délai après la fin du bail, le locataire peut en demander la libération si aucune prétention n’a été annoncée dans les formes. Le dossier préparé réunit vos pièces, reconstitue les dates et rédige la demande de libération. L’issue dépend du bailleur et, le cas échéant, de l’autorité.',
    },
  ],

  'dossier-defaut-logement': [
    {
      question: 'Faut-il des photos, et faut-il que vous veniez ?',
      answer:
        'Des photos datées sont presque toujours nécessaires, et c’est la raison pour laquelle cette prestation peut se dérouler sur place : un défaut se constate mieux qu’il ne se décrit. Si vous préférez tout traiter à distance, c’est possible, à condition de fournir des photos nettes et datées de chaque défaut.',
    },
  ],

  /* ============ Subsides ============ */

  'subside-assurance-maladie': [
    {
      question: 'Ai-je droit au subside ?',
      answer:
        'Cela dépend de votre revenu déterminant, de la composition de votre ménage et des barèmes de votre canton, qui changent chaque année. Personne ne peut vous le dire avec certitude avant l’examen de votre dossier par l’autorité compétente — et certainement pas ce site. Ce qui est fait ici, c’est un dossier complet et vérifié, qui ne sera pas refusé pour une pièce manquante.',
    },
    {
      question: 'Est-ce que vous choisissez ou changez mon assurance ?',
      answer:
        'Non, à aucun moment. Il s’agit uniquement de constituer le dossier de demande de subside auprès de l’organe cantonal compétent. La comparaison, le choix, le changement et la résiliation de contrats d’assurance ne font pas partie des prestations proposées.',
    },
    {
      question: 'Le subside est-il versé pour l’année écoulée ?',
      answer:
        'En règle générale, non : le subside s’obtient pour l’avenir, et le dépôt tardif fait perdre les mois antérieurs. C’est pour cela que la date de dépôt compte autant que le contenu du dossier, et que le délai annoncé court dès que vos pièces sont complètes.',
    },
  ],

  'dossier-administratif-social': [
    {
      question: 'Pouvez-vous m’accompagner à un rendez-vous ?',
      answer:
        'Le dossier peut être préparé chez vous, et repris ensemble avant d’être déposé. En revanche, la représentation devant une autorité n’est pas comprise : c’est vous qui vous présentez, avec un dossier en ordre et la marche à suivre. Pour une représentation, il faut un professionnel habilité.',
    },
  ],

  /* ============ Démarches ============ */

  'organisation-documents': [
    {
      question: 'Est-ce que vous venez trier chez moi ?',
      answer:
        'C’est souvent le plus simple, et c’est possible. Trier à distance suppose de tout numériser, ce qui représente plus de travail pour vous que le tri lui-même. Sur place, les documents sont classés, les doublons écartés et un rangement est mis en place que vous pouvez tenir ensuite. À distance reste possible si vous le préférez.',
    },
    {
      question: 'Que devient ce qui est inutile ?',
      answer:
        'Rien n’est jeté sans votre accord. Ce qui semble pouvoir être éliminé vous est présenté séparément, avec la raison, et vous décidez. Les documents qui ont une durée de conservation utile ou légale sont identifiés comme tels et conservés.',
    },
  ],

  'formulaire-complexe': [
    {
      question: 'Pouvez-vous remplir le formulaire à ma place et le signer ?',
      answer:
        'Le formulaire est préparé et complété à partir de vos informations, mais la signature reste la vôtre : un formulaire administratif engage la personne qui le signe. Lorsqu’une identification personnelle est exigée, la démarche vous revient, avec la marche à suivre préparée.',
    },
  ],

  /* ============ Comptabilité ============ */

  'dossier-fiduciaire': [
    {
      question: 'Ma fiduciaire va-t-elle accepter ce dossier ?',
      answer:
        'C’est l’objectif : un dossier classé, des pièces complètes, des justificatifs rapprochés et un récapitulatif lisible. Une fiduciaire facture le temps qu’elle passe à remettre de l’ordre ; un dossier propre lui coûte moins d’heures. Ce qui reste de son ressort — la révision, le bouclement, le conseil fiscal — n’est pas compris ici.',
    },
    {
      question: 'Pouvez-vous travailler dans mes locaux ?',
      answer:
        'Oui, et c’est souvent plus efficace : les pièces sont là, les questions se règlent sur le moment. La zone de déplacement et le délai de rendez-vous sont indiqués lors de la commande.',
    },
  ],

  'classement-justificatifs': [
    {
      question: 'Combien de temps dois-je garder mes justificatifs ?',
      answer:
        'Les pièces comptables et les justificatifs d’une activité indépendante sont soumis à une obligation de conservation de dix ans en droit suisse. Le classement mis en place distingue ce qui relève de cette obligation de ce qui peut être éliminé, pour que vous n’ayez pas à tout garder indéfiniment par précaution.',
    },
  ],

  'suivi-mensuel': [
    {
      question: 'Puis-je arrêter quand je veux ?',
      answer:
        'L’abonnement est conclu pour une durée indéterminée et se résilie pour la fin d’un mois, avec un préavis de trente jours. Il n’y a ni durée minimale, ni frais de résiliation. Les prestations déjà exécutées restent dues.',
    },
  ],

  /* ============ Documents ============ */

  'lettre-contestation': [
    {
      question: 'Est-ce un courrier juridique ?',
      answer:
        'Non. C’est un courrier administratif : factuel, structuré, qui expose votre position, les dates et les montants, et formule une demande claire. Il ne contient ni argumentation juridique, ni référence à des dispositions légales, et ne remplace pas l’intervention d’un juriste lorsque le litige le demande.',
    },
  ],

  'lettre-motivation': [
    {
      question: 'La lettre sera-t-elle écrite par une intelligence artificielle ?',
      answer:
        'La lettre est rédigée à partir de ce que vous transmettez : votre parcours, le poste visé, l’entreprise, ce que vous voulez mettre en avant. Une lettre qui pourrait servir à n’importe qui ne sert à personne, et c’est la première chose qu’un recruteur repère. Les informations que vous donnez sont donc la matière du texte.',
    },
  ],

  /* ============ Packs ============ */

  'pack-demenagement': [
    {
      question: 'Quels organismes faut-il prévenir ?',
      answer:
        'Cela dépend de votre situation : contrôle des habitants, assurance maladie, caisse de pension, employeur, banque, opérateur, services industriels, Poste, assurances, abonnements. La liste est établie pour votre cas précis, parce qu’une liste générique fait toujours oublier l’organisme qui compte.',
    },
    {
      question: 'Faites-vous les annonces à ma place ?',
      answer:
        'Les communications sont préparées et prêtes à partir, mais les annonces qui exigent votre identification — le contrôle des habitants en particulier — restent à faire par vous. La marche à suivre est fournie pour chacune, avec les délais.',
    },
  ],

  'pack-administratif': [
    {
      question: 'Quelles démarches puis-je choisir ?',
      answer:
        'Trois démarches parmi les prestations à CHF 49 ou moins du catalogue. Les déclarations d’impôts et les prestations comptables en sont exclues, de même que toute prestation dont le prix unitaire dépasse CHF 49. Vous indiquez les trois démarches au moment de la commande, et la liste vous est confirmée avant traitement.',
    },
  ],
};

export const faqPour = (slug: string): QuestionPrestation[] => faqParPrestation[slug] ?? [];
