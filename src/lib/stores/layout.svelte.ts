// $lib/stores/layout.svelte.ts
import { browser } from "$app/environment";

/**
 * Reactive window dimension state using a class
 * Note: Resize listener must be set up in a component using setupResizeListener()
 */
class WindowState {
    #width = $state(browser ? window.innerWidth : 1024);
    #height = $state(browser ? window.innerHeight : 768);

    readonly breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
    } as const;

    /**
     * Call this in a component to set up automatic resize tracking
     * Example: $effect(() => windowState.setupResizeListener());
     */
    setupResizeListener() {
        if (!browser) return;

        const handleResize = () => {
            this.#width = window.innerWidth;
            this.#height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get isMobile() {
        return this.#width < this.breakpoints.md;
    }

    get isTablet() {
        return (
            this.#width >= this.breakpoints.md &&
            this.#width < this.breakpoints.lg
        );
    }

    get isDesktop() {
        return this.#width >= this.breakpoints.lg;
    }

    get breakpoint() {
        // Returns the current breakpoint name
        if (this.#width < this.breakpoints.sm) return "xs";
        if (this.#width < this.breakpoints.md) return "sm";
        if (this.#width < this.breakpoints.lg) return "md";
        if (this.#width < this.breakpoints.xl) return "lg";
        if (this.#width < this.breakpoints["2xl"]) return "xl";
        return "2xl";
    }

    get orientation() {
        // Returns 'landscape' or 'portrait'
        return this.#width > this.#height ? "landscape" : "portrait";
    }
}

export const windowState = new WindowState();
