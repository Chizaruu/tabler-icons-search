<script lang="ts">
    import * as TablerIcons from "@tabler/icons-svelte";
    import {
        IconMoon,
        IconSun,
        IconSearch,
        IconLayoutGrid,
        IconChevronDown,
        IconCode,
        IconBrandGithub,
    } from "@tabler/icons-svelte";
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
        selectedPackageManager,
        PACKAGE_MANAGERS,
        selectedFramework,
        FRAMEWORKS,
    } from "$lib/stores/preferences.svelte";
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
    let selectedInstallMethod = $state<"package" | "cdn">("cdn");

    // Collapsible sections state - multiple sections can be open
    let expandedSections = $state<Set<string>>(
        new Set(windowState.isMobile ? [] : ["display"])
    );

    // Get current framework capabilities
    let currentFramework = $derived(
        FRAMEWORKS.find((f) => f.id === selectedFramework.value)
    );
    let hasCdn = $derived(currentFramework?.hasCdnPackage ?? true);
    let hasPackage = $derived(currentFramework?.hasNpmPackage ?? true);

    // Auto-switch to available install method when framework changes
    $effect(() => {
        if (!hasCdn && hasPackage) {
            // Framework only has package support
            selectedInstallMethod = "package";
        } else if (hasCdn && !hasPackage) {
            // Framework only has CDN support
            selectedInstallMethod = "cdn";
        }
        // If both are available or neither, keep current selection
    });

    // Calculate grid columns based on selected size and screen width from windowState
    let gridColumns = $derived(
        getGridColumns(selectedGridSize.value, windowState.width)
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
        selectedTheme.value =
            selectedTheme.value === "light" ? "dark" : "light";
    }

    function toggleSection(section: string) {
        const newSections = new Set(expandedSections);
        if (newSections.has(section)) {
            newSections.delete(section);
        } else {
            newSections.add(section);
        }
        expandedSections = newSections;
    }

    function isSectionExpanded(section: string): boolean {
        return expandedSections.has(section);
    }

    // Automatically force large grid size on mobile using $effect
    $effect(() => {
        if (windowState.isMobile && selectedGridSize.value !== "large") {
            selectedGridSize.value = "large";
        }
    });

    // Auto-switch from small to large on tablet (since small is not available)
    $effect(() => {
        if (windowState.isTablet && selectedGridSize.value === "small") {
            selectedGridSize.value = "large";
        }
    });
</script>

<svelte:head>
    <title
        >Tabler Icons Search - {stats.total} Icons with CDN & NPM Support</title
    >
    <meta
        name="description"
        content="Search 5000+ Tabler Icons with instant CDN links (jsDelivr) and NPM package code examples for React, Vue, Svelte, Angular, SolidJS, React Native, Preact, Web Components, PNG, SVG Sprite, Web Font, and HTML/SVG. Zero bundle size with CDN delivery."
    />
    <meta
        name="keywords"
        content="tabler icons, icon search, cdn icons, jsdelivr, svg icons, react icons, vue icons, svelte icons, icon library, free icons"
    />
</svelte:head>

