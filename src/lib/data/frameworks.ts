// $lib/data/frameworks.ts
import frameworksData from './frameworks.json';

export type FrameworkId = 
  | "svelte-runes"
  | "svelte"
  | "react"
  | "react-native"
  | "vue"
  | "solidjs"
  | "preact"
  | "angular"
  | "web-components"
  | "svg"
  | "png"
  | "sprite"
  | "webfont";

export type FrameworkCategory = "component-library" | "static";

export interface Framework {
  id: FrameworkId;
  name: string;
  package: string;
  cdnPackage: string;
  hasCdnPackage: boolean;
  hasNpmPackage: boolean;
  category: FrameworkCategory;
}

export interface FrameworksConfig {
  cdnVersion: string;
  frameworks: Framework[];
}

// Export the typed data
export const FRAMEWORKS_CONFIG: FrameworksConfig = frameworksData as FrameworksConfig;

// Export convenience constants
export const CDN_VERSION = FRAMEWORKS_CONFIG.cdnVersion;
export const FRAMEWORKS = FRAMEWORKS_CONFIG.frameworks;

// Helper function to get a framework by ID
export function getFramework(id: FrameworkId): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

// Helper function to get frameworks by category
export function getFrameworksByCategory(category: FrameworkCategory): Framework[] {
  return FRAMEWORKS.filter((f) => f.category === category);
}

// Helper function to check if a framework has NPM package
export function hasNpmPackage(id: FrameworkId): boolean {
  return getFramework(id)?.hasNpmPackage ?? false;
}

// Helper function to check if a framework has CDN package
export function hasCdnPackage(id: FrameworkId): boolean {
  return getFramework(id)?.hasCdnPackage ?? false;
}