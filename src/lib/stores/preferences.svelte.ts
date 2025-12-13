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

// Helper to create persistent reactive state using a class
// This avoids $effect by manually writing to localStorage in the setter
class PersistentState<T> {
    #value = $state<T>() as T;
    #key: string;

    constructor(key: string, defaultValue: T) {
        this.#key = key;
        this.#value = getStoredValue(key, defaultValue);
    }

    get value(): T {
        return this.#value;
    }

    set value(newValue: T) {
        this.#value = newValue;
        // Manually persist to localStorage on every change
        if (browser) {
            try {
                localStorage.setItem(this.#key, JSON.stringify(newValue));
            } catch (e) {
                console.error(
                    `Failed to save ${this.#key} to localStorage:`,
                    e
                );
            }
        }
    }
}

// Create persistent state objects
export const selectedFramework = new PersistentState<FrameworkId>(
    "tabler-icons-framework",
    DEFAULT_FRAMEWORK
);

export const selectedPackageManager = new PersistentState<PackageManager>(
    "tabler-icons-package-manager",
    DEFAULT_PACKAGE_MANAGER
);

export const selectedGridSize = new PersistentState<GridSize>(
    "tabler-icons-grid-size",
    DEFAULT_GRID_SIZE
);

export const selectedTheme = new PersistentState<Theme>(
    "tabler-icons-theme",
    DEFAULT_THEME
);

export const iconColor = new PersistentState<string>(
    "tabler-icons-color",
    DEFAULT_ICON_COLOR
);

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
