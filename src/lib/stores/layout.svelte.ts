// $lib/stores/layout.svelte.ts
import { browser } from "$app/environment";

/**
 * Create a reactive window dimension state
 * @returns An object containing:
 *   - width {number} - Current window width
 *   - height {number} - Current window height
 *   - isMobile {boolean} - True if width is below tablet breakpoint
 *   - isTablet {boolean} - True if width is between tablet and desktop breakpoints
 *   - isDesktop {boolean} - True if width is above desktop breakpoint
 *   - breakpoints {Object} - Object containing breakpoint values
 */
function createWindowState() {
    let width = $state(browser ? window.innerWidth : 1024);
    let height = $state(browser ? window.innerHeight : 768);

    if (browser) {
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        // Cleanup is handled automatically by Svelte when the module is destroyed
        // But if you need manual cleanup, you can track listeners separately
    }

    const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
    } as const;

    return {
        get width() {
            return width;
        },
        get height() {
            return height;
        },
        get isMobile() {
            return width < breakpoints.md;
        },
        get isTablet() {
            return width >= breakpoints.md && width < breakpoints.lg;
        },
        get isDesktop() {
            return width >= breakpoints.lg;
        },
        get breakpoint() {
            // Returns the current breakpoint name
            if (width < breakpoints.sm) return "xs";
            if (width < breakpoints.md) return "sm";
            if (width < breakpoints.lg) return "md";
            if (width < breakpoints.xl) return "lg";
            if (width < breakpoints["2xl"]) return "xl";
            return "2xl";
        },
        get orientation() {
            // Returns 'landscape' or 'portrait'
            return width > height ? "landscape" : "portrait";
        },
        breakpoints,
    };
}

export const windowState = createWindowState();
