# ⚒️ Agent Builder

Un établi visuel pour équiper ton propre agent IA de façon ludique : un
robot au centre, auquel on branche un cerveau, des outils et de la
mémoire, puis dont on exporte la configuration en JSON.

C'est un **prototype visuel** : l'assemblage produit une config d'agent,
mais rien n'est exécuté (pas d'appel LLM réel, pas de tools branchés à de
vraies API pour l'instant).

## Lancer le projet

```bash
npm install
npm run dev
```

## Comment ça marche

Au centre, un **robot** : c'est l'agent. Il démarre éteint et s'allume à
mesure qu'on l'équipe.

- Touche (ou glisse) un bloc de la palette pour le poser sur l'établi.
- Relie-le au robot en tirant un trait depuis son point de connexion.
- Clique un bloc pour le configurer dans le panneau latéral.
- **Exporter la config** donne le JSON de l'agent assemblé.

Le robot se lit d'un coup d'œil :

| Ce qu'on lui relie | Ce que ça lui fait |
|---|---|
| **Cerveau (LLM)** 🧠 | il s'allume : yeux, antenne, et son écran affiche le modèle |
| **Tool** ✉️ ✋ 🔍 | une main se remplit de l'objet du geste ; au-delà de deux, ça part à la ceinture |
| **Skill / RAG** 📚 📜 🎓 | la mémoire s'empile à ses pieds |

L'icône d'un bloc suit ce qu'il fait, pas son type : changer le geste d'un
tool change l'objet que le robot tient en main.

## Prochaines étapes possibles

- Exécution réelle : brancher le JSON exporté sur un vrai appel LLM
  (system prompt + tools au format function-calling).
- RAG fonctionnel : upload de documents pour les blocs Skill, indexation
  et retrieval réel.
- Sauvegarde des agents assemblés (localStorage ou backend).
- Bibliothèque d'agents prêts à l'emploi / partage entre utilisateurs.
