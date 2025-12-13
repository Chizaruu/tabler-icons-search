<script lang="ts">
    import { FRAMEWORKS } from "$lib/data/frameworks-helpers";
    import { getCodeExample } from "$lib/data/code-examples";
    import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-svelte";

    let {
        icon,
        iconColor = "#3b82f6",
        framework,
        packageManager,
        installMethod,
        onclose,
    } = $props();
    let copySuccess = $state(false);

    // Check if current framework has NPM package
    let currentFramework = $derived(FRAMEWORKS.find((f) => f.id === framework));
    let hasNpmPackage = $derived(currentFramework?.hasNpmPackage ?? true);

    let currentExample = $derived.by(() => {
        if (!currentFramework) return { install: "", import: "", usage: "" };
        return getCodeExample(
            framework,
            icon,
            currentFramework,
            packageManager,
            installMethod
        );
    });

    async function copyCode(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copySuccess = true;
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            alert("Failed to copy to clipboard");
        }
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onclose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onclose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="modal"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
>
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title" class="modal-title">{icon.name}</h2>
            <button class="close-btn" onclick={onclose} aria-label="Close"
                >×</button
            >
        </div>

        <div class="icon-meta">
            <span class="badge">{icon.style}</span>
            <span class="badge code">{icon.componentName}</span>
        </div>

        <div class="icon-preview" style="color: {iconColor};">
            <icon.component size={150} stroke={1.5} />
        </div>

        {#if !hasNpmPackage}
            <div class="no-package-warning">
                <IconAlertCircle size={20} stroke={2} />
                <div>
                    <strong>Note:</strong>
                    {currentFramework?.package} is not available on NPM. CDN is the
                    only installation method for this framework.
                </div>
            </div>
        {/if}

        {#if installMethod === "cdn"}
            <div class="cdn-info">
                <IconInfoCircle size={20} stroke={2} />
                <div>
                    <strong>Zero Installation!</strong> Icons served directly from
                    NPM via jsDelivr CDN. No build step required. Global CDN with
                    unlimited bandwidth.
                </div>
            </div>
        {/if}

        <div class="code-section">
            <h3>
                {installMethod === "cdn" ? "CDN Setup" : "Installation"}
            </h3>
            <pre class="code-block"><code>{currentExample.install}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.install)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>

        <div class="code-section">
            <h3>
                {installMethod === "cdn" ? "Direct URL" : "Import"}
            </h3>
            <pre class="code-block"><code>{currentExample.import}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.import)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>

        <div class="code-section">
            <h3>Usage Examples</h3>
            <pre class="code-block"><code>{currentExample.usage}</code></pre>
            <button
                class="copy-btn"
                onclick={() => copyCode(currentExample.usage)}
            >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
            </button>
        </div>

        {#if installMethod === "cdn"}
            <div class="cdn-benefits">
                <h4>CDN Benefits:</h4>
                <ul>
                    <li>
                        ✅ <strong>Zero bundle size</strong> - Icons loaded on-demand
                    </li>
                    <li>
                        ✅ <strong>Global CDN</strong> - Fast delivery worldwide
                        via jsDelivr
                    </li>
                    <li>
                        ✅ <strong>No build step</strong> - Works immediately in
                        any project
                    </li>
                    <li>
                        ✅ <strong>Version control</strong> - Pin to specific version
                        or auto-update
                    </li>
                    <li>
                        ✅ <strong>Framework-specific</strong> - Optimized packages
                        for each framework
                    </li>
                    <li>
                        ✅ <strong>Always available</strong> - Served from NPM registry
                        mirror
                    </li>
                </ul>
            </div>
        {/if}
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-content {
        background: var(--bg-secondary, white);
        border-radius: 16px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow: auto;
        animation: slideUp 0.3s ease-out;
        border: 1px solid var(--border-primary, #e5e7eb);
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-primary, #111827);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary, #6b7280);
        padding: 0.5rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: var(--text-primary, #111827);
    }

    .icon-meta {
        margin-bottom: 1.5rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .badge {
        display: inline-block;
        background: var(--bg-tertiary, #f3f4f6);
        color: var(--text-secondary, #6b7280);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        text-transform: capitalize;
    }

    .badge.code {
        font-family: "Monaco", "Courier New", monospace;
    }

    .icon-preview {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background: var(--bg-tertiary, #f9fafb);
        border-radius: 12px;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    /* No Package Warning */
    .no-package-warning {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: linear-gradient(
            135deg,
            rgba(251, 146, 60, 0.1),
            rgba(251, 191, 36, 0.1)
        );
        border: 2px solid #f59e0b;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        color: var(--text-primary, #374151);
    }

    .no-package-warning strong {
        color: #f59e0b;
    }

    /* CDN Info Banner */
    .cdn-info {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1),
            rgba(139, 92, 246, 0.1)
        );
        border: 2px solid var(--accent-primary, #3b82f6);
        border-radius: 8px;
        margin-bottom: 1.5rem;
        color: var(--text-primary, #374151);
    }

    .cdn-info strong {
        color: var(--accent-primary, #3b82f6);
    }

    /* CDN Benefits */
    .cdn-benefits {
        margin-top: 1.5rem;
        padding: 1rem;
        background: var(--bg-tertiary, #f9fafb);
        border-radius: 8px;
        border: 1px solid var(--border-primary, #e5e7eb);
    }

    .cdn-benefits h4 {
        margin-bottom: 0.75rem;
        color: var(--text-primary, #374151);
        font-size: 0.875rem;
        font-weight: 600;
    }

    .cdn-benefits ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .cdn-benefits li {
        font-size: 0.875rem;
        color: var(--text-secondary, #6b7280);
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        line-height: 1.5;
    }

    .cdn-benefits li strong {
        color: var(--text-primary, #374151);
    }

    .code-section {
        margin-top: 1.5rem;
    }

    .code-section h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary, #374151);
    }

    .code-block {
        background: var(--bg-tertiary, #f3f4f6);
        padding: 1rem;
        border-radius: 8px;
        font-family: "Monaco", "Courier New", monospace;
        font-size: 0.875rem;
        overflow-x: auto;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border-primary, #e5e7eb);
    }

    .code-block code {
        white-space: pre-wrap;
        word-break: break-all;
        color: var(--text-primary, #374151);
    }

    .copy-btn {
        background: var(--accent-primary, #3b82f6);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background 0.2s;
        margin-right: 0.5rem;
    }

    .copy-btn:hover {
        background: var(--accent-primary-hover, #2563eb);
    }

    @media (max-width: 640px) {
        .modal {
            padding: 1rem;
        }

        .modal-content {
            padding: 1.5rem;
        }

        .modal-title {
            font-size: 1.25rem;
        }
    }
</style>
