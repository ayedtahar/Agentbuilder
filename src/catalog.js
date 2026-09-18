// Les quatre objets qu'on attrape en haut pour les poser sur le robot.

export const OBJECTS = [
  {
    id: 'brain',
    slot: 'brain',
    icon: '🧠',
    label: 'Cerveau',
    hint: 'dans sa tête',
    defaults: { label: 'Cerveau', model: 'claude-sonnet-5', temperature: 0.7, systemPrompt: '' },
  },
  {
    id: 'eyes',
    slot: 'skill',
    icon: '👀',
    label: 'Skill',
    hint: 'sur son visage',
    defaults: { label: 'Nouvelle skill', description: '' },
  },
  {
    id: 'tool',
    slot: 'tool',
    icon: '🔨',
    label: 'Outil',
    hint: 'un bras de plus',
    defaults: { label: 'Nouvel outil', description: '', parameters: '' },
  },
  {
    id: 'rag',
    slot: 'rag',
    icon: '📚',
    label: 'RAG',
    hint: 'sur son torse',
    defaults: { label: 'Base de connaissances', source: '', description: '' },
  },
];

export const OBJECTS_BY_ID = Object.fromEntries(OBJECTS.map((o) => [o.id, o]));

const MODELS = [
  'claude-opus-5',
  'claude-sonnet-5',
  'claude-haiku-4-5',
  'gpt-5',
  'gemini-3-pro',
  'llama-4',
];

export const FIELDS = {
  brain: [
    { key: 'label', label: 'Nom', type: 'text' },
    { key: 'model', label: 'Modèle', type: 'select', options: MODELS },
    { key: 'temperature', label: 'Température', type: 'range', min: 0, max: 1, step: 0.1 },
    { key: 'systemPrompt', label: 'Instructions système', type: 'textarea' },
  ],
  skill: [
    { key: 'label', label: 'Nom de la skill', type: 'text' },
    { key: 'description', label: 'Ce que l’agent sait faire', type: 'textarea' },
  ],
  tool: [
    { key: 'label', label: 'Nom de l’outil', type: 'text' },
    { key: 'description', label: 'Ce que fait l’outil', type: 'textarea' },
    { key: 'parameters', label: 'Paramètres (un par ligne)', type: 'textarea' },
  ],
  rag: [
    { key: 'label', label: 'Nom', type: 'text' },
    { key: 'source', label: 'Référence (URL, dossier, nom...)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
};

let counter = 0;

export function newItem(object) {
  counter += 1;
  return { uid: `${object.id}-${counter}`, objectId: object.id, ...object.defaults };
}
