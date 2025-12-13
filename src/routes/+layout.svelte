<script lang="ts">
    import { selectedTheme } from "$lib/stores/preferences";
    import { browser } from "$app/environment";

    const { children } = $props();

    // Apply theme to document
    $effect(() => {
        if (browser) {
            document.documentElement.setAttribute("data-theme", $selectedTheme);
        }
    });

    function toggleTheme() {
        $selectedTheme = $selectedTheme === "light" ? "dark" : "light";
    }
</script>

<svelte:head>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

{@render children?.()}

<!-- Theme Toggle Button -->
<button
    class="theme-toggle"
    onclick={toggleTheme}
    aria-label="Toggle theme"
    title={$selectedTheme === "light"
        ? "Switch to dark mode"
        : "Switch to light mode"}
>
    {#if $selectedTheme === "light"}
        <!-- Moon Icon -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
    {:else}
        <!-- Sun Icon -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
    {/if}
</button>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(html) {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color-scheme: light dark;
    }

    /* CSS Variables for theming */
    :global([data-theme="light"]) {
        --bg-gradient-start: #667eea;
        --bg-gradient-end: #764ba2;
        --scrollbar-track: #f1f5f9;
        --scrollbar-thumb-start: #667eea;
        --scrollbar-thumb-end: #764ba2;
        --scrollbar-thumb-hover-start: #5568d3;
        --scrollbar-thumb-hover-end: #6a3f94;
    }

    :global([data-theme="dark"]) {
        --bg-gradient-start: #1a1a2e;
        --bg-gradient-end: #16213e;
        --scrollbar-track: #0f0f1e;
        --scrollbar-thumb-start: #3b4371;
        --scrollbar-thumb-end: #4a5578;
        --scrollbar-thumb-hover-start: #4d5584;
        --scrollbar-thumb-hover-end: #5a6392;
    }

    :global(body) {
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            sans-serif;
        background: linear-gradient(
            135deg,
            var(--bg-gradient-start) 0%,
            var(--bg-gradient-end) 100%
        );
        min-height: 100vh;
        transition: background 0.3s ease;
    }

    /* Custom scrollbar */
    :global(::-webkit-scrollbar) {
        width: 10px;
    }

    :global(::-webkit-scrollbar-track) {
        background: var(--scrollbar-track);
        transition: background 0.3s ease;
    }

    :global(::-webkit-scrollbar-thumb) {
        background: linear-gradient(
            to bottom,
            var(--scrollbar-thumb-start),
            var(--scrollbar-thumb-end)
        );
        border-radius: 5px;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: linear-gradient(
            to bottom,
            var(--scrollbar-thumb-hover-start),
            var(--scrollbar-thumb-hover-end)
        );
    }

    /* Selection color */
    :global(::selection) {
        background-color: #667eea;
        color: white;
    }

    /* Focus styles for accessibility */
    :global(*:focus-visible) {
        outline: 3px solid #667eea;
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Smooth transitions */
    :global(button),
    :global(a),
    :global(input),
    :global(select) {
        transition: all 0.2s ease;
    }

    /* Accessibility - Reduce motion */
    @media (prefers-reduced-motion: reduce) {
        :global(*) {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
        :global(html) {
            scroll-behavior: auto;
        }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
        :global(body) {
            background: #ffffff;
        }
    }

    /* Theme Toggle Button Styles */
    .theme-toggle {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        z-index: 9999;
        color: #1f2937;
    }

    :global([data-theme="dark"]) .theme-toggle {
        background: rgba(31, 41, 55, 0.9);
        color: #f3f4f6;
    }

    .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.2),
            0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }

    .theme-toggle:active {
        transform: scale(0.95);
    }

    .theme-toggle svg {
        transition: all 0.3s ease;
    }

    .theme-toggle:hover svg {
        transform: rotate(20deg);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .theme-toggle {
            bottom: 16px;
            left: 16px;
            width: 44px;
            height: 44px;
        }
    }
</style>
