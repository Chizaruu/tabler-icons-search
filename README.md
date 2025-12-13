# Tabler Icons Search

A modern, fast icon browser for 6000+ Tabler Icons with instant CDN links and NPM code examples for 13+ frameworks.

**🌐 Live Demo:** [https://chizaruu.github.io/tabler-icons-search](https://chizaruu.github.io/tabler-icons-search)

## ✨ Features

### 🎯 Core Features

-   **6000+ Icons** - Browse the complete Tabler Icons library with filled and outline styles
-   **Virtual Scrolling** - Smooth performance with optimized rendering for large icon sets
-   **Real-time Search** - Instant filtering by icon name
-   **Style Filtering** - Filter by filled, outline, or view all styles
-   **Icon Modals** - Click any icon to see detailed installation and usage instructions

### 🚀 Installation Methods

-   **CDN Support** - Zero-bundle-size delivery via jsDelivr CDN
-   **NPM Packages** - Full package manager support (pnpm, npm, Yarn, Bun)
-   **Quick Copy** - Hover over icons to instantly copy CDN URLs (desktop only)
-   **Code Generation** - Automatic code examples for your selected framework and package manager

### 🎨 Customization

-   **Theme Switcher** - Light and dark mode with persistent preferences
-   **Custom Colors** - Built-in color picker to preview icons in your brand colors
-   **Grid Sizes** - Adjustable icon grid density (small, medium, large)
-   **Framework Selection** - Choose your preferred framework for tailored code examples
-   **Package Manager** - Select your preferred package manager (pnpm, npm, Yarn, Bun)

### 💻 Framework Support

**Component Libraries (CDN + NPM):**

-   React (`@tabler/icons-react`)
-   Vue (`@tabler/icons-vue`)
-   Svelte 5 Runes (`@tabler/icons-svelte`)
-   Svelte 4 (`@tabler/icons-svelte`)
-   SolidJS (`@tabler/icons-solidjs`)
-   Preact (`@tabler/icons-preact`)
-   React Native (`@tabler/icons-react-native`)

**CDN Only:**

-   Angular (SVG imports)
-   Web Components (SVG imports)
-   SVG/HTML (`@tabler/icons`)
-   PNG (`@tabler/icons-png`)
-   SVG Sprite (`@tabler/icons-sprite`)
-   Web Font (`@tabler/icons-webfont`)

## 📦 Installation

```bash
# Install dependencies
pnpm install  # or npm install, yarn install, bun install
```

## 🚀 Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build
```

Output directory: `build/`

## 📖 Usage

### Quick Start

1. **Browse Icons** - Scroll through 5000+ icons or use the search bar
2. **Filter Styles** - Choose between filled, outline, or all styles
3. **Customize View** - Adjust grid size and icon colors to your preference
4. **Select Framework** - Choose your framework from the dropdown
5. **Click Icon** - View installation instructions and copy code examples

### Code Examples

The application generates framework-specific code examples. Here are some quick examples:

#### Svelte 5 (Runes)

```bash
pnpm add @tabler/icons-svelte
```

```svelte
<script>
  import { IconHome } from '@tabler/icons-svelte';
</script>

<IconHome size={24} stroke={1.5} />
```

#### React

```bash
pnpm add @tabler/icons-react
```

```jsx
import { IconHome } from "@tabler/icons-react";

<IconHome size={24} stroke={1.5} />;
```

#### Vue

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

#### CDN (No Installation)

```html
<!-- React with CDN -->
<script type="module">
    import { IconHome } from "https://cdn.jsdelivr.net/npm/@tabler/icons-react@3.35.0/dist/esm/icons/IconHome.mjs";
</script>

<!-- Or use SVG directly -->
<img
    src="https://cdn.jsdelivr.net/npm/@tabler/icons@3.35.0/icons/outline/home.svg"
    alt="home"
    width="24"
    height="24"
/>
```

## 🎯 Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── IconCard.svelte          # Individual icon card
│   │   ├── IconModal.svelte         # Modal with code examples
│   │   ├── ColorPickerModal.svelte  # Color customization
│   │   └── VirtualGrid.svelte       # Virtual scrolling grid
│   ├── data/
│   │   ├── frameworks.ts            # Framework configurations
│   │   ├── frameworks-helpers.ts    # Helper functions
│   │   └── code-examples.ts         # Code generation
│   └── stores/
│       ├── preferences.svelte.ts    # User preferences (framework, theme, etc.)
│       └── layout.svelte.ts         # Window/layout state
└── routes/
    ├── +layout.svelte               # App layout
    ├── +layout.ts                   # Layout config
    └── +page.svelte                 # Main page
```

## 🔧 Configuration

### Customizing Frameworks

Edit `src/lib/data/frameworks.json` to add or modify framework configurations:

```json
{
    "id": "framework-id",
    "name": "Framework Name",
    "package": "@package/name",
    "cdnPackage": "@cdn/package",
    "hasCdnPackage": true,
    "hasNpmPackage": true,
    "category": "component-library"
}
```

### Adding Code Examples

Edit `src/lib/data/code-examples.ts` to customize code generation for frameworks.

## 🤝 Contributing

Contributions are welcome! This is a community tool to make working with Tabler Icons easier.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is a browser/search interface for Tabler Icons. The icons themselves are created and maintained by the Tabler team.

-   **This Browser:** [chizaruu/tabler-icons-search](https://github.com/chizaruu/tabler-icons-search)
-   **Tabler Icons:** [tabler/tabler-icons](https://github.com/tabler/tabler-icons) (MIT License)

## 🔗 Links

-   [Official Tabler Icons Website](https://tabler.io/icons)
-   [Tabler Icons GitHub](https://github.com/tabler/tabler-icons)
-   [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@tabler/icons)
-   [Live Demo](https://chizaruu.github.io/tabler-icons-search)

## 💡 Tips

-   **Mobile Users:** The grid automatically adjusts to large size for better mobile experience
-   **Desktop Users:** Hover over icons for quick CDN URL copying
-   **Dark Mode:** Use the moon/sun icon in the top right to switch themes
-   **Color Preview:** Click the color swatch to preview icons in your brand colors
-   **Keyboard Navigation:** Use Tab and Enter to navigate through controls

---

**Built with ❤️ using Svelte 5 and Tabler Icons**
