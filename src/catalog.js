// Les objets qu'on attrape dans la palette pour les poser sur le robot.
// Chaque objet ne peut aller que dans l'emplacement de son `slot`.

export const SLOTS = {
  brain: { label: 'Cerveau', where: 'dans la tête' },
  tool: { label: 'Outils', where: 'dans les mains' },
  memory: { label: 'Mémoire', where: 'à ses pieds' },
};

export const OBJECTS = [
  {
    id: 'brain',
    slot: 'brain',
    icon: '🧠',
    label: 'Cerveau',
    defaults: { label: 'Cerveau', model: 'claude-sonnet-5', temperature: 0.7, systemPrompt: '' },
  },

  { id: 'mail', slot: 'tool', icon: '✉️', label: 'Envoyer un mail' },
  { id: 'hand', slot: 'tool', icon: '✋', label: 'Agir, manipuler' },
  { id: 'search', slot: 'tool', icon: '🔍', label: 'Chercher sur le web' },
  { id: 'api', slot: 'tool', icon: '🔌', label: 'Appeler une API' },
  { id: 'code', slot: 'tool', icon: '💻', label: 'Exécuter du code' },
  { id: 'agenda', slot: 'tool', icon: '📅', label: 'Gérer un agenda' },

  { id: 'books', slot: 'memory', icon: '📚', label: 'Documents' },
  { id: 'web', slot: 'memory', icon: '🌐', label: 'Site web' },
  { id: 'db', slot: 'memory', icon: '🗄️', label: 'Base de données' },
  { id: 'scroll', slot: 'memory', icon: '📜', label: 'Procédure à suivre' },
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
  tool: [
    { key: 'label', label: 'Nom du tool', type: 'text' },
    { key: 'description', label: 'Ce que fait le tool', type: 'textarea' },
    { key: 'parameters', label: 'Paramètres (un par ligne)', type: 'textarea' },
  ],
  memory: [
    { key: 'label', label: 'Nom', type: 'text' },
    { key: 'source', label: 'Référence (URL, dossier, nom...)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
};

export function newItem(object) {
  return {
    uid: `${object.id}-${Math.random().toString(36).slice(2, 8)}`,
    objectId: object.id,
    label: object.label,
    ...(object.defaults ?? {}),
    ...(object.slot === 'tool' ? { description: '', parameters: '' } : {}),
    ...(object.slot === 'memory' ? { source: '', description: '' } : {}),
  };
}
