// Bouchon de démonstration : sans clé API, le robot répond quand même, pour
// qu'on puisse faire le tour de l'outil sans rien avoir à configurer.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function listLabels(items) {
  const labels = items.map((i) => i.label?.trim()).filter(Boolean);
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} et ${labels.at(-1)}`;
}

function composeDemoText({ name, brain, skills, tools, rags }, question) {
  const who = name?.trim() || 'Mon agent';
  const lines = [`Je suis « ${who} », branché sur ${brain.model}.`];

  if (question) {
    lines.push(`Tu me demandes : « ${question} ».`);
  }

  const équipement = [];
  if (skills.length > 0) équipement.push(`je sais ${listLabels(skills)}`);
  if (tools.length > 0) équipement.push(`je peux me servir de ${listLabels(tools)}`);
  if (rags.length > 0) équipement.push(`je m'appuie sur ${listLabels(rags)}`);

  if (équipement.length > 0) {
    lines.push(`Avec ce que tu m'as posé, ${équipement.join(', ')}.`);
  } else {
    lines.push(
      'Pour l’instant je n’ai qu’un cerveau : pose-moi des yeux, un marteau ou des livres et ma réponse en tiendra compte.',
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
