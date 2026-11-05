export type Priority = 'P0' | 'P1' | 'P2'

export interface Story {
  id: string
  title: string
  role: string
  goal: string
  value: string
  priority: Priority
  deps: string[]
}

export interface Epic {
  id: string
  title: string
  color: string
  stories: Story[]
}

/**
 * Toutes les features sont considérées comme non démarrées (TO DO).
 * Le projet va être réécrit proprement : aucun statut d'implémentation
 * n'est conservé ici.
 */
export const EPICS: Epic[] = [
  {
    id: 'E1',
    title: 'Comptes & authentification',
    color: '#6c63ff',
    stories: [
      {
        id: 'US-001',
        title: "Inscription d'un joueur",
        role: 'Visiteur',
        goal: 'créer un compte avec mon email, un nom d’utilisateur et un mot de passe',
        value: 'rejoindre la communauté et conserver ma progression',
        priority: 'P0',
        deps: [],
      },
      {
        id: 'US-002',
        title: 'Connexion, session persistante et déconnexion',
        role: 'Joueur',
        goal: 'me connecter et rester connecté de façon sécurisée',
        value: 'ne pas ressaisir mes identifiants et protéger mon compte',
        priority: 'P0',
        deps: ['US-001'],
      },
      {
        id: 'US-003',
        title: 'Consultation du profil et des statistiques',
        role: 'Joueur',
        goal: 'consulter mon profil et mes statistiques',
        value: 'suivre ma progression dans le temps',
        priority: 'P1',
        deps: ['US-002'],
      },
      {
        id: 'US-004',
        title: 'Changement de mot de passe',
        role: 'Joueur',
        goal: 'modifier mon mot de passe depuis mon profil',
        value: 'sécuriser mon compte',
        priority: 'P2',
        deps: ['US-002'],
      },
      {
        id: 'US-005',
        title: 'Historique des parties',
        role: 'Joueur',
        goal: 'consulter l’historique de mes parties',
        value: 'mesurer mes progrès et revoir mes résultats passés',
        priority: 'P2',
        deps: ['US-003'],
      },
    ],
  },
  {
    id: 'E2',
    title: 'Rooms & lobby',
    color: '#22c55e',
    stories: [
      {
        id: 'US-006',
        title: "Création d'une salle personnalisée",
        role: 'Hôte',
        goal: 'créer une salle en choisissant le nom, le nombre de joueurs, la durée et les filtres d’exercice',
        value: 'adapter la partie à mon groupe',
        priority: 'P0',
        deps: ['US-002'],
      },
      {
        id: 'US-007',
        title: 'Rejoindre une salle (code ou aléatoire)',
        role: 'Joueur',
        goal: 'rejoindre une salle via son code ou en matchmaking',
        value: 'jouer rapidement, même sans partenaire prévu',
        priority: 'P0',
        deps: ['US-006'],
      },
      {
        id: 'US-008',
        title: "Salle d'attente temps réel",
        role: 'Joueur',
        goal: 'voir en direct les participants, leur statut « prêt » et partager le code',
        value: 'coordonner le lancement de la partie',
        priority: 'P1',
        deps: ['US-007'],
      },
      {
        id: 'US-009',
        title: 'Démarrage de la partie',
        role: 'Hôte',
        goal: 'démarrer la partie quand les joueurs sont présents',
        value: 'lancer le défi',
        priority: 'P0',
        deps: ['US-008'],
      },
    ],
  },
  {
    id: 'E3',
    title: 'Exercice & gameplay',
    color: '#38bdf8',
    stories: [
      {
        id: 'US-010',
        title: "Réception et consultation d'un exercice",
        role: 'Joueur',
        goal: 'recevoir un exercice correspondant aux filtres et voir son énoncé ainsi que le code buggé',
        value: 'comprendre le défi à résoudre',
        priority: 'P0',
        deps: ['US-009'],
      },
      {
        id: 'US-011',
        title: 'Rédaction de sa correction',
        role: 'Joueur',
        goal: 'écrire ma correction dans un éditeur adapté au langage',
        value: 'proposer une solution lisible et structurée',
        priority: 'P0',
        deps: ['US-010'],
      },
      {
        id: 'US-012',
        title: 'Phase de jeu : chrono, soumission et suivi',
        role: 'Joueur',
        goal: 'disposer d’un compte à rebours fiable, soumettre une seule fois et voir qui a soumis',
        value: 'jouer équitablement sans dévoiler les réponses des autres',
        priority: 'P0',
        deps: ['US-011'],
      },
      {
        id: 'US-013',
        title: 'Transition automatique vers le vote',
        role: 'Joueur',
        goal: 'que la partie passe automatiquement à la phase de vote',
        value: 'ne jamais rester bloqué par un joueur inactif',
        priority: 'P0',
        deps: ['US-012'],
      },
    ],
  },
  {
    id: 'E4',
    title: 'Vote & résultats',
    color: '#f59e0b',
    stories: [
      {
        id: 'US-014',
        title: 'Vote anonyme et progression',
        role: 'Joueur',
        goal: 'voter pour la meilleure correction sans connaître son auteur et suivre la progression',
        value: 'récompenser la qualité de la solution, pas la popularité',
        priority: 'P0',
        deps: ['US-013'],
      },
      {
        id: 'US-015',
        title: 'Classement, points et solutions de référence',
        role: 'Joueur',
        goal: 'voir le classement, mes points et les solutions officielles',
        value: 'comprendre ce qu’il fallait faire et progresser',
        priority: 'P0',
        deps: ['US-014'],
      },
      {
        id: 'US-016',
        title: 'Départage ludique des égalités',
        role: 'Joueur',
        goal: 'un départage animé en cas d’égalité',
        value: 'préserver le suspense et éviter un résultat arbitraire',
        priority: 'P2',
        deps: ['US-015'],
      },
      {
        id: 'US-017',
        title: 'Rejouer une revanche',
        role: 'Joueur',
        goal: 'relancer une nouvelle partie depuis l’écran de résultats',
        value: 'enchaîner rapidement sur un nouveau défi',
        priority: 'P2',
        deps: ['US-015'],
      },
    ],
  },
  {
    id: 'E5',
    title: 'Premium & analyse IA',
    color: '#a855f7',
    stories: [
      {
        id: 'US-018',
        title: 'Analyse IA de sa soumission',
        role: 'Membre Premium',
        goal: 'que ma soumission soit analysée par l’IA',
        value: 'obtenir un feedback détaillé sans attendre la fin de la partie',
        priority: 'P1',
        deps: ['US-012'],
      },
      {
        id: 'US-019',
        title: 'Affichage du feedback IA',
        role: 'Membre Premium',
        goal: 'consulter mon analyse IA dans l’écran de résultats',
        value: 'identifier mes points forts et mes axes d’amélioration',
        priority: 'P1',
        deps: ['US-018'],
      },
      {
        id: 'US-020',
        title: "Notification d'analyse IA prête",
        role: 'Membre Premium',
        goal: 'être notifié dès que mon analyse est disponible',
        value: 'consulter mon feedback sans recharger la page',
        priority: 'P2',
        deps: ['US-018'],
      },
      {
        id: 'US-021',
        title: 'Découverte et activation de Premium',
        role: 'Joueur',
        goal: 'comprendre les avantages du Premium et l’activer',
        value: 'accéder à l’analyse IA',
        priority: 'P1',
        deps: ['US-002'],
      },
    ],
  },
  {
    id: 'E6',
    title: 'Expérience utilisateur',
    color: '#ec4899',
    stories: [
      {
        id: 'US-022',
        title: 'Landing page de présentation',
        role: 'Visiteur',
        goal: 'découvrir le concept et les bénéfices du produit',
        value: 'décider de m’inscrire',
        priority: 'P1',
        deps: [],
      },
      {
        id: 'US-023',
        title: 'Tableau de bord joueur',
        role: 'Joueur',
        goal: 'accéder rapidement à la création ou au rejoindre d’une salle et voir mes statistiques',
        value: 'lancer une partie en un minimum d’actions',
        priority: 'P1',
        deps: ['US-002'],
      },
      {
        id: 'US-024',
        title: 'Choix du thème et des sons',
        role: 'Joueur',
        goal: 'choisir un thème clair ou sombre et couper les sons',
        value: 'personnaliser mon confort d’utilisation',
        priority: 'P2',
        deps: [],
      },
      {
        id: 'US-025',
        title: 'Navigation protégée et gestion des erreurs',
        role: 'Joueur',
        goal: 'être redirigé si je ne suis pas connecté et recevoir des messages d’erreur compréhensibles',
        value: 'ne jamais me retrouver bloqué ou face à une erreur technique',
        priority: 'P1',
        deps: ['US-002'],
      },
      {
        id: 'US-026',
        title: 'Expérience responsive mobile',
        role: 'Joueur',
        goal: 'utiliser la plateforme sur mobile',
        value: 'jouer et suivre mes parties où que je sois',
        priority: 'P2',
        deps: ['US-022'],
      },
    ],
  },
  {
    id: 'E7',
    title: 'Sécurité, qualité & exploitation',
    color: '#14b8a6',
    stories: [
      {
        id: 'US-027',
        title: 'Sécurité des soumissions de code',
        role: 'Joueur',
        goal: 'que mon code ne soit jamais exécuté sur le serveur et que les entrées soient validées',
        value: 'soumettre sereinement et en toute confiance',
        priority: 'P0',
        deps: ['US-012'],
      },
      {
        id: 'US-028',
        title: 'Sécurité des comptes et de l’API',
        role: 'Joueur',
        goal: 'que mes identifiants et les échanges avec l’API soient protégés',
        value: 'préserver ma confiance et mes données',
        priority: 'P0',
        deps: ['US-001'],
      },
      {
        id: 'US-029',
        title: 'Déploiement et initialisation',
        role: 'Développeur',
        goal: 'démarrer et déployer la plateforme facilement',
        value: 'la rendre accessible et reproductible',
        priority: 'P1',
        deps: [],
      },
      {
        id: 'US-030',
        title: 'Tests automatisés et qualité',
        role: 'Développeur',
        goal: 'des tests automatisés et des règles de qualité',
        value: 'garantir la fiabilité et éviter les régressions',
        priority: 'P2',
        deps: ['US-029'],
      },
    ],
  },
]

export const ALL_STORIES: Story[] = EPICS.flatMap((epic) => epic.stories)

export const STORY_BY_ID: Record<string, Story> = Object.fromEntries(
  ALL_STORIES.map((story) => [story.id, story]),
)

export const EPIC_BY_STORY: Record<string, string> = Object.fromEntries(
  EPICS.flatMap((epic) => epic.stories.map((story) => [story.id, epic.id])),
)

export const EPIC_BY_ID: Record<string, Epic> = Object.fromEntries(
  EPICS.map((epic) => [epic.id, epic]),
)
