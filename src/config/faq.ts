export type FaqItem = { question: string; answer: string; category: 'Sites web' | 'Admin & optimisation' | 'Général' };

export const faqItems: FaqItem[] = [
  {
    category: 'Sites web',
    question: 'Combien coûte un site internet en Suisse ?',
    answer:
      "Cela dépend surtout du nombre de pages, des fonctionnalités et du travail de contenu. Chez moi, un site vitrine commence à la formule Essentiel, un site pensé pour la visibilité correspond plutôt à la formule Pro, et tout ce qui demande des fonctionnalités spécifiques passe par un devis. Je vous annonce toujours le montant avant de commencer, sans coût qui apparaît en cours de route.",
  },
  {
    category: 'Sites web',
    question: 'Combien de temps faut-il pour créer un site ?',
    answer:
      "Pour un site vitrine, comptez généralement deux à quatre semaines une fois les contenus disponibles. Le délai dépend surtout de la rapidité des allers-retours et de la fourniture des textes et des photos. Je vous donne une estimation réaliste dès le devis.",
  },
  {
    category: 'Sites web',
    question: 'Travaillez-vous uniquement à Yverdon-les-Bains ?',
    answer:
      "Je suis basé à Yverdon-les-Bains et je travaille beaucoup dans le Nord vaudois et le canton de Vaud. Cela dit, un projet web se mène très bien à distance : je collabore avec des clients partout en Suisse romande et en Suisse.",
  },
  {
    category: 'Sites web',
    question: 'Pouvez-vous créer un site pour une petite entreprise ou une personne à son compte ?',
    answer:
      "Oui, c'est même le cas le plus fréquent. Une petite structure a besoin d'un site clair, rapide et qui génère des demandes. C'est exactement ce que je construis.",
  },
  {
    category: 'Sites web',
    question: 'Faites-vous également le référencement ?',
    answer:
      "Oui. Chaque site que je livre est optimisé techniquement : structure des titres, métadonnées, vitesse, version mobile, données structurées. Avec la formule Pro, je vais plus loin sur le référencement local et le contenu.",
  },
  {
    category: 'Sites web',
    question: 'Puis-je faire refaire un site qui existe déjà ?',
    answer:
      "Bien sûr. Je regarde d'abord ce qui fonctionne sur votre site actuel, ce qui est à conserver et ce qui doit être repris. Le but n'est pas de tout jeter, mais d'obtenir un résultat plus clair et plus efficace.",
  },
  {
    category: 'Admin & optimisation',
    question: 'Pouvez-vous analyser mes assurances ?',
    answer:
      "Oui. Vous me transmettez vos contrats et je regarde vos garanties, vos primes, vos franchises et les éventuels doublons. Je vous rends un point de situation clair et je vous indique les possibilités d'optimisation. Je ne promets aucune économie avant d'avoir vu vos documents.",
  },
  {
    category: 'Admin & optimisation',
    question: "Pouvez-vous m'aider à demander une baisse de loyer ?",
    answer:
      "Je peux vous aider à préparer la démarche et à rédiger le courrier. En revanche, je ne peux pas vous garantir qu'une baisse est fondée dans votre situation : cela dépend de plusieurs éléments propres à votre bail. Si votre dossier nécessite un avis juridique, je vous le dirai.",
  },
  {
    category: 'Admin & optimisation',
    question: 'Êtes-vous fiscaliste ?',
    answer:
      "Non. Je ne suis ni fiscaliste, ni fiduciaire, ni conseiller juridique. Pour les impôts, mon rôle est administratif et organisationnel : je vous aide à réunir les bons documents, à les classer et à préparer les questions utiles pour le professionnel qui traitera votre déclaration.",
  },
  {
    category: 'Admin & optimisation',
    question: 'Pouvez-vous rédiger un courrier administratif ?',
    answer:
      "Oui, c'est une demande très fréquente. Vous m'expliquez la situation avec vos mots, je rédige un courrier clair et adapté au destinataire. Vous le relisez, et je l'ajuste si nécessaire.",
  },
  {
    category: 'Général',
    question: 'Comment se déroule une demande ?',
    answer:
      "Vous m'écrivez via le formulaire en décrivant simplement votre situation. Je vous réponds personnellement, je vous pose quelques questions si besoin, puis je vous dis ce que je peux faire, comment et à quel prix. Aucun engagement à ce stade.",
  },
  {
    category: 'Général',
    question: 'Je ne sais pas quel service correspond à mon besoin, que faire ?',
    answer:
      "Écrivez-moi sans chercher à choisir une catégorie. Décrivez simplement ce qui vous pose problème : c'est à moi de vous dire si je peux vous aider, et de quelle manière.",
  },
];
