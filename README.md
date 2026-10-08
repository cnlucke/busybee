# 🐝 Busybee

A small task list app built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Add, complete, and delete tasks** with a simple inline form.
- **Click-to-edit** — click a task's title to edit it in place (for link tasks, use the "Edit" button); clicking away (or pressing Enter) saves the change, Escape cancels.
- **Nested subtasks** — add subtasks under any task via the "+ Add subtask" link, nested to any depth, each with its own checkbox, edit, and delete.
- **Link previews** — a task title that is (or contains) a URL automatically renders a thumbnail and page title pulled from the linked page, instead of the raw link text. Clicking the thumbnail or page title opens the link in a new tab.

## Getting started

Requires Node.js **20.19+** or **22.12+**.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default [http://localhost:5173](http://localhost:5173)).

## Scripts

| Command           | Description                              |
|-------------------|-------------------------------------------|
| `npm run dev`     | Start the dev server with hot reload      |
| `npm run build`   | Type-check and build for production       |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint                                |

## Project structure

```
src/
  App.tsx          # Entry point, renders TaskList
  TaskList.tsx      # Owns task state, wires up add/toggle/edit/delete
  TaskForm.tsx       # Form for adding a new top-level task
  TaskItem.tsx       # Renders one task row, its subtasks, and the edit UI
  LinkPreview.tsx    # Thumbnail + title card for a task that's a link
  taskTree.ts        # Recursive helpers for updating the task tree by id
  url.ts             # URL detection/parsing helpers
server/
  linkPreviewPlugin.ts  # Vite middleware that fetches a page's og:image/title
```

## Notes

- Tasks live in memory only (React state) — the list resets on page reload. There's no backend or persistence layer.
- Link previews are served by a Vite dev/preview server middleware (`server/linkPreviewPlugin.ts`), which fetches the target page server-side to read its Open Graph metadata. This only works while running `npm run dev` or `npm run preview` — a static deployment of `npm run build`'s output alone won't have anywhere to serve `/api/link-preview` from.
