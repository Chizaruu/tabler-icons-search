# Tabler Icons Search

Search and browse 5000+ Tabler Icons with code examples for multiple frameworks and package managers.

Live Demo: [https://chizaruu.github.io/tabler-icons-search](https://chizaruu.github.io/tabler-icons-search)

## Features

- Multi-framework code examples (React, Vue, Svelte, Angular, SolidJS, React Native, Preact, Web Components, PNG, SVG Sprite, Web Font, HTML/SVG)
- Package manager selection (pnpm, npm, Yarn, Bun)
- Persistent user preferences via localStorage
- Real-time search and style filtering
- Client-side only, no server required
- Built with Svelte 5 runes

## Installation

```bash
pnpm install  # or npm install, yarn install, bun install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

Output: `build/` directory

## Deployment

### GitHub Pages

1. Update `base` in `svelte.config.js`:

    ```js
    base: process.env.NODE_ENV === "production" ? "/YOUR-REPO-NAME" : "";
    ```

2. Enable GitHub Pages in repository settings (Source: GitHub Actions)

3. Push to main branch to trigger automatic deployment

## Usage

Click an icon to view installation and usage code for your selected framework and package manager.

### Examples

### Svelte 5 (pnpm, default)

```bash
pnpm add @tabler/icons-svelte-runes
```

```svelte
<script>
  import { IconHome } from '@tabler/icons-svelte-runes';
</script>

<IconHome size={24} stroke={1.5} />
```

### React (pnpm)

```bash
pnpm add @tabler/icons-react
```

```jsx
import { IconHome } from "@tabler/icons-react";

<IconHome size={24} stroke={1.5} />;
```

### Vue (npm)

```bash
npm install @tabler/icons-vue
```

```vue
<script setup>
import { IconHome } from "@tabler/icons-vue";
</script>

<template>
    <IconHome :size="24" :stroke-width="1.5" />
</template>
```

## Supported Frameworks

### JavaScript

- React (`@tabler/icons-react`)
- React Native (`@tabler/icons-react-native`)
- Vue (`@tabler/icons-vue`)
- Svelte 5 (`@tabler/icons-svelte-runes`)
- Svelte 4 (`@tabler/icons-svelte`)
- SolidJS (`@tabler/icons-solidjs`)
- Angular (`@tabler/icons-angular`)
- Preact (`@tabler/icons-preact`)
- Web Components (`@tabler/icons-webcomponents`)

### Other

- SVG/HTML (`@tabler/icons`)
- PNG (`@tabler/icons-png`)
- SVG Sprite (`@tabler/icons-sprite`)
- Web Font (`@tabler/icons-webfont`)

## Links

- [Tabler Icons](https://tabler.io/icons)
- [GitHub Repository](https://github.com/tabler/tabler-icons)
