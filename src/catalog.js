// Les quatre objets qu'on attrape en haut pour les poser sur le robot.
//
// Chaque objet porte les deux moitiés de la métaphore : la partie du corps
// (`part`) et ce qu'elle représente dans l'agent (`role`). Les deux voyagent
// ensemble partout dans l'interface, pour qu'on n'ait jamais à deviner que
// « les yeux » veut dire « une skill ».

export const OBJECTS = [
  {
    id: 'brain',
    slot: 'brain',
    icon: '🧠',
    part: 'Cerveau',
    role: 'le modèle',
    defaults: { label: 'Cerveau', model: 'claude-opus-5', effort: 'high', systemPrompt: '' },
  },
  {
    id: 'eyes',
    slot: 'skill',
    icon: '👀',
    part: 'Yeux',
    role: 'une skill',
    defaults: { label: 'Nouvelle skill', description: '' },
  },
  {
    id: 'tool',
    slot: 'tool',
    icon: '🔨',
    part: 'Bras',
    role: 'un tool',
    defaults: { label: 'Nouveau tool', description: '', parameters: '' },
  },
  {
    id: 'rag',
    slot: 'rag',
    icon: '📚',
    part: 'Livres',
    role: 'le RAG',
    defaults: { label: 'Base de connaissances', source: '', description: '' },
  },
];

export const OBJECTS_BY_ID = Object.fromEntries(OBJECTS.map((o) => [o.id, o]));

/** « Yeux · une skill » — la forme qu'on affiche partout où l'objet est nommé. */
export function pairing(objectId) {
  const o = OBJECTS_BY_ID[objectId];
  return `${o.part} · ${o.role}`;
}

// Seuls des modèles Claude : c'est la seule API que l'app sait appeler, et
// proposer les autres laisserait croire qu'ils sont branchés.
const MODELS = ['claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'];

// Remplace la température, rejetée par une erreur 400 sur les modèles récents.
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];

export const FIELDS = {
  brain: [
    { key: 'label', label: 'Nom', type: 'text' },
    { key: 'model', label: 'Modèle', type: 'select', options: MODELS },
    { key: 'effort', label: 'Effort', type: 'select', options: EFFORTS },
    { key: 'systemPrompt', label: 'Instructions système', type: 'textarea' },
  ],
  skill: [
    { key: 'label', label: 'Nom de la skill', type: 'text' },
    { key: 'description', label: 'Ce que ces yeux savent faire', type: 'textarea' },
  ],
  tool: [
    { key: 'label', label: 'Nom du tool', type: 'text' },
    { key: 'description', label: 'Ce que ce bras sait faire', type: 'textarea' },
    { key: 'parameters', label: 'Paramètres du tool (un par ligne)', type: 'textarea' },
  ],
  rag: [
    { key: 'label', label: 'Nom de la base', type: 'text' },
    { key: 'source', label: 'Source du RAG (URL, dossier, nom...)', type: 'text' },
    { key: 'description', label: 'Ce que ces livres contiennent', type: 'textarea' },
  ],
};

let counter = 0;

export function newItem(object) {
  counter += 1;
  return { uid: `${object.id}-${counter}`, objectId: object.id, ...object.defaults };
}
