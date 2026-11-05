# CodeArena — Arbre fonctionnel interactif

Arbre de fonctionnalités du backlog CodeArena, rendu avec **React Flow** et des icônes **Lucide**.
Il reprend les 30 User Stories (`US-001` → `US-030`) réparties en 7 épiques.

## Lancer le projet

```bash
cd docs/feature-tree
bun install
bun run dev
```

Puis ouvrir l'URL affichée par Vite (généralement `http://localhost:5173`).

## Build statique

```bash
bun run build
```

Le résultat est généré dans `docs/feature-tree/dist/`.

## Fonctionnalités de l'arbre

- Pan / zoom, mini-carte et contrôles de navigation.
- Recherche par identifiant, titre, rôle ou objectif.
- Toutes les features sont marquées **TO DO** (le projet va être réécrit).
- Double-clic sur un épique pour replier/déplier ses User Stories.
- Bascule d'affichage des dépendances entre User Stories.
- Panneau de détail au clic sur un nœud.
- Code couleur de la bordure gauche : **P0** rouge, **P1** orange, **P2** bleu.
