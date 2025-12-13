// $lib/stores/preferences.svelte.ts
import { browser } from "$app/environment";
import { FRAMEWORKS, type FrameworkId } from "$lib/data/frameworks";

// Re-export framework data for convenience
export { FRAMEWORKS, type FrameworkId } from "$lib/data/frameworks";

// Package managers with their install commands
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const PACKAGE_MANAGERS: {
    id: PackageManager;
    name: string;
    command: string;
}[] = [
    { id: "pnpm", name: "pnpm", command: "pnpm add" },
    { id: "npm", name: "npm", command: "npm install" },
    { id: "yarn", name: "Yarn", command: "yarn add" },
    { id: "bun", name: "Bun", command: "bun add" },
];

// Grid sizes (column-based)
export type GridSize = "small" | "medium" | "large";

export const GRID_SIZES: {
    id: GridSize;
    name: string;
    columns: { mobile: number; tablet: number; desktop: number };
}[] = [
    {
        id: "small",
        name: "Small",
        columns: { mobile: 4, tablet: 6, desktop: 10 },
    },
    {
        id: "medium",
        name: "Medium",
        columns: { mobile: 3, tablet: 4, desktop: 6 },
    },
    {
        id: "large",
        name: "Large",
        columns: { mobile: 2, tablet: 3, desktop: 4 },
    },
];

// Theme type
export type Theme = "light" | "dark";

// Default values
const DEFAULT_FRAMEWORK: FrameworkId = "svelte-runes";
const DEFAULT_PACKAGE_MANAGER: PackageManager = "pnpm";
const DEFAULT_GRID_SIZE: GridSize = "medium";
const DEFAULT_THEME: Theme = "light";
const DEFAULT_ICON_COLOR = "#3b82f6";

// Helper to get from localStorage
function getStoredValue<T>(key: string, defaultValue: T): T {
    if (!browser) return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
}

// Helper to create persistent reactive state
function createPersistentState<T>(key: string, defaultValue: T) {
    let value = $state(getStoredValue(key, defaultValue));

    if (browser) {
        $effect(() => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return {
        get value() {
            return value;
        },
        set value(newValue: T) {
            value = newValue;
        },
    };
}

// Create persistent state objects
const frameworkState = createPersistentState<FrameworkId>(
    "tabler-icons-framework",
    DEFAULT_FRAMEWORK
);

const packageManagerState = createPersistentState<PackageManager>(
    "tabler-icons-package-manager",
    DEFAULT_PACKAGE_MANAGER
);

const gridSizeState = createPersistentState<GridSize>(
    "tabler-icons-grid-size",
    DEFAULT_GRID_SIZE
);

const themeState = createPersistentState<Theme>(
    "tabler-icons-theme",
    DEFAULT_THEME
);

const iconColorState = createPersistentState<string>(
    "tabler-icons-color",
    DEFAULT_ICON_COLOR
);

// Export the reactive state objects
export const selectedFramework = frameworkState;
export const selectedPackageManager = packageManagerState;
export const selectedGridSize = gridSizeState;
export const selectedTheme = themeState;
export const iconColor = iconColorState;

// Helper function to get install command
export function getInstallCommand(
    packageManager: PackageManager,
    packageName: string
): string {
    const pm = PACKAGE_MANAGERS.find((p) => p.id === packageManager);
    return `${pm?.command || "npm install"} ${packageName}`;
}

// Helper function to get column count based on screen size
export function getGridColumns(size: GridSize, screenWidth: number): number {
    const gridSize = GRID_SIZES.find((s) => s.id === size);
    if (!gridSize) return 6;

    if (screenWidth < 768) {
        return gridSize.columns.mobile;
    } else if (screenWidth < 1024) {
        return gridSize.columns.tablet;
    } else {
        return gridSize.columns.desktop;
    }
}