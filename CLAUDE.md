# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal practice repo for React machine-coding interview problems. Each exercise (Todo, Infinite Scroll, Star Rating, Toast, Accordion, Step Form, Virtualized List, Parent↔Child communication) is a self-contained component with its own local state — there is no shared store, no data layer, and no backend. Exercises are solved in place and left in the repo as reference solutions, so files are often mid-refactor, with alternative approaches kept side by side in comments.

Stack: React 19 + TypeScript + Vite 7 + Tailwind CSS v4.

## Commands

```bash
npm run dev       # Vite dev server (no type-checking)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # serve the production build
```

There is no test runner configured — no Vitest/Jest, no test files. Don't invent a `npm test`; if verification is needed, use `npm run lint` plus `npx tsc -b`, or run the dev server.

## `npm run build` currently fails — this is expected

`npm run build` runs `tsc -b` first, and the repo does not currently type-check (~35 errors across `Todo.tsx`, `Task.tsx`, `Parent.tsx`, `App.tsx`, `Accordion.tsx`). `npm run dev` works fine because Vite strips types without checking them.

Causes are the usual practice-code ones, and worth knowing before "fixing" anything:

- `useState([])` with no type argument infers `never[]`, so every `.map`/`.filter` over it errors on property access. Annotate the state (`useState<Task[]>([])`) rather than casting at use sites.
- `noUnusedLocals` / `noUnusedParameters` are on in `tsconfig.app.json`, so scratch variables and commented-out experiments break the build. Some files suppress this with a file-level `/* eslint-disable @typescript-eslint/no-unused-vars */` — note that only silences ESLint, not `tsc`.
- Event handler params are frequently untyped (`(e) => ...`), which trips `strict`.

Only fix the errors in files you are actually working on. A repo-wide type cleanup is a separate, explicit task — don't fold it into an unrelated change.

## Architecture

**Entry path:** `src/main.tsx` → `src/App.tsx`. `src/Navigation/Navigate.tsx` sets up a `BrowserRouter` with a single `/` route, but **it is not wired into the app** — `main.tsx` renders `App` directly. Routing is effectively unused.

**`App.tsx` is a manual switchboard, not a real app shell.** It renders exactly one exercise, wrapped in `UserContext.Provider`; the others sit commented out. Switching which exercise you're working on means commenting/uncommenting a line — this is the intended workflow, so leave the commented imports and JSX in place when editing `App.tsx`.

**Directory roles:**

- `src/features/pages/` — one file per machine-coding exercise. Self-contained; no cross-imports except `Parent.tsx` → `Child.tsx`.
- `src/features/Hooks/` — reusable hooks (`useDebounce`). Note the capital `H`.
- `src/components/` — generic reusable components (`Accordion`).
- `src/context/UserContext.tsx` — the only context in the repo; a `string | null` provided from `App.tsx`.

## Conventions and gotchas

- **Export style is inconsistent.** Most pages default-export (`Task`, `StepForm`, `InfiniteScroll`, `ToastContainer`, `VirtualizedList`, `Parent`, `Child`); `Todo`, `StarRating`, and `Accordion` are named exports. Check the bottom of the file before writing an import. (`App.tsx` currently default-imports `Todo`, which is one of the build errors above.)
- **Tailwind v4** is wired through the `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `src/index.css`. There is no `tailwind.config.js` and none is needed.
- **Styling is mixed on purpose:** Tailwind utilities, hand-written classes in `src/App.css` and `src/index.css` (`.toast`, `.star`, priority colors), and inline `style` objects all coexist. Match whatever the file you're editing already uses.
- **React Compiler is enabled** via `babel-plugin-react-compiler` in `vite.config.ts`. Manual `useMemo`/`useCallback` are usually unnecessary; existing ones are leftovers.
- **`verbatimModuleSyntax` is on** — type-only imports must use `import type`.
- Root-level `INTERVIEW-PREP-*.md` and `NODEJS-INTERVIEW-MASTER.md` are large personal study notes (Node/Angular/React Native), unrelated to this app's code. Don't treat them as project documentation.
- `README.md` is the unmodified Vite template readme and carries no project-specific information.
