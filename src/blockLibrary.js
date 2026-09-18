// Catalogue des blocs disponibles pour assembler un agent.
// Chaque type décrit son apparence dans la palette/le canvas et le
// formulaire de configuration affiché dans le panneau latéral.

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
    icon: '🔧',
    color: '#38bdf8',
    tagline: "Une action que l'agent peut exécuter",
    droppable: true,
    defaultData: {
      label: 'Nouvel outil',
      kind: 'function',
      description: '',
      parameters: '',
    },
    fields: [
      { key: 'label', label: 'Nom du tool', type: 'text' },
      {
        key: 'kind',
        label: 'Type',
        type: 'select',
        options: ['function', 'api', 'recherche web', 'code'],
      },
      { key: 'description', label: 'Ce que fait le tool', type: 'textarea' },
      { key: 'parameters', label: 'Paramètres (un par ligne)', type: 'textarea' },
    ],
  },
  skill: {
    label: 'Skill / RAG',
    icon: '📚',
    color: '#a78bfa',
    tagline: 'Une connaissance ou compétence injectée',
    droppable: true,
    defaultData: {
      label: 'Nouvelle skill',
      sourceType: 'documents',
      source: '',
      description: '',
    },
    fields: [
      { key: 'label', label: 'Nom de la skill', type: 'text' },
      {
        key: 'sourceType',
        label: 'Source',
        type: 'select',
        options: ['documents', 'site web', 'api', 'base de données', 'procédure'],
      },
      { key: 'source', label: 'Référence (URL, dossier, nom...)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

export const PALETTE_ORDER = ['llm', 'tool', 'skill'];
