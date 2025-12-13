// $lib/data/frameworks-helpers.ts
import {
    FRAMEWORKS,
    CDN_VERSION,
    type Framework,
    type FrameworkId,
} from "./frameworks";

export { FRAMEWORKS, CDN_VERSION, type Framework, type FrameworkId };

/**
 * Get the appropriate sprite filename based on icon style
 */
export function getSpriteFilename(style: string): string {
    if (style === "filled") {
        return "tabler-sprite-filled.svg";
    } else if (style === "outline") {
        return "tabler-sprite-nostroke.svg";
    }
    // Default to regular sprite (with stroke)
    return "tabler-sprite.svg";
}

/**
 * Generate CDN URL for a specific framework and icon
 * Note: Returns empty string for sprite and webfont as they don't have direct icon URLs
 */
export function getCdnUrl(
    frameworkId: FrameworkId,
    icon: { componentName: string; name: string; style: string }
): string | "" {
    const { componentName, name: iconName, style } = icon;

    const cdnUrls: Record<FrameworkId, string> = {
        "svelte-runes": `https://cdn.jsdelivr.net/npm/@tabler/icons-svelte@${CDN_VERSION}/dist/icons/${componentName}.svelte`,
        svelte: `https://cdn.jsdelivr.net/npm/@tabler/icons-svelte@${CDN_VERSION}/dist/icons/${componentName}.svelte`,
        react: `https://cdn.jsdelivr.net/npm/@tabler/icons-react@${CDN_VERSION}/dist/esm/icons/${componentName}.mjs`,
        "react-native": `https://cdn.jsdelivr.net/npm/@tabler/icons-react-native@${CDN_VERSION}/esm/icons/${componentName}.js`,
        vue: `https://cdn.jsdelivr.net/npm/@tabler/icons-vue@${CDN_VERSION}/dist/esm/icons/${componentName}.js`,
        solidjs: `https://cdn.jsdelivr.net/npm/@tabler/icons-solidjs@${CDN_VERSION}/dist/esm/icons/${componentName}.js`,
        preact: `https://cdn.jsdelivr.net/npm/@tabler/icons-preact@${CDN_VERSION}/dist/esm/icons/${componentName}.js`,
        angular: `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg`,
        "web-components": `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg`,
        svg: `https://cdn.jsdelivr.net/npm/@tabler/icons@${CDN_VERSION}/icons/${style}/${iconName}.svg`,
        png: `https://cdn.jsdelivr.net/npm/@tabler/icons-png@${CDN_VERSION}/icons/${style}/${iconName}.png`,
        sprite: "", // Sprite doesn't have direct icon URLs
        webfont: "", // Webfont doesn't have direct icon URLs
    };

    return cdnUrls[frameworkId] || "";
}

/**
 * Get framework by ID with type safety
 */
export function getFramework(id: FrameworkId): Framework | undefined {
    return FRAMEWORKS.find((f) => f.id === id);
}
