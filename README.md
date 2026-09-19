# 🤖 Agent Builder

On équipe un robot pour en faire un agent IA : on attrape un cerveau et on
le pose dans sa tête, des yeux sur son visage, des outils qui lui font
pousser des bras, des livres sur son torse — puis on exporte la
configuration en JSON.

## Lancer le projet

```bash
npm install
npm run dev
```

## Parler au robot

**Sans rien configurer**, le robot répond déjà : c'est le *mode démo*, un
bouchon local qui compose sa réponse à partir de ce qu'on lui a posé (son
modèle, ses skills, ses outils). Aucun appel réseau, aucune clé — de quoi
faire le tour de l'outil et le montrer à quelqu'un. Ces réponses portent la
mention « démo ».

**Avec une clé**, c'est le vrai modèle qui répond. « Brancher ma clé API »
au pied de la conversation ; la clé est gardée dans le navigateur
(`localStorage`) et n'est jamais écrite dans le dépôt.

> **Si tu portes ce code sur un serveur** : ne mets pas la clé dans une
> variable `VITE_…` d'un `.env`. Vite inline ces variables dans le bundle
> public — la clé serait servie à tous les visiteurs, ce qui est pire que le
> `localStorage`. Une clé de serveur doit rester côté serveur, derrière une
> route qui relaie les appels.

Ce qui tourne réellement aujourd'hui : le cerveau (le modèle appelé) et les
skills (capacités déclarées dans le prompt système). Les outils et le RAG
sont encore décoratifs.

## Comment ça marche

Pas de boîtes ni de fils : on saisit l'objet lui-même dans le bandeau du
haut et on le lâche sur la partie du corps qui lui correspond. Attraper un
objet allume les emplacements qui l'acceptent, et un objet lâché ailleurs
revient à sa place.

| Objet | Où il va | Effet |
|---|---|---|
| 🧠 **Cerveau** | sa tête | le robot s'allume, le modèle est écrit sur le cerveau |
| 👀 **Skill** | son visage | une paire d'yeux de plus, dessinés sur la face |
| 🔨 **Outil** | ses épaules | **un bras pousse** et un poing se referme sur l'outil |
| 📚 **RAG** | son torse | les livres s'empilent sur sa poitrine |

Les bras poussent par paires étagées : le premier outil donne un bras à
gauche, le deuxième un bras à droite, et ainsi de suite en descendant le
long du flanc.

Un clic sur un objet posé ouvre ses réglages (modèle, température,
description, source...). **Exporter la config** donne le JSON de l'agent.

Le même geste fonctionne à la souris et au doigt : le déplacement suit les
événements *pointer* plutôt que le glisser-déposer HTML5, qui n'émet rien
au tactile. Toucher un objet sans le déplacer l'équipe directement.

## Prochaines étapes possibles

- Exécution réelle : brancher le JSON exporté sur un vrai appel LLM
  (system prompt + tools au format function-calling).
- RAG fonctionnel : upload de documents, indexation et retrieval réel.
- Sauvegarde des agents assemblés (localStorage ou backend).
- Bibliothèque d'agents prêts à l'emploi / partage entre utilisateurs.
