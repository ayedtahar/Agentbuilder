# Conventions du dépôt

## Commits

- **Auteur** : `Ayed <ayedt34@gmail.com>`. Tous les commits du dépôt portent
  ce nom, y compris ceux écrits en binôme avec un modèle.
- **Aucune ligne `Claude-Session:`** dans les messages. Ces liens de session
  n'ont pas leur place dans l'historique.
- La ligne `Co-Authored-By: Claude …` reste admise : c'est une attribution
  sans lien, qui ne change pas l'auteur du commit.

## Clé API

La clé Anthropic **ne doit jamais entrer dans le dépôt** — ni en dur, ni dans
un fichier d'exemple, ni dans un `.env` versionné. Elle est saisie dans
l'application au moment de l'exécution et gardée dans le navigateur.

Au moment de porter le projet sur un serveur, ne pas la placer dans une
variable `VITE_…` : Vite inline ces variables dans le bundle public, donc la
clé serait servie à tous les visiteurs. Elle doit rester côté serveur,
derrière une route qui relaie les appels.

## Vocabulaire

Chaque partie du robot va de pair avec la pièce d'agent qu'elle représente,
et les deux noms s'affichent ensemble partout dans l'interface :

| Partie du corps | Pièce de l'agent |
|---|---|
| Cerveau, dans sa tête | le modèle |
| Yeux, sur son visage | une skill |
| Bras, à ses épaules | un tool |
| Livres, sur sa poitrine | le RAG |
