# ⚒️ Agent Builder

Un établi visuel pour assembler ton propre agent IA de façon ludique :
glisse-dépose des blocs (Cerveau/LLM, Tool, Skill/RAG), relie-les au cœur
de l'agent, et exporte la configuration en JSON.

C'est un **prototype visuel** : l'assemblage produit une config d'agent,
mais rien n'est exécuté (pas d'appel LLM réel, pas de tools branchés à de
vraies API pour l'instant).

## Lancer le projet

```bash
npm install
npm run dev
```

## Comment ça marche

- Un bloc **Agent** (⚡) est déjà posé sur l'établi : c'est le cœur, sa
  personnalité et son objectif.
- Glisse un bloc **Cerveau/LLM** (🧠), **Tool** (🔧) ou **Skill/RAG** (📚)
  depuis la palette de gauche sur l'établi.
- Clique un bloc pour le configurer dans le panneau de droite.
- Relie un bloc au cœur de l'agent en tirant un trait depuis son point de
  connexion vers celui de l'agent.
- Clique **Exporter la config** pour voir/copier/télécharger le JSON de
  l'agent assemblé.

## Prochaines étapes possibles

- Exécution réelle : brancher le JSON exporté sur un vrai appel LLM
  (system prompt + tools au format function-calling).
- RAG fonctionnel : upload de documents pour les blocs Skill, indexation
  et retrieval réel.
- Sauvegarde des agents assemblés (localStorage ou backend).
- Bibliothèque d'agents prêts à l'emploi / partage entre utilisateurs.
