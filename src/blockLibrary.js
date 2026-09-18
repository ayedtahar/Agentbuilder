// Catalogue des blocs disponibles pour assembler un agent.
// Chaque type décrit son apparence dans la palette/le canvas et le
// formulaire de configuration affiché dans le panneau latéral.

// Un tool se reconnaît au geste qu'il exécute, une skill à la forme sous
// laquelle la connaissance arrive.
export const TOOL_ICONS = {
  'envoyer un mail': '✉️',
  'agir, manipuler': '✋',
  'chercher sur le web': '🔍',
  'appeler une api': '🔌',
  'exécuter du code': '💻',
  'lire un fichier': '📄',
  'gérer un agenda': '📅',
};

export const SKILL_ICONS = {
  documents: '📚',
  'site web': '🌐',
  'base de données': '🗄️',
  'procédure à suivre': '📜',
  'tour de main': '🎓',
};

export const BLOCK_TYPES = {
  agent: {
    label: 'Agent',
    icon: '⚡',
    color: '#fbbf24',
    tagline: "Le cœur : qui est l'agent",
    droppable: false,
    defaultData: {
      label: 'Mon agent',
      persona: 'Un assistant utile, direct et un peu joueur.',
      goal: 'Aider à assembler et documenter les agents.',
    },
    fields: [
      { key: 'label', label: 'Nom de l’agent', type: 'text' },
      { key: 'persona', label: 'Personnalité', type: 'textarea' },
      { key: 'goal', label: 'Objectif principal', type: 'textarea' },
    ],
  },
  llm: {
    label: 'Cerveau (LLM)',
    icon: '🧠',
    color: '#f97316',
    tagline: 'Le modèle qui pense et décide',
    droppable: true,
    defaultData: {
      label: 'Claude Sonnet 5',
      model: 'claude-sonnet-5',
      temperature: 0.7,
      systemPrompt: '',
    },
    fields: [
      { key: 'label', label: 'Nom du bloc', type: 'text' },
      {
        key: 'model',
        label: 'Modèle',
        type: 'select',
        options: [
          'claude-opus-5',
          'claude-sonnet-5',
          'claude-haiku-4-5',
          'gpt-5',
          'gemini-3-pro',
          'llama-4',
        ],
      },
      { key: 'temperature', label: 'Température', type: 'range', min: 0, max: 1, step: 0.1 },
      { key: 'systemPrompt', label: 'Instructions système', type: 'textarea' },
    ],
  },
  tool: {
    label: 'Tool',
    icon: '✉️',
    color: '#38bdf8',
    tagline: "Un bras : ce que l'agent sait faire",
    droppable: true,
    defaultData: {
      label: 'Envoyer un mail',
      kind: 'envoyer un mail',
      description: '',
      parameters: '',
    },
    fields: [
      { key: 'label', label: 'Nom du tool', type: 'text' },
      { key: 'kind', label: 'Geste', type: 'select', options: Object.keys(TOOL_ICONS) },
      { key: 'description', label: 'Ce que fait le tool', type: 'textarea' },
      { key: 'parameters', label: 'Paramètres (un par ligne)', type: 'textarea' },
    ],
  },
  skill: {
    label: 'Skill / RAG',
    icon: '📚',
    color: '#a78bfa',
    tagline: 'Une mémoire : ce que l’agent sait',
    droppable: true,
    defaultData: {
      label: 'Base de connaissances',
      sourceType: 'documents',
      source: '',
      description: '',
    },
    fields: [
      { key: 'label', label: 'Nom de la skill', type: 'text' },
      { key: 'sourceType', label: 'Forme', type: 'select', options: Object.keys(SKILL_ICONS) },
      { key: 'source', label: 'Référence (URL, dossier, nom...)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

export const PALETTE_ORDER = ['llm', 'tool', 'skill'];

// L'icône d'un bloc suit ce qu'il fait, pas son type : un bloc « envoyer un
// mail » doit se lire comme une enveloppe sur le robot, pas comme une boîte.
export function iconFor(type, data) {
  if (type === 'tool') return TOOL_ICONS[data.kind] ?? BLOCK_TYPES.tool.icon;
  if (type === 'skill') return SKILL_ICONS[data.sourceType] ?? BLOCK_TYPES.skill.icon;
  return BLOCK_TYPES[type].icon;
}
