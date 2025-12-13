<script lang="ts">
    import * as TablerIcons from "@tabler/icons-svelte";
    import IconCard from "$lib/components/IconCard.svelte";
    import IconModal from "$lib/components/IconModal.svelte";
    import ColorPickerModal from "$lib/components/ColorPickerModal.svelte";
    import VirtualGrid from "$lib/components/VirtualGrid.svelte";
    import {
        selectedGridSize,
        GRID_SIZES,
        getGridColumns,
        selectedTheme,
        iconColor,
    } from "$lib/stores/preferences";
    import { windowState } from "$lib/stores/layout.svelte";

    type IconData = {
        name: string;
        componentName: string;
        component: any;
        style: string;
    };

    // Get all icon names from the package
    const allIconNames = Object.keys(TablerIcons).filter((name) =>
        name.startsWith("Icon")
    );

    // Create icon metadata
    const allIcons: IconData[] = allIconNames.map((name) => {
        // Determine if it's filled or outline based on naming convention
        const isFilled = name.includes("Filled");
        const cleanName = name
            .replace("Icon", "")
            .replace("Filled", "")
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .slice(1);

        return {
            name: cleanName,
            componentName: name,
            component: TablerIcons[name as keyof typeof TablerIcons],
            style: isFilled ? "filled" : "outline",
        };
    });

    let searchQuery = $state("");
    let selectedStyle = $state("all");
    let selectedIcon = $state<IconData | null>(null);
    let showColorPicker = $state(false);

    // Calculate grid columns based on selected size and screen width from windowState
    let gridColumns = $derived(
        getGridColumns($selectedGridSize, windowState.width)
    );

    // Filtered icons based on search and style
    let filteredIcons = $derived.by(() => {
        let filtered = allIcons;

        // Filter by style
        if (selectedStyle !== "all") {
            filtered = filtered.filter((icon) => icon.style === selectedStyle);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((icon) =>
                icon.name.toLowerCase().includes(query)
            );
        }

        return filtered;
    });

    // Stats
    let stats = $derived.by(() => ({
        total: allIcons.length,
        filled: allIcons.filter((i) => i.style === "filled").length,
        outline: allIcons.filter((i) => i.style === "outline").length,
        filtered: filteredIcons.length,
    }));

    function handleIconClick(icon: IconData) {
        selectedIcon = icon;
    }

    function closeModal() {
        selectedIcon = null;
    }

    function toggleTheme() {
        selectedTheme.update((current) =>
            current === "light" ? "dark" : "light"
        );
    }

    // Automatically force large grid size on mobile using $effect
    $effect(() => {
        if (windowState.isMobile && $selectedGridSize !== "large") {
            selectedGridSize.set("large");
        }
    });
</script>

<svelte:head>
    <title>Tabler Icons Search - {stats.total} Icons for All Frameworks</title>
    <meta
        name="description"
        content="Search 5000+ Tabler Icons with code examples for React, Vue, Svelte, Angular, SolidJS, React Native, Preact, Web Components, PNG, SVG Sprite, Web Font, and HTML/SVG"
    />
</svelte:head>

