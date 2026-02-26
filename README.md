# Project Introduction

English | [简体中文](./README-zh_CN.md)

## Project Structure

```text
root/
|—— demos/              # Usage examples for various functional components
|—— docs/               # Vitepress documentation
|—— internal/           # Project build packages
|—— packages/           # Sub-packages
|   |—— build/          # Vite packaging configuration
|   |—— components/     # Components
|   |—— directives/     # Directives
|   |—— hooks/          # Vue Composition API
|   |—— havue/          # Full-featured library
|   |—— shared/         # Common project modules
|   |—— solutions/      # Solutions for special complex scenarios
|   |—— tools/          # Utility function library
|   |—— utils/          # Component library utilities (e.g., adding install attribute to components)
|—— scripts/            # Scripts
```

## Commands

### Installation

```bash
pnpm i
```

### Vitepress Documentation

Development mode:

```bash
pnpm run docs:dev
```

Build:

```bash
pnpm run docs:build
```

### Library Packaging

#### Build Internal Packages

Builds packages under `internal/`. Scripts in `scripts/` and packages under `packages/` depend on these built packages.

```bash
pnpm run build:internal
```

#### Update Library Version

⚠️ First run "Build Internal Packages" if not executed before!

Update version in `.env` file, then run:

```bash
pnpm run update:version
```

### Build Packages

```bash
pnpm run build:lib
```

### Precautions

If a new component is added under `packages\components`:

1. Add the component to the dependencies in `packages\components\package.json`.
2. Export the new component in `packages\components\src\index.ts`.
3. Add the new component in `packages\havue\src\components.ts`.
