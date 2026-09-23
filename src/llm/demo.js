// Bouchon de démonstration : sans clé API, le robot répond quand même, pour
// qu'on puisse faire le tour de l'outil sans rien avoir à configurer.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Les libellés sont libres : on les cite entre guillemets dans une liste au
// lieu de les couler dans une phrase, qui deviendrait vite bancale.
function inventory(label, items) {
  const labels = items.map((i) => i.label?.trim()).filter(Boolean);
  if (labels.length === 0) return null;
  return `${label} : ${labels.map((l) => `« ${l} »`).join(', ')}`;
}

function composeDemoText({ name, brain, skills, tools, rags }, question) {
  const who = name?.trim() || 'Mon agent';
  const lines = [`Je suis « ${who} », branché sur ${brain.model}.`];

  if (question) lines.push(`Tu me demandes : « ${question} ».`);

  const posé = [
    inventory('Mes yeux, mes skills', skills),
    inventory('Mes bras, mes tools', tools),
    inventory('Mes livres, mon RAG', rags),
  ].filter(Boolean);

  if (posé.length > 0) {
    lines.push(`Voici ce que tu m’as posé :\n${posé.map((l) => `• ${l}`).join('\n')}`);
  } else {
    lines.push(
      'Pour l’instant je n’ai qu’un cerveau : pose-moi des yeux (une skill), un bras (un tool) ou des livres (le RAG), et ma réponse en tiendra compte.',
    );
  }

  lines.push('Branche une vraie clé et c’est le modèle qui répondra à ma place.');
  return lines.join('\n\n');
}

/** Même signature que l'appel réel : diffuse mot à mot, rend un message. */
export async function streamDemoReply({ agent, messages, onText }) {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  const text = composeDemoText(agent, typeof last?.content === 'string' ? last.content : '');

  await sleep(220);
  for (const chunk of text.match(/\S+\s*/g) ?? []) {
    onText(chunk);
    await sleep(16);
  }

  return { content: [{ type: 'text', text }], demo: true };
}
