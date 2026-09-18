# 🤖 Agent Builder

On équipe un robot pour en faire un agent IA : on attrape un cerveau et on
le pose dans sa tête, des outils dans ses mains, de la mémoire à ses pieds
— puis on exporte la configuration en JSON.

C'est un **prototype visuel** : l'assemblage produit une config d'agent,
mais rien n'est exécuté (pas d'appel LLM réel, pas de tools branchés à de
vraies API pour l'instant).

## Lancer le projet

```bash
npm install
npm run dev
```

## Comment ça marche

Pas de boîtes ni de fils : on saisit l'objet lui-même et on le lâche sur la
partie du corps qui lui correspond. Attraper un objet allume les
emplacements qui l'acceptent, et un objet lâché ailleurs revient à sa
place.

| Emplacement | Ce qu'il reçoit | Effet |
|---|---|---|
| **Tête** | le cerveau 🧠 | le robot s'allume et son écran affiche le modèle |
| **Mains** | ✉️ ✋ 🔍 🔌 💻 📅 | deux outils à portée ; les suivants passent à la ceinture |
| **Pieds** | 📚 🌐 🗄️ 📜 | la mémoire (RAG) s'empile devant lui |

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
