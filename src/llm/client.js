import Anthropic from '@anthropic-ai/sdk';

// Tous les appels à l'API passent par ce module : le jour où la clé déménage
// derrière un serveur, seule la construction du client change ici.

const KEY_STORAGE = 'agentbuilder.apiKey';

export function loadKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

export function saveKey(key) {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key);
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    // Navigation privée ou stockage bloqué : la clé reste en mémoire le temps
    // de la session, ce qui suffit pour discuter.
  }
}

function createClient(apiKey) {
  return new Anthropic({
    apiKey,
    // L'app est un site statique sans serveur : l'appel part forcément du
    // navigateur, et le SDK exige qu'on le reconnaisse explicitement.
    dangerouslyAllowBrowser: true,
  });
}

// Les skills posées sur le visage du robot deviennent ses capacités déclarées.
export function buildSystemPrompt({ name, brain, skills }) {
  const parts = [`Tu es « ${name || 'Mon agent'} ».`];

  if (brain?.systemPrompt?.trim()) parts.push(brain.systemPrompt.trim());

  const described = (skills ?? []).filter((s) => s.label?.trim() || s.description?.trim());
  if (described.length > 0) {
    const lines = described.map((s) =>
      s.description?.trim() ? `- ${s.label} : ${s.description.trim()}` : `- ${s.label}`,
    );
    parts.push(`Voici ce que tu sais faire :\n${lines.join('\n')}`);
  }

  return parts.join('\n\n');
}

/**
 * Envoie la conversation et diffuse la réponse au fil de l'eau.
 * `onText` reçoit chaque fragment ; la promesse rend le message complet.
 */
export async function streamReply({ apiKey, agent, messages, onText, signal }) {
  const client = createClient(apiKey);

  const stream = client.messages.stream(
    {
      model: agent.brain?.model ?? 'claude-opus-5',
      max_tokens: 8000,
      system: buildSystemPrompt(agent),
      output_config: { effort: agent.brain?.effort ?? 'high' },
      messages,
    },
    { signal },
  );

  stream.on('text', (chunk) => onText(chunk));
  return stream.finalMessage();
}

export function messageText(message) {
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

// Rend une erreur d'API lisible sans exposer la clé.
export function describeError(error) {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'Clé refusée. Vérifie qu’elle est valide et active.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Trop de requêtes d’un coup. Réessaie dans un instant.';
  }
  if (error instanceof Anthropic.BadRequestError) {
    return `Requête refusée : ${error.message}`;
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Impossible de joindre l’API. Vérifie ta connexion.';
  }
  if (error instanceof Anthropic.APIError) {
    return `Erreur API ${error.status} : ${error.message}`;
  }
  return error?.message ?? 'Erreur inconnue.';
}
