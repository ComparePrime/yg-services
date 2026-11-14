export type FaqItem = {
  question: string;
  answer: string;
  category: 'Sites internet' | 'Assistance administrative' | 'Général';
};

/**
 * Questions fréquentes.
 * Les deux activités ont leurs propres questions : celles des entreprises sur
 * la création de sites ne sont jamais mélangées à celles des particuliers sur
 * l'administration.
 */
export const faqItems: FaqItem[] = [
  /* ---------------- Sites internet ---------------- */
  {
    category: 'Sites internet',
    question: 'Combien coûte un site internet en Suisse ?',
    answer:
      'Le prix dépend surtout du nombre de pages, des fonctionnalités et du travail de contenu. YG Services propose trois formules : un site vitrine pour une présence professionnelle, une formule orientée visibilité, et un devis sur mesure pour les projets qui demandent des fonctionnalités spécifiques. Le montant est annoncé avant le début du travail, sans coût qui apparaît en cours de route.',
  },
  {
    category: 'Sites internet',
    question: 'Combien de temps faut-il pour créer un site ?',
    answer:
      'Pour un site vitrine, comptez généralement deux à quatre semaines une fois les contenus disponibles. Le délai dépend surtout de la rapidité des allers-retours et de la fourniture des textes et des photos. Une estimation réaliste est donnée dès le devis.',
  },
  {
    category: 'Sites internet',
    question: 'Travaillez-vous uniquement à Yverdon-les-Bains ?',
    answer:
      'YG Services est basé à Yverdon-les-Bains et travaille beaucoup dans le Nord vaudois et le canton de Vaud. Un projet web se mène toutefois très bien à distance : des clients de toute la Suisse romande sont accompagnés de cette manière.',
  },
  {
    category: 'Sites internet',
    question: 'Travaillez-vous avec les indépendants et les PME ?',
    answer:
      'Oui, c’est la clientèle principale de cette activité. Une petite structure a besoin d’un site clair, rapide et qui génère des demandes, pas d’une vitrine décorative. Les particuliers qui ont un projet de site sont également accompagnés.',
  },
  {
    category: 'Sites internet',
    question: 'Le référencement est-il inclus ?',
    answer:
      'Chaque site livré est optimisé techniquement : structure des titres, métadonnées, vitesse, version mobile, données structurées. La formule Pro va plus loin sur le référencement local et le contenu, avec la configuration de la Search Console et le suivi des performances.',
  },
  {
    category: 'Sites internet',
    question: 'Peut-on refaire un site qui existe déjà ?',
    answer:
      'Oui. YG Services regarde d’abord ce qui fonctionne sur le site actuel, ce qui est à conserver et ce qui doit être repris. Le but n’est pas de tout jeter, mais d’obtenir un résultat plus clair et plus efficace.',
  },
  {
    category: 'Sites internet',
    question: 'À qui appartient le site une fois livré ?',
    answer:
      'À vous, ainsi que le nom de domaine. Vous restez propriétaire de votre site et pouvez en disposer librement, y compris le confier à un autre prestataire par la suite.',
  },

  /* ---------------- Assistance administrative ---------------- */
  {
    category: 'Assistance administrative',
    question: 'Quelles démarches administratives sont prises en charge ?',
    answer:
      'Les démarches du quotidien : constitution de dossiers, remplissage de formulaires, courriers à une administration, à une gérance ou à une entreprise, changements d’adresse et de situation, organisation des documents et préparation des pièces fiscales. Si votre demande sort de ce cadre, cela vous est dit franchement.',
  },
  {
    category: 'Assistance administrative',
    question: 'Pouvez-vous rédiger un courrier administratif ?',
    answer:
      'Oui, c’est une demande très fréquente. Vous expliquez la situation avec vos mots, YG Services rédige un courrier clair et adapté au destinataire. Vous le relisez, et il est ajusté si nécessaire avant envoi.',
  },
  {
    category: 'Assistance administrative',
    question: 'Proposez-vous un accompagnement régulier ?',
    answer:
      'Oui. L’accompagnement peut être ponctuel, pour une démarche précise, ou régulier, pour suivre le courrier, les échéances et le classement dans la durée. Le rythme est défini avec vous.',
  },
  {
    category: 'Assistance administrative',
    question: 'Êtes-vous fiscaliste ou conseiller juridique ?',
    answer:
      'Non. YG Services n’est ni fiscaliste, ni fiduciaire, ni avocat, ni notaire. La prestation est administrative et organisationnelle : elle consiste à réunir les bons documents, à les classer et à préparer le dossier. Lorsqu’une situation relève d’un professionnel agréé, cela vous est indiqué.',
  },
  {
    category: 'Assistance administrative',
    question: 'Que deviennent les documents transmis ?',
    answer:
      'Ils ne servent qu’à traiter votre demande. Ils ne sont transmis à aucun tiers sans votre accord et sont supprimés sur simple demande, sous réserve des durées de conservation légales.',
  },

  /* ---------------- Général ---------------- */
  {
    category: 'Général',
    question: 'Comment se déroule une demande ?',
    answer:
      'Vous décrivez votre situation via le formulaire. Une réponse vous parvient avec ce qui peut être fait, comment, dans quel délai et à quel prix. Aucun engagement à ce stade.',
  },
  {
    category: 'Général',
    question: 'Je ne sais pas quel service correspond à mon besoin, que faire ?',
    answer:
      'Écrivez sans chercher à choisir une catégorie. Décrivez simplement ce qui vous pose problème : la réponse vous indiquera si YG Services peut vous aider, et de quelle manière.',
  },
  {
    category: 'Général',
    question: 'Dans quel délai obtient-on une réponse ?',
    answer:
      'Généralement sous 24 à 48 heures ouvrables, par e-mail.',
  },
];
