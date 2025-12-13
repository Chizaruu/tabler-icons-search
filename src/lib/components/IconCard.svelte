<script lang="ts">
    import { selectedFramework } from "$lib/stores/preferences.svelte";

    let { icon, iconColor = "#3b82f6", onclick } = $props();

    const CDN_VERSION = "3.35.0";

    let showCdnButton = $state(false);
    let copySuccess = $state(false);
    let copyTimeout: number;

    // Generate CDN URL based on framework (only for packages that exist on NPM)
    let cdnUrl = $derived.by(() => {
        const componentName = icon.componentName;
        const iconName = icon.name;

        const cdnMap: { [key: string]: string } = {
            "svelte-runes": `https://cdn.jsdelivr.net/npm/@tabler/icons-svelte@${CDN_VERSION}/dist/icons/${componentName}.svelte`,
            svelte: `https://cdn.jsdelivr.net/npm/@tabler/icons-svelte@${CDN_VERSION}/dist/icons/${componentName}.svelte`,
            react: `https://cdn.jsdelivr.net/npm/@tabler/icons-react@${CDN_VERSION}/dist/esm/icons/${componentName}.mjs`,
            "react-native": `https://cdn.jsdelivr.net/npm/@tabler/icons-react-native@${CDN_VERSION}/icons-js/${componentName}.js`,
            vue: `https://cdn.jsdelivr.net/npm/@tabler/icons-vue@${CDN_VERSION}/dist/icons/${componentName}.js`,
            solidjs: `https://cdn.jsdelivr.net/npm/@tabler/icons-solidjs@${CDN_VERSION}/dist/icons/${componentName}.js`,
            preact: `https://cdn.jsdelivr.net/npm/@tabler/icons-preact@${CDN_VERSION}/dist/icons/${componentName}.js`,
            // Angular and Web Components don't have NPM packages - fall back to SVG
            angular: `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${icon.style}/${iconName}.svg`,
            "web-components": `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${icon.style}/${iconName}.svg`,
            svg: `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${icon.style}/${iconName}.svg`,
            png: `https://cdn.jsdelivr.net/npm/@tabler/icons-png@${CDN_VERSION}/icons/${iconName}.png`,
            sprite: `https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@${CDN_VERSION}/dist/tabler-sprite.svg`,
            webfont: `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@${CDN_VERSION}/dist/tabler-icons.css`,
        };

        return cdnMap[selectedFramework.value] || cdnMap["svg"];
    });

    // Generate framework-specific code
    let cdnCode = $derived.by(() => {
        const url = cdnUrl;
        const name = icon.name;
        const componentName = icon.componentName;

        const formats: Record<string, { code: string; label: string }> = {
            "svelte-runes": {
                label: "Svelte",
                code: `<!-- Dynamic import -->\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            svelte: {
                label: "Svelte",
                code: `<!-- Dynamic import -->\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            react: {
                label: "React",
                code: `// Dynamic import\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            "react-native": {
                label: "React Native",
                code: `// Dynamic import\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            vue: {
                label: "Vue",
                code: `// Dynamic import\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            angular: {
                label: "SVG",
                code: `<img src="${url}" alt="${name}" width="24" height="24" />`,
            },
            solidjs: {
                label: "SolidJS",
                code: `// Dynamic import\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            preact: {
                label: "Preact",
                code: `// Dynamic import\nimport('${url}').then(module => {\n  const ${componentName} = module.default;\n});`,
            },
            "web-components": {
                label: "SVG",
                code: `<img src="${url}" alt="${name}" width="24" height="24" />`,
            },
            svg: {
                label: "HTML",
                code: `<img src="${url}" alt="${name}" width="24" height="24" />`,
            },
            png: {
                label: "PNG",
                code: `<img src="${url}" alt="${name}" width="24" height="24" />`,
            },
            sprite: {
                label: "Sprite",
                code: `<svg><use xlink:href="${url}#tabler-${name}"></use></svg>`,
            },
            webfont: {
                label: "CSS",
                code: `<link rel="stylesheet" href="${url}" />`,
            },
        };

        return (
            formats[selectedFramework.value] || {
                label: "URL",
                code: url,
            }
        );
    });

    async function copyCdnLink(e: MouseEvent) {
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(cdnCode.code);
            copySuccess = true;

            if (copyTimeout) clearTimeout(copyTimeout);

            copyTimeout = setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            alert(`CDN Code: ${cdnCode.code}`);
        }
    }

    function handleMouseEnter() {
        showCdnButton = true;
    }

    function handleMouseLeave() {
        showCdnButton = false;
    }
</script>

<button
    class="icon-card"
    {onclick}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>
    <div class="icon-svg" style="color: {iconColor};">
        <icon.component size="60%" stroke={1.5} />
    </div>
    <div class="icon-name">{icon.name}</div>
    <div class="icon-style">{icon.style}</div>

    <!-- CDN Copy Button -->
    {#if showCdnButton || copySuccess}
        <button
            class="cdn-copy-btn"
            class:success={copySuccess}
            onclick={copyCdnLink}
            title={copySuccess ? "Copied!" : `Copy ${cdnCode.label} CDN code`}
        >
            {#if copySuccess}
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            {:else}
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path
                        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    ></path>
                    <path
                        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    ></path>
                </svg>
                <span>{cdnCode.label}</span>
            {/if}
        </button>
    {/if}
</button>

<style>
    .icon-card {
        width: 100%;
        height: 100%;
        border: 2px solid var(--border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: var(--bg-secondary, white);
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    }

    .icon-card:hover {
        border-color: var(--accent-primary, #3b82f6);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .icon-svg {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
        transition: filter 0.3s ease;
    }

    .icon-name {
        font-size: clamp(0.65rem, 1.5vw, 0.75rem);
        color: var(--text-primary, #374151);
        text-align: center;
        word-break: break-word;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 100%;
        line-height: 1.2;
        transition: color 0.3s ease;
    }

    .icon-style {
        font-size: clamp(0.6rem, 1.2vw, 0.65rem);
        color: var(--text-tertiary, #9ca3af);
        text-transform: capitalize;
        transition: color 0.3s ease;
    }

    /* CDN Copy Button */
    .cdn-copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem 0.6rem;
        font-size: 0.7rem;
        font-weight: 600;
        background: var(--accent-primary, #3b82f6);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 10;
        animation: slideInFromRight 0.2s ease-out;
    }

    .cdn-copy-btn:hover {
        background: var(--accent-primary-hover, #2563eb);
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .cdn-copy-btn:active {
        transform: scale(0.95);
    }

    .cdn-copy-btn.success {
        background: #10b981;
        animation: pulse 0.3s ease-out;
    }

    .cdn-copy-btn.success:hover {
        background: #059669;
    }

    .cdn-copy-btn svg {
        flex-shrink: 0;
    }

    .cdn-copy-btn span {
        white-space: nowrap;
    }

    /* Animations */
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .cdn-copy-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.65rem;
            top: 0.4rem;
            right: 0.4rem;
        }

        .cdn-copy-btn svg {
            width: 12px;
            height: 12px;
        }
    }

    /* Small screens - show button on tap */
    @media (max-width: 640px) {
        /* On mobile, show button briefly on card click */
        .icon-card:active .cdn-copy-btn {
            display: flex;
        }
    }

    /* Ensure button is visible on touch devices */
    @media (hover: none) {
        .cdn-copy-btn {
            opacity: 0.9;
        }
    }
</style>