<div class="page-wrapper" data-theme={selectedTheme.value}>
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
                        <strong>📦 CDN & NPM:</strong> React • Vue • Svelte •
                        SolidJS • Preact • React Native
                        <br />
                        <strong>🌐 CDN Only:</strong> Angular • Web Components •
                        SVG • PNG • Sprite • Web Font
                    </p>
                    <div class="features">
                        <span class="feature-badge">✨ Zero Bundle Size</span>
                        <span class="feature-badge">⚡ CDN Delivery</span>
                        <span class="feature-badge">📋 Copy Code</span>
                    </div>
                    <div class="links">
                        <a
                            href="https://github.com/chizaruu/tabler-icons-search"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="github-star-link"
                        >
                            <IconBrandGithub size={18} stroke={2} />
                            Star on GitHub
                        </a>
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
                        <a
                            href="https://www.jsdelivr.com/package/npm/@tabler/icons"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🚀 CDN (jsDelivr)
                        </a>
                    </div>
                </div>
                <button
                    class="theme-toggle"
                    onclick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {#if selectedTheme.value === "light"}
                        <IconMoon size={24} stroke={2} />
                    {:else}
                        <IconSun size={24} stroke={2} />
                    {/if}
                </button>
            </div>
        </header>

        <div class="controls">
            <!-- Search Bar - Always Visible -->
            <div class="search-box">
                <span class="search-icon">
                    <IconSearch size={20} stroke={2} />
                </span>
                <input
                    type="search"
                    bind:value={searchQuery}
                    placeholder="Search icons... (e.g. 'home', 'user', 'arrow')"
                />
                {#if searchQuery}
                    <button
                        class="search-clear"
                        onclick={() => (searchQuery = "")}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                {/if}
            </div>

            <!-- Stats Bar -->
            <div class="stats-bar">
                <div class="stats">
                    <span>Total: {stats.total}</span>
                    <span>Showing: {stats.filtered}</span>
                </div>
                {#if !windowState.isMobile}
                    <span class="cdn-hint"
                        >💡 Hover icons for quick CDN copy</span
                    >
                {/if}
            </div>

            <!-- Section 1: Style & Display -->
            <div class="control-section">
                <button
                    class="section-header"
                    class:expanded={isSectionExpanded("display")}
                    onclick={() => toggleSection("display")}
                >
                    <span class="section-title">
                        <IconLayoutGrid size={18} stroke={2} />
                        Style & Display
                    </span>
                    {#if windowState.isMobile}
                        <IconChevronDown class="chevron" size={20} stroke={2} />
                    {/if}
                </button>

                {#if isSectionExpanded("display")}
                    <div class="section-content">
                        <div class="control-grid">
                            <!-- Style Filter -->
                            <div class="control-item">
                                <label for="iconStyle" class="control-label"
                                    >Icon Style</label
                                >
                                <div class="button-group">
                                    <button
                                        class="control-btn"
                                        class:active={selectedStyle === "all"}
                                        onclick={() => (selectedStyle = "all")}
                                    >
                                        All ({stats.total})
                                    </button>
                                    <button
                                        class="control-btn"
                                        class:active={selectedStyle ===
                                            "filled"}
                                        onclick={() =>
                                            (selectedStyle = "filled")}
                                    >
                                        Filled ({stats.filled})
                                    </button>
                                    <button
                                        class="control-btn"
                                        class:active={selectedStyle ===
                                            "outline"}
                                        onclick={() =>
                                            (selectedStyle = "outline")}
                                    >
                                        Outline ({stats.outline})
                                    </button>
                                </div>
                            </div>

                            <!-- Grid Size (Desktop and Tablet) -->
                            {#if windowState.isDesktop || windowState.isTablet}
                                <div class="control-item">
                                    <label for="gridSize" class="control-label"
                                        >Grid Size</label
                                    >
                                    <div class="button-group">
                                        {#each GRID_SIZES as size}
                                            <!-- Show all sizes on desktop, only medium and large on tablet -->
                                            {#if windowState.isDesktop || (windowState.isTablet && (size.id === "medium" || size.id === "large"))}
                                                <button
                                                    class="control-btn"
                                                    class:active={selectedGridSize.value ===
                                                        size.id}
                                                    onclick={() =>
                                                        (selectedGridSize.value =
                                                            size.id)}
                                                >
                                                    {size.name}
                                                </button>
                                            {/if}
                                        {/each}
                                    </div>
                                </div>
                            {/if}

                            <!-- Color Picker -->
                            <div class="control-item">
                                <label for="iconColor" class="control-label"
                                    >Icon Color</label
                                >
                                <div class="color-controls">
                                    <button
                                        class="color-swatch"
                                        onclick={() => (showColorPicker = true)}
                                        style="background-color: {iconColor.value};"
                                        aria-label="Choose color"
                                        title="Click to choose color"
                                    ></button>
                                    <button
                                        class="control-btn flex-1"
                                        onclick={() => (showColorPicker = true)}
                                    >
                                        🎨 Choose Color
                                    </button>
                                    <button
                                        class="control-btn"
                                        onclick={() =>
                                            (iconColor.value = "#3b82f6")}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Section 2: Code Settings -->
            <div class="control-section">
                <button
                    class="section-header"
                    class:expanded={isSectionExpanded("code")}
                    onclick={() => toggleSection("code")}
                >
                    <span class="section-title">
                        <IconCode size={18} stroke={2} />
                        Code Settings
                    </span>
                    {#if windowState.isMobile}
                        <IconChevronDown class="chevron" size={20} stroke={2} />
                    {/if}
                </button>

                {#if isSectionExpanded("code")}
                    <div class="section-content">
                        <div class="control-grid">
                            <!-- Framework -->
                            <div class="control-item">
                                <label for="framework" class="control-label"
                                    >Framework</label
                                >
                                <select
                                    id="framework"
                                    bind:value={selectedFramework.value}
                                    class="control-select"
                                >
                                    {#each FRAMEWORKS as framework}
                                        <option value={framework.id}
                                            >{framework.name}</option
                                        >
                                    {/each}
                                </select>
                            </div>

                            <!-- Install Method -->
                            <div class="control-item">
                                <label for="installMethod" class="control-label"
                                    >Install Method</label
                                >
                                <div class="button-group">
                                    <button
                                        class="control-btn"
                                        class:active={selectedInstallMethod ===
                                            "cdn"}
                                        class:disabled={!hasCdn}
                                        disabled={!hasCdn}
                                        onclick={() =>
                                            hasCdn &&
                                            (selectedInstallMethod = "cdn")}
                                        title={!hasCdn
                                            ? "CDN not available for this framework"
                                            : ""}
                                    >
                                        🌐 CDN
                                    </button>
                                    <button
                                        class="control-btn"
                                        class:active={selectedInstallMethod ===
                                            "package"}
                                        class:disabled={!hasPackage}
                                        disabled={!hasPackage}
                                        onclick={() =>
                                            hasPackage &&
                                            (selectedInstallMethod = "package")}
                                        title={!hasPackage
                                            ? "Package not available for this framework"
                                            : ""}
                                    >
                                        📦 Package
                                    </button>
                                </div>
                            </div>

                            <!-- Package Manager -->
                            <div class="control-item">
                                <label
                                    for="packageManager"
                                    class="control-label">Package Manager</label
                                >
                                <div class="button-group">
                                    {#each PACKAGE_MANAGERS as pm}
                                        <button
                                            class="control-btn"
                                            class:active={selectedPackageManager.value ===
                                                pm.id}
                                            onclick={() =>
                                                (selectedPackageManager.value =
                                                    pm.id)}
                                        >
                                            {pm.name}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="content">
            {#if filteredIcons.length === 0}
                <div class="empty-state">
                    <IconSearch size={80} stroke={2} />
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
                            iconColor={iconColor.value}
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
            iconColor={iconColor.value}
            framework={selectedFramework.value}
            packageManager={selectedPackageManager.value}
            installMethod={selectedInstallMethod}
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
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 0.75rem;
    }

    .frameworks strong {
        color: rgba(255, 255, 255, 1);
        font-weight: 600;
    }

    .features {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
    }

    .feature-badge {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
    }

    .links {
        margin-top: 1rem;
        display: flex;
        gap: 0.75rem;
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
        font-size: 0.875rem;
    }

    .links a:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    .github-star-link {
        background: linear-gradient(
            135deg,
            #24292e 0%,
            #1a1e22 100%
        ) !important;
        border: 2px solid rgba(255, 255, 255, 0.4) !important;
        font-weight: 600 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
    }

    .github-star-link:hover {
        background: linear-gradient(
            135deg,
            #2d333b 0%,
            #22272e 100%
        ) !important;
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
    }

    /* Controls Section */
    .controls {
        background: var(--bg-controls);
        border-bottom: 1px solid var(--border-primary);
        transition: all 0.3s ease;
    }

    .search-box {
        position: relative;
        padding: 1.5rem 1.5rem 0 1.5rem;
    }

    input[type="search"] {
        width: 100%;
        padding: 0.875rem 3rem 0.875rem 3rem;
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
        left: 2.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-tertiary);
        transition: color 0.3s ease;
        pointer-events: none;
    }

    .search-clear {
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        background: var(--bg-tertiary);
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: var(--text-secondary);
        transition: all 0.2s;
    }

    .search-clear:hover {
        background: var(--border-primary);
        color: var(--text-primary);
    }

    /* Stats Bar */
    .stats-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-primary);
    }

    .stats {
        display: flex;
        gap: 1.5rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
    }

    .cdn-hint {
        color: var(--text-tertiary);
        font-size: 0.875rem;
        font-style: italic;
    }

    /* Control Sections */
    .control-section {
        border-bottom: 1px solid var(--border-primary);
    }

    .control-section:last-child {
        border-bottom: none;
    }

    .section-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--bg-controls);
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text-primary);
    }

    .section-header:hover {
        background: var(--bg-tertiary);
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
    }

    .section-content {
        padding: 1.5rem;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Control Grid */
    .control-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .control-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .button-group {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .control-btn {
        padding: 0.5rem 1rem;
        border: 2px solid var(--border-primary);
        background: var(--btn-bg);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
    }

    .control-btn.flex-1 {
        flex: 1;
    }

    .control-btn.active {
        background: var(--btn-active-bg);
        color: var(--btn-active-text);
        border-color: var(--btn-active-bg);
    }

    .control-btn:hover:not(.active) {
        border-color: var(--accent-primary);
        background: var(--btn-bg-hover);
    }

    .control-btn:disabled,
    .control-btn.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }

    .control-select {
        width: 100%;
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

    .control-select:hover {
        border-color: var(--accent-primary);
        background: var(--btn-bg-hover);
    }

    .control-select:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Color Controls */
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
        flex-shrink: 0;
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

    /* Limit Choose Color button width on tablet */
    @media (min-width: 769px) and (max-width: 1024px) {
        .color-controls .control-btn.flex-1 {
            flex: 0 1 auto;
            max-width: 200px;
        }
    }

    /* Content */
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

    .empty-state h2 {
        margin-bottom: 0.5rem;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
        .control-grid {
            grid-template-columns: 1fr;
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

        .features {
            display: none;
        }

        .search-box {
            padding: 1rem 1rem 0 1rem;
        }

        input[type="search"] {
            padding: 0.75rem 2.5rem 0.75rem 2.5rem;
            font-size: 0.9rem;
        }

        .search-icon {
            left: 1.75rem;
            width: 18px;
            height: 18px;
        }

        .search-clear {
            right: 1.5rem;
            width: 28px;
            height: 28px;
            font-size: 1.25rem;
        }

        .stats-bar {
            padding: 0.75rem 1rem;
        }

        .stats {
            gap: 1rem;
            font-size: 0.8rem;
        }

        .section-header {
            padding: 0.875rem 1rem;
        }

        .section-content {
            padding: 1rem;
        }

        .content {
            padding: 0.5rem;
            height: calc(100vh - 420px);
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

        h1 {
            font-size: 1.5rem;
        }

        .subtitle,
        .frameworks,
        .features {
            display: none;
        }

        .links {
            gap: 0.5rem;
        }

        .links a {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
        }

        .search-box {
            padding: 0.75rem 0.75rem 0 0.75rem;
        }

        .stats-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 0.75rem;
        }

        .stats {
            gap: 0.75rem;
        }

        .cdn-hint {
            display: none;
        }

        .section-header {
            padding: 0.75rem;
        }

        .section-title {
            font-size: 0.8rem;
        }

        .section-content {
            padding: 0.75rem;
        }

        .control-grid {
            gap: 1rem;
        }

        .button-group {
            flex-wrap: wrap;
        }

        .control-btn {
            flex: 1;
            min-width: calc(50% - 0.25rem);
        }

        .content {
            padding: 0.25rem;
            height: calc(100vh - 340px);
        }
    }
</style>
