// $lib/data/code-examples.ts
import { CDN_VERSION, getCdnUrl, type FrameworkId } from "./frameworks-helpers";
import {
    getInstallCommand,
    type PackageManager,
} from "$lib/stores/preferences.svelte";
import type { Framework } from "./frameworks";

export interface CodeExample {
    install: string;
    import: string;
    usage: string;
}

interface IconData {
    componentName: string;
    name: string;
    style: string;
}

/**
 * Generate CDN code example for a specific framework
 */
export function getCdnExample(
    frameworkId: FrameworkId,
    icon: IconData,
    framework: Framework
): CodeExample {
    const { componentName, name: iconName, style } = icon;
    const cdnUrl = getCdnUrl(frameworkId, icon);
    const pkg = framework.package;

    const cdnExamples: Record<FrameworkId, CodeExample> = {
        "svelte-runes": {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `<!-- Direct CDN URL -->
${cdnUrl}

<!-- Note: Svelte components can't be imported directly from CDN -->
<!-- Use the SVG fallback method below instead -->`,
            usage: `<!-- Svelte 5 - Use SVG from CDN -->
<!-- Direct import of .svelte files from CDN is not supported -->
<!-- Use the img tag or inline SVG instead -->

<img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
     alt="${iconName}" width="24" height="24" />

<!-- Or fetch and use inline -->
<script>
  let svgContent = $state('');
  
  fetch('https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg')
    .then(res => res.text())
    .then(svg => svgContent = svg);
</script>

{@html svgContent}`,
        },
        svelte: {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `<!-- Direct CDN URL -->
${cdnUrl}

<!-- Note: Svelte components can't be imported directly from CDN -->
<!-- Use the SVG fallback method below instead -->`,
            usage: `<!-- Svelte 4 - Use SVG from CDN -->
<!-- Direct import of .svelte files from CDN is not supported -->
<!-- Use the img tag or inline SVG instead -->

<img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
     alt="${iconName}" width="24" height="24" />

<!-- Or fetch and use inline -->
<script>
  import { onMount } from 'svelte';
  let svgContent = '';
  
  onMount(async () => {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg');
    svgContent = await res.text();
  });
</script>

{@html svgContent}`,
        },
        react: {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `// Direct CDN URL
${cdnUrl}

// Or add to import map
<script type="importmap">
{
  "imports": {
    "${componentName}": "${cdnUrl}"
  }
}
</script>`,
            usage: `// React with CDN
import { lazy, Suspense } from 'react';

// Dynamic import
const ${componentName} = lazy(() => import('${cdnUrl}'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <${componentName} size={24} stroke={1.5} />
    </Suspense>
  );
}

// Or use img tag for SVG
<img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
     alt="${iconName}" width={24} height={24} />`,
        },
        "react-native": {
            install: `<!-- CDN not recommended for React Native -->
<!-- Use package manager instead -->

React Native requires native dependencies.
Please use the package manager installation method.`,
            import: `<!-- Not applicable for React Native -->
<!-- Install via package manager -->`,
            usage: `<!-- Not recommended for React Native -->
<!-- Please use package manager installation -->`,
        },
        vue: {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `<!-- Direct CDN URL -->
${cdnUrl}`,
            usage: `<!-- Vue with CDN -->
<script setup>
import { defineAsyncComponent } from 'vue';

const ${componentName} = defineAsyncComponent(() =>
  import('${cdnUrl}')
);
</script>

<template>
  <${componentName} :size="24" :stroke-width="1.5" />
  
  <!-- Or use img tag for SVG -->
  <img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
       alt="${iconName}" :width="24" :height="24" />
</template>`,
        },
        solidjs: {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `// Direct CDN URL
${cdnUrl}`,
            usage: `// SolidJS with CDN
import { lazy } from 'solid-js';

const ${componentName} = lazy(() => import('${cdnUrl}'));

function MyComponent() {
  return (
    <${componentName} size={24} stroke={1.5} />
  );
}

// Or use img tag for SVG
<img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
     alt="${iconName}" width={24} height={24} />`,
        },
        preact: {
            install: `<!-- No installation required! -->
<!-- Served from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `// Direct CDN URL
${cdnUrl}`,
            usage: `// Preact with CDN
import { lazy, Suspense } from 'preact/compat';

const ${componentName} = lazy(() => import('${cdnUrl}'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <${componentName} size={24} stroke={1.5} />
    </Suspense>
  );
}

// Or use img tag for SVG
<img src="https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg"
     alt="${iconName}" width={24} height={24} />`,
        },
        angular: {
            install: `<!-- No Angular-specific package available -->
<!-- Using base SVG package instead -->

Package: @tabler/icons@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/

Note: @tabler/icons-angular is not available on NPM.
CDN is the recommended installation method for Angular.`,
            import: `<!-- Direct SVG URL -->
${cdnUrl}`,
            usage: `<!-- Angular - SVG from CDN -->
<!-- CDN is the recommended method (no NPM package) -->

<img src="${cdnUrl}"
     alt="${iconName}"
     width="24"
     height="24" />

<!-- Or fetch and use inline (component.ts) -->
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class IconComponent implements OnInit {
  svgContent: SafeHtml = '';
  
  constructor(private sanitizer: DomSanitizer) {}
  
  async ngOnInit() {
    const res = await fetch('${cdnUrl}');
    const svg = await res.text();
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

<!-- In template -->
<div [innerHTML]="svgContent"></div>`,
        },
        "web-components": {
            install: `<!-- No Web Components package available -->
<!-- Using base SVG package instead -->

Package: @tabler/icons@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/

Note: @tabler/icons-webcomponents is not available on NPM.
CDN is the recommended installation method.`,
            import: `<!-- Direct SVG URL -->
${cdnUrl}`,
            usage: `<!-- Web Components - SVG from CDN -->
<img src="${cdnUrl}"
     alt="${iconName}"
     width="24"
     height="24" />

<!-- Or create a custom element -->
<script>
class TablerIcon extends HTMLElement {
  connectedCallback() {
    fetch('${cdnUrl}')
      .then(res => res.text())
      .then(svg => this.innerHTML = svg);
  }
}
customElements.define('tabler-${iconName}', TablerIcon);
</script>

<tabler-${iconName}></tabler-${iconName}>`,
        },
        svg: {
            install: `<!-- No installation required! -->
<!-- SVG from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `<!-- Direct SVG URL -->
${cdnUrl}`,
            usage: `<!-- SVG / HTML Usage -->
<img src="${cdnUrl}"
     alt="${iconName}"
     width="24"
     height="24" />

<!-- CSS Background -->
<div style="background-image: url('${cdnUrl}'); width: 24px; height: 24px;"></div>

<!-- Fetch and inline -->
<script>
fetch('${cdnUrl}')
  .then(res => res.text())
  .then(svg => document.getElementById('icon').innerHTML = svg);
</script>
<div id="icon"></div>

<!-- Markdown -->
![${iconName}](${cdnUrl})`,
        },
        png: {
            install: `<!-- No installation required! -->
<!-- PNG icons from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}
Browse: https://cdn.jsdelivr.net/npm/${pkg}@${CDN_VERSION}/`,
            import: `<!-- Direct PNG URL -->
${cdnUrl}`,
            usage: `<!-- PNG Usage -->
<img src="${cdnUrl}"
     alt="${iconName}"
     width="24"
     height="24" />`,
        },
        sprite: {
            install: `<!-- No installation required! -->
<!-- Sprite from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}

<!-- Three sprite files available: -->
<!-- tabler-sprite.svg (1.76 MB) - Regular icons with stroke -->
<!-- tabler-sprite-filled.svg (606.8 KB) - Filled style icons -->
<!-- tabler-sprite-nostroke.svg (1.68 MB) - Outline style icons -->`,
            import: `<!-- Include the appropriate sprite file based on your needs -->

<!-- Regular (with stroke) -->
https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@${CDN_VERSION}/dist/tabler-sprite.svg

<!-- Filled icons -->
https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@${CDN_VERSION}/dist/tabler-sprite-filled.svg

<!-- Outline (no stroke) -->
https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@${CDN_VERSION}/dist/tabler-sprite-nostroke.svg`,
            usage: (() => {
                const spriteFile =
                    style === "filled"
                        ? "tabler-sprite-filled.svg"
                        : style === "outline"
                        ? "tabler-sprite-nostroke.svg"
                        : "tabler-sprite.svg";
                const spriteUrl = `https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@${CDN_VERSION}/dist/${spriteFile}`;
                return `<!-- Link to the specific sprite for this icon style: ${style} -->
<svg class="icon" width="24" height="24">
  <use xlink:href="${spriteUrl}#tabler-${iconName}"></use>
</svg>

<!-- Or preload the sprite in your HTML -->
<body>
  <!-- Hidden sprite definition -->
  <div hidden>
    <svg>
      <use xlink:href="${spriteUrl}"></use>
    </svg>
  </div>
  
  <!-- Use icons throughout your page -->
  <svg class="icon" width="24" height="24">
    <use xlink:href="#tabler-${iconName}"></use>
  </svg>
</body>`;
            })(),
        },
        webfont: {
            install: `<!-- No installation required! -->
<!-- Webfont from NPM via jsDelivr CDN -->

Package: ${pkg}@${CDN_VERSION}`,
            import: `<!-- Include webfont CSS from CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@${CDN_VERSION}/dist/tabler-icons.css" />`,
            usage: `<!-- Use icon font -->
<i class="ti ti-${iconName}"></i>

<!-- With custom size -->
<i class="ti ti-${iconName}" style="font-size: 24px;"></i>`,
        },
    };

    return (
        cdnExamples[frameworkId] ||
        cdnExamples["svg"] || {
            install: `CDN: ${cdnUrl}`,
            import: cdnUrl,
            usage: `<img src="${cdnUrl}" alt="${iconName}" />`,
        }
    );
}

/**
 * Generate package manager code example for a specific framework
 */
export function getPackageExample(
    frameworkId: FrameworkId,
    icon: IconData,
    framework: Framework,
    packageManager: PackageManager
): CodeExample {
    const { componentName, name: iconName } = icon;
    const pkg = framework.package;

    const packageExamples: Record<FrameworkId, CodeExample> = {
        "svelte-runes": {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} />`,
        },
        svelte: {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} />`,
        },
        react: {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} />`,
        },
        "react-native": {
            install: getInstallCommand(
                packageManager,
                `${pkg} react-native-svg`
            ),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} color="#000" />`,
        },
        vue: {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} :size="24" :stroke-width="1.5" />`,
        },
        solidjs: {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} />`,
        },
        preact: {
            install: getInstallCommand(packageManager, pkg),
            import: `import { ${componentName} } from '${pkg}';`,
            usage: `<${componentName} size={24} stroke={1.5} />`,
        },
        angular: {
            install: `<!-- No NPM package available for Angular -->
<!-- Please use CDN installation method instead -->`,
            import: `<!-- Not available -->`,
            usage: `<!-- Please use CDN method -->`,
        },
        "web-components": {
            install: `<!-- No NPM package available for Web Components -->
<!-- Please use CDN installation method instead -->`,
            import: `<!-- Not available -->`,
            usage: `<!-- Please use CDN method -->`,
        },
        svg: {
            install: getInstallCommand(packageManager, pkg),
            import: `// Node.js
const { ${componentName} } = require('${pkg}');`,
            usage: `<!-- Direct SVG -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Icon paths here -->
</svg>

// Or get SVG string from package:
const svgString = ${componentName}.toSvg({ size: 24, strokeWidth: 1.5 });`,
        },
        png: {
            install: getInstallCommand(packageManager, pkg),
            import: `// Download PNG files from package`,
            usage: `<!-- Use PNG images -->
<img src="node_modules/@tabler/icons-png/icons/${icon.style}/${iconName}.png"
     alt="${iconName}" width="24" height="24" />`,
        },
        sprite: {
            install: getInstallCommand(packageManager, pkg),
            import: `<!-- Three sprite files available after installation -->

<!-- Regular (with stroke) -->
node_modules/@tabler/icons-sprite/dist/tabler-sprite.svg

<!-- Filled icons -->
node_modules/@tabler/icons-sprite/dist/tabler-sprite-filled.svg

<!-- Outline (no stroke) -->
node_modules/@tabler/icons-sprite/dist/tabler-sprite-nostroke.svg`,
            usage: `<!-- Use the appropriate sprite file for your icon style -->
<svg class="icon" width="24" height="24">
  <use xlink:href="node_modules/@tabler/icons-sprite/dist/tabler-sprite.svg#tabler-${iconName}"></use>
</svg>

<!-- Or load it in your HTML head and use references -->
<body>
  <!-- Include the sprite (choose one based on style needed) -->
  <object data="node_modules/@tabler/icons-sprite/dist/tabler-sprite.svg" 
          style="position: absolute; width: 0; height: 0;"></object>
  
  <!-- Use icons throughout your page -->
  <svg class="icon" width="24" height="24">
    <use xlink:href="#tabler-${iconName}"></use>
  </svg>
</body>`,
        },
        webfont: {
            install: getInstallCommand(packageManager, pkg),
            import: `<!-- Include webfont CSS -->
<link rel="stylesheet"
  href="node_modules/@tabler/icons-webfont/dist/tabler-icons.min.css" />`,
            usage: `<!-- Use icon font -->
<i class="ti ti-${iconName}"></i>

<!-- With custom size -->
<i class="ti ti-${iconName}" style="font-size: 24px;"></i>`,
        },
    };

    return packageExamples[frameworkId] || packageExamples["svelte"];
}

/**
 * Get code example based on install method
 */
export function getCodeExample(
    frameworkId: FrameworkId,
    icon: IconData,
    framework: Framework,
    packageManager: PackageManager,
    installMethod: "package" | "cdn"
): CodeExample {
    if (installMethod === "cdn") {
        return getCdnExample(frameworkId, icon, framework);
    }
    return getPackageExample(frameworkId, icon, framework, packageManager);
}