<div class="page-wrapper" data-theme={$selectedTheme}>
    <div class="container">
        <header>
            <div class="header-content">
                <div class="header-text">
                    <h1>Tabler Icons Search</h1>
                    <p class="subtitle">
                        Browse and search {stats.total} beautiful icons from Tabler
                        Icons
                    </p>
                    <p class="frameworks">
                        Works with: React • Vue • Svelte • Angular • SolidJS •
                        React Native • Preact • Web Components • PNG • SVG
                        Sprite • Web Font
                    </p>
                    <div class="links">
                        <a
                            href="https://github.com/tabler/tabler-icons"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📦 GitHub Repo
                        </a>
                        <a
                            href="https://tabler.io/icons"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🌐 Official Site
                        </a>
                    </div>
                </div>
                <button
                    class="theme-toggle"
                    onclick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {#if $selectedTheme === "light"}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            ></path>
                        </svg>
                    {:else}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"
                            ></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"
                            ></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"
                            ></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"
                            ></line>
                        </svg>
                    {/if}
                </button>
            </div>
        </header>

        <div class="controls">
            <div class="search-box">
                <svg
                    class="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="search"
                    bind:value={searchQuery}
                    placeholder="Search icons... (e.g. 'home', 'user', 'arrow')"
                />
            </div>

            <div class="controls-row">
                <div class="filter-group">
                    <label for="style-filter" class="filter-label">Style:</label
                    >
                    <div class="filter-buttons">
                        <button
                            class="filter-btn"
                            class:active={selectedStyle === "all"}
                            onclick={() => (selectedStyle = "all")}
                        >
                            All
                        </button>
                        <button
                            class="filter-btn"
                            class:active={selectedStyle === "filled"}
                            onclick={() => (selectedStyle = "filled")}
                        >
                            Filled ({stats.filled})
                        </button>
                        <button
                            class="filter-btn"
                            class:active={selectedStyle === "outline"}
                            onclick={() => (selectedStyle = "outline")}
                        >
                            Outline ({stats.outline})
                        </button>
                    </div>
                </div>

                {#if windowState.isDesktop || windowState.isTablet}
                    <div class="filter-group">
                        <label for="size-filter" class="filter-label"
                            >Size:</label
                        >
                        <div class="filter-buttons">
                            {#each GRID_SIZES as size}
                                <button
                                    class="filter-btn"
                                    class:active={$selectedGridSize === size.id}
                                    onclick={() =>
                                        ($selectedGridSize = size.id)}
                                >
                                    {size.name}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div class="filter-group">
                    <label for="color-picker" class="filter-label"
                        >Icon Color:</label
                    >
                    <div class="color-controls">
                        <button
                            class="color-swatch"
                            onclick={() => (showColorPicker = true)}
                            style="background-color: {$iconColor};"
                            aria-label="Choose color"
                            title="Click to choose color"
                        ></button>
                        <button
                            class="filter-btn"
                            onclick={() => (showColorPicker = true)}
                        >
                            🎨 Choose Color
                        </button>
                        <button
                            class="filter-btn color-reset"
                            onclick={() => iconColor.set("#3b82f6")}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div class="stats">
                <span>Total: {stats.total}</span>
                <span>Showing: {stats.filtered}</span>
            </div>
        </div>

        <div class="content">
            {#if filteredIcons.length === 0}
                <div class="empty-state">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h2>No icons found</h2>
                    <p>Try a different search term or filter</p>
                </div>
            {:else}
                <VirtualGrid
                    items={filteredIcons}
                    columns={gridColumns}
                    gap={16}
                >
                    {#snippet children(icon: {
                        name: string;
                        componentName: string;
                        component: any;
                        style: string;
                    })}
                        <IconCard
                            {icon}
                            iconColor={$iconColor}
                            onclick={() => handleIconClick(icon)}
                        />
                    {/snippet}
                </VirtualGrid>
            {/if}
        </div>
    </div>

    {#if selectedIcon}
        <IconModal
            icon={selectedIcon}
            iconColor={$iconColor}
            onclose={closeModal}
        />
    {/if}

    {#if showColorPicker}
        <ColorPickerModal onclose={() => (showColorPicker = false)} />
    {/if}
</div>

<style>
    /* Theme Variables */
    .page-wrapper[data-theme="light"] {
        --bg-primary: #f8fafc;
        --bg-secondary: #ffffff;
        --bg-tertiary: #f1f5f9;
        --bg-controls: #ffffff;

        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-tertiary: #94a3b8;

        --accent-primary: #3b82f6;
        --accent-primary-hover: #2563eb;
        --accent-secondary: #8b5cf6;
        --accent-gradient-start: #3b82f6;
        --accent-gradient-end: #8b5cf6;

        --border-primary: #e2e8f0;
        --border-secondary: #cbd5e1;
        --border-focus: #3b82f6;

        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

        --btn-bg: #f1f5f9;
        --btn-bg-hover: #e2e8f0;
        --btn-active-bg: #3b82f6;
        --btn-active-text: #ffffff;
    }

    .page-wrapper[data-theme="dark"] {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --bg-controls: #1e293b;

        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
        --text-tertiary: #64748b;

        --accent-primary: #60a5fa;
        --accent-primary-hover: #3b82f6;
        --accent-secondary: #a78bfa;
        --accent-gradient-start: #60a5fa;
        --accent-gradient-end: #a78bfa;

        --border-primary: #334155;
        --border-secondary: #475569;
        --border-focus: #60a5fa;

        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);

        --btn-bg: #334155;
        --btn-bg-hover: #475569;
        --btn-active-bg: #60a5fa;
        --btn-active-text: #0f172a;
    }

    .page-wrapper {
        padding: 2rem;
        min-height: 100vh;
        background: var(--bg-primary);
        transition: background-color 0.3s ease;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        background: var(--bg-secondary);
        border-radius: 16px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-primary);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    header {
        background: linear-gradient(
            135deg,
            var(--accent-gradient-start),
            var(--accent-gradient-end)
        );
        color: white;
        padding: 2rem;
        border-bottom: 1px solid var(--border-primary);
        position: relative;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
    }

    .header-text {
        flex: 1;
    }

    .theme-toggle {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        padding: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        color: white;
        flex-shrink: 0;
    }

    .theme-toggle:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }

    .theme-toggle svg {
        display: block;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .frameworks {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .links {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .links a {
        color: white;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .links a:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    .controls {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-primary);
        background: var(--bg-controls);
        transition: all 0.3s ease;
    }

    .controls-row {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 200px;
    }

    .filter-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        transition: color 0.3s ease;
    }

    .color-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .color-swatch {
        width: 60px;
        height: 38px;
        border: 2px solid var(--border-primary);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .color-swatch:hover {
        border-color: var(--accent-primary);
        transform: scale(1.05);
        box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.1),
            0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .color-swatch:active {
        transform: scale(0.98);
    }

    .color-reset {
        padding: 0.5rem 0.75rem;
    }

    .search-box {
        position: relative;
        margin-bottom: 1rem;
    }

    input[type="search"] {
        width: 100%;
        padding: 0.875rem 0.875rem 0.875rem 3rem;
        border: 2px solid var(--border-primary);
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    input[type="search"]:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input[type="search"]::placeholder {
        color: var(--text-tertiary);
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-tertiary);
        transition: color 0.3s ease;
    }

    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 0.5rem 1rem;
        border: 2px solid var(--border-primary);
        background: var(--btn-bg);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .filter-btn.active {
        background: var(--btn-active-bg);
        color: var(--btn-active-text);
        border-color: var(--btn-active-bg);
    }

    .filter-btn:hover:not(.active) {
        border-color: var(--accent-primary);
        background: var(--btn-bg-hover);
    }

    .stats {
        display: flex;
        gap: 2rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-primary);
        color: var(--text-secondary);
        font-size: 0.875rem;
        transition: all 0.3s ease;
    }

    .content {
        padding: 1rem;
        height: calc(100vh - 400px);
        min-height: 400px;
        position: relative;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
        transition: color 0.3s ease;
    }

    .empty-state svg {
        width: 80px;
        height: 80px;
        margin: 0 auto 1rem;
        opacity: 0.5;
    }

    .empty-state h2 {
        margin-bottom: 0.5rem;
    }

    @media (max-width: 1024px) {
        .controls-row {
            flex-direction: column;
            gap: 1rem;
        }

        .filter-group {
            min-width: 100%;
        }
    }

    @media (max-width: 768px) {
        .page-wrapper {
            padding: 0.5rem;
        }

        header {
            padding: 1.5rem;
        }

        .header-content {
            flex-direction: row;
            align-items: flex-start;
        }

        .theme-toggle {
            padding: 0.5rem;
        }

        h1 {
            font-size: 1.75rem;
        }

        .subtitle {
            font-size: 1rem;
        }

        .frameworks {
            font-size: 0.8rem;
        }

        .controls {
            padding: 1rem;
        }

        .content {
            padding: 0.5rem;
            height: calc(100vh - 420px);
        }

        .stats {
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-buttons {
            justify-content: flex-start;
        }

        .filter-btn {
            flex: 0 0 auto;
        }
    }

    @media (max-width: 480px) {
        .page-wrapper {
            padding: 0;
        }

        .container {
            border-radius: 0;
        }

        header {
            padding: 1rem;
        }

        .header-content {
            gap: 1rem;
        }

        .theme-toggle {
            padding: 0.5rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        .subtitle,
        .frameworks {
            display: none;
        }

        .controls {
            padding: 0.75rem;
        }

        input[type="search"] {
            padding: 0.75rem 0.75rem 0.75rem 2.5rem;
            font-size: 0.9rem;
        }

        .search-icon {
            left: 0.75rem;
            width: 18px;
            height: 18px;
        }

        .content {
            padding: 0.25rem;
            height: calc(100vh - 340px);
        }
    }
</style>
