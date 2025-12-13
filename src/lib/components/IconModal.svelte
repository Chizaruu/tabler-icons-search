<script lang="ts">
    import {
        selectedFramework,
        selectedPackageManager,
        PACKAGE_MANAGERS,
        getInstallCommand,
        type PackageManager,
    } from "$lib/stores/preferences";

    let { icon, iconColor = "#3b82f6", onclose } = $props();
    let copySuccess = $state(false);

    // All supported frameworks/packages
    const frameworks = [
        {
            id: "svelte-runes",
            name: "Svelte 5 (Runes)",
            package: "@tabler/icons-svelte-runes",
        },
        { id: "svelte", name: "Svelte 4", package: "@tabler/icons-svelte" },
        { id: "react", name: "React", package: "@tabler/icons-react" },
        {
            id: "react-native",
            name: "React Native",
            package: "@tabler/icons-react-native",
        },
        { id: "vue", name: "Vue", package: "@tabler/icons-vue" },
        { id: "solidjs", name: "SolidJS", package: "@tabler/icons-solidjs" },
        { id: "preact", name: "Preact", package: "@tabler/icons-preact" },
        { id: "angular", name: "Angular", package: "@tabler/icons-angular" },
        {
            id: "web-components",
            name: "Web Components",
            package: "@tabler/icons-webcomponents",
        },
        { id: "svg", name: "SVG / HTML", package: "@tabler/icons" },
        { id: "png", name: "PNG Images", package: "@tabler/icons-png" },
        { id: "sprite", name: "SVG Sprite", package: "@tabler/icons-sprite" },
        { id: "webfont", name: "Web Font", package: "@tabler/icons-webfont" },
    ];

    function getCodeExample(
        frameworkId: string,
        packageManager: PackageManager
    ) {
        const pkg = frameworks.find((f) => f.id === frameworkId)?.package || "";
        const iconName = icon.componentName;

        const examples: Record<
            string,
            { install: string; import: string; usage: string }
        > = {
            "svelte-runes": {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} />`,
            },
            svelte: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} />`,
            },
            react: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} />`,
            },
            "react-native": {
                install: getInstallCommand(
                    packageManager,
                    `${pkg} react-native-svg`
                ),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} color="#000" />`,
            },
            vue: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} :size="24" :stroke-width="1.5" />`,
            },
            solidjs: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} />`,
            },
            preact: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<${iconName} size={24} stroke={1.5} />`,
            },
            angular: {
                install: getInstallCommand(packageManager, pkg),
                import: `import { ${iconName} } from '${pkg}';`,
                usage: `<i-${icon.name} class="icon"></i-${icon.name}>\n\n// In your module:\nimport { ${iconName} } from '${pkg}';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [provideTablerIcons([${iconName}])]\n};`,
            },
            "web-components": {
                install: getInstallCommand(packageManager, pkg),
                import: `import '@tabler/icons-webcomponents/dist/tabler-icons.min.js';`,
                usage: `<tabler-icon name="${icon.name}"></tabler-icon>`,
            },
            svg: {
                install: getInstallCommand(packageManager, pkg),
                import: `// Node.js\nconst { ${iconName} } = require('${pkg}');`,
                usage: `<!-- Direct SVG -->\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"\n  viewBox="0 0 24 24" fill="none" stroke="currentColor"\n  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <!-- Icon paths here -->\n</svg>\n\n// Or get SVG string from package:\nconst svgString = ${iconName}.toSvg({ size: 24, strokeWidth: 1.5 });`,
            },
            png: {
                install: getInstallCommand(packageManager, pkg),
                import: `// Download PNG files from package`,
                usage: `<!-- Use PNG images -->\n<img src="node_modules/@tabler/icons-png/icons/${icon.name}.png"\n     alt="${icon.name}" width="24" height="24" />\n\n<!-- Or from CDN -->\n<img src="https://unpkg.com/@tabler/icons-png/icons/${icon.name}.png"\n     alt="${icon.name}" width="24" height="24" />`,
            },
            sprite: {
                install: getInstallCommand(packageManager, pkg),
                import: `<!-- Include sprite file -->\n<script src="node_modules/@tabler/icons-sprite/dist/tabler-sprite.js"><\/script>`,
                usage: `<!-- Reference icons from sprite -->\n<svg class="icon">\n  <use xlink:href="#tabler-${icon.name}"></use>\n</svg>\n\n<!-- Or use sprite SVG directly -->\n<svg class="icon" width="24" height="24">\n  <use xlink:href="tabler-sprite.svg#tabler-${icon.name}"></use>\n</svg>`,
            },
            webfont: {
                install: getInstallCommand(packageManager, pkg),
                import: `<!-- Include webfont CSS -->\n<link rel="stylesheet"\n  href="node_modules/@tabler/icons-webfont/dist/tabler-icons.min.css" />`,
                usage: `<!-- Use icon font -->\n<i class="ti ti-${icon.name}"></i>\n\n<!-- With custom size -->\n<i class="ti ti-${icon.name}" style="font-size: 24px;"></i>`,
            },
        };

        return examples[frameworkId];
    }

    let currentExample = $derived(
        getCodeExample($selectedFramework, $selectedPackageManager)
    );

    async function copyCode(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copySuccess = true;
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            alert("Failed to copy to clipboard");
        }
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onclose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onclose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="modal"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
>
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title" class="modal-title">{icon.name}</h2>
            <button class="close-btn" onclick={onclose} aria-label="Close"
                >×</button
            >
        </div>

        <div class="icon-meta">
            <span class="badge">{icon.style}</span>
            <span class="badge code">{icon.componentName}</span>
        </div>

        <div class="icon-preview" style="color: {iconColor};">
            <icon.component size={150} stroke={1.5} />
        </div>

        <div class="selectors">
            <div class="selector-group">
                <label for="framework">Framework:</label>
                <select id="framework" bind:value={$selectedFramework}>
                    {#each frameworks as framework}
                        <option value={framework.id}>{framework.name}</option>
                    {/each}
                </select>
            </div>

            <div class="selector-group">
                <label for="package-manager">Package Manager:</label>
                <select
                    id="package-manager"
                    bind:value={$selectedPackageManager}
                >
                    {#each PACKAGE_MANAGERS as pm}
                        <option value={pm.id}>{pm.name}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="code-section">
            <h3>Installation</h3>
            <pre class="code-block"><code>{currentExample.install}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.install)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>

        <div class="code-section">
            <h3>Import</h3>
            <pre class="code-block"><code>{currentExample.import}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.import)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>

        <div class="code-section">
            <h3>Usage</h3>
            <pre class="code-block"><code>{currentExample.usage}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.usage)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-content {
        background: var(--bg-secondary, white);
        border-radius: 16px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow: auto;
        animation: slideUp 0.3s ease-out;
        border: 1px solid var(--border-primary, #e5e7eb);
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-primary, #111827);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary, #6b7280);
        padding: 0.5rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: var(--text-primary, #111827);
    }

    .icon-meta {
        margin-bottom: 1.5rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .badge {
        display: inline-block;
        background: var(--bg-tertiary, #f3f4f6);
        color: var(--text-secondary, #6b7280);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        text-transform: capitalize;
    }

    .badge.code {
        font-family: "Monaco", "Courier New", monospace;
    }

    .icon-preview {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background: var(--bg-tertiary, #f9fafb);
        border-radius: 12px;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    .selectors {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--bg-tertiary, #f9fafb);
        border-radius: 8px;
        border: 2px solid var(--border-primary, #e5e7eb);
    }

    .selector-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .selector-group label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary, #374151);
    }

    .selector-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-secondary, #d1d5db);
        border-radius: 6px;
        font-size: 0.875rem;
        background: var(--bg-secondary, white);
        color: var(--text-primary, #374151);
        cursor: pointer;
    }

    .selector-group select:focus {
        outline: none;
        border-color: var(--accent-primary, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .code-section {
        margin-top: 1.5rem;
    }

    .code-section h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary, #374151);
    }

    .code-block {
        background: var(--bg-tertiary, #f3f4f6);
        padding: 1rem;
        border-radius: 8px;
        font-family: "Monaco", "Courier New", monospace;
        font-size: 0.875rem;
        overflow-x: auto;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border-primary, #e5e7eb);
    }

    .code-block code {
        white-space: pre-wrap;
        word-break: break-all;
        color: var(--text-primary, #374151);
    }

    .copy-btn {
        background: var(--accent-primary, #3b82f6);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background 0.2s;
        margin-right: 0.5rem;
    }

    .copy-btn:hover {
        background: var(--accent-primary-hover, #2563eb);
    }

    @media (max-width: 640px) {
        .modal {
            padding: 1rem;
        }

        .modal-content {
            padding: 1.5rem;
        }

        .modal-title {
            font-size: 1.25rem;
        }

        .selectors {
            grid-template-columns: 1fr;
        }
    }
</style>
