<script lang="ts">
    import { iconColor, selectedTheme } from "$lib/stores/preferences.svelte";
    import { IconSun, IconCheck } from "@tabler/icons-svelte";

    let { onclose } = $props();

    // State for the color picker
    let tempColor = $state(iconColor.value);
    let hexInput = $state(iconColor.value);
    let hue = $state(0);
    let saturation = $state(100);
    let lightness = $state(50);

    // Preset colors
    const presetColors = [
        "#3b82f6", // Blue
        "#ef4444", // Red
        "#10b981", // Green
        "#f59e0b", // Amber
        "#8b5cf6", // Purple
        "#ec4899", // Pink
        "#06b6d4", // Cyan
        "#f97316", // Orange
        "#84cc16", // Lime
        "#6366f1", // Indigo
        "#14b8a6", // Teal
        "#a855f7", // Violet
        "#f43f5e", // Rose
        "#0ea5e9", // Sky
        "#22c55e", // Emerald
        "#eab308", // Yellow
        "#64748b", // Slate
        "#374151", // Gray
        "#1f2937", // Dark Gray
        "#000000", // Black
    ];

    // Initialize HSL from current color
    $effect(() => {
        const { h, s, l } = hexToHSL(tempColor);
        hue = h;
        saturation = s;
        lightness = l;
    });

    function hexToHSL(hex: string): { h: number; s: number; l: number } {
        // Remove # if present
        hex = hex.replace("#", "");

        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    }

    function hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0,
            g = 0,
            b = 0;

        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (h >= 300 && h < 360) {
            r = c;
            g = 0;
            b = x;
        }

        const toHex = (n: number) => {
            const hex = Math.round((n + m) * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function updateColorFromHSL() {
        tempColor = hslToHex(hue, saturation, lightness);
        hexInput = tempColor;
    }

    function updateColorFromHex() {
        if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
            tempColor = hexInput.toUpperCase();
            const { h, s, l } = hexToHSL(tempColor);
            hue = h;
            saturation = s;
            lightness = l;
        }
    }

    function selectPreset(color: string) {
        tempColor = color;
        hexInput = color;
        const { h, s, l } = hexToHSL(color);
        hue = h;
        saturation = s;
        lightness = l;
    }

    function applyColor() {
        iconColor.value = tempColor;
        onclose();
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
    data-theme={selectedTheme.value}
>
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title" class="modal-title">Choose Icon Color</h2>
            <button class="close-btn" onclick={onclose} aria-label="Close"
                >×</button
            >
        </div>

        <!-- Color Preview -->
        <div class="color-preview">
            <div class="preview-box" style="background-color: {tempColor};">
                <!-- Icon Preview -->
                <IconSun size={48} stroke={2} color="white" />
            </div>
            <div class="preview-info">
                <span class="preview-label">Current Color</span>
                <span class="preview-hex">{tempColor.toUpperCase()}</span>
            </div>
        </div>

        <!-- Hue Selector -->
        <div class="picker-section">
            <label for="hue-slider">Hue</label>
            <input
                id="hue-slider"
                type="range"
                min="0"
                max="360"
                bind:value={hue}
                oninput={updateColorFromHSL}
                class="hue-slider"
            />
        </div>

        <!-- Saturation Selector -->
        <div class="picker-section">
            <label for="saturation-slider">Saturation</label>
            <input
                id="saturation-slider"
                type="range"
                min="0"
                max="100"
                bind:value={saturation}
                oninput={updateColorFromHSL}
                class="saturation-slider"
                style="--hue: {hue};"
            />
        </div>

        <!-- Lightness Selector -->
        <div class="picker-section">
            <label for="lightness-slider">Lightness</label>
            <input
                id="lightness-slider"
                type="range"
                min="0"
                max="100"
                bind:value={lightness}
                oninput={updateColorFromHSL}
                class="lightness-slider"
                style="--hue: {hue}; --saturation: {saturation}%;"
            />
        </div>

        <!-- Hex Input -->
        <div class="picker-section">
            <label for="hex-input">Hex Color</label>
            <div class="hex-input-group">
                <input
                    id="hex-input"
                    type="text"
                    bind:value={hexInput}
                    oninput={updateColorFromHex}
                    placeholder="#3b82f6"
                    maxlength="7"
                    class="hex-input"
                />
            </div>
        </div>

        <!-- Preset Colors -->
        <div class="picker-section">
            <label for="preset-colors">Preset Colors</label>
            <div class="preset-grid" id="preset-colors">
                {#each presetColors as color}
                    <button
                        class="preset-color"
                        style="background-color: {color};"
                        onclick={() => selectPreset(color)}
                        aria-label="Select {color}"
                        class:active={tempColor.toLowerCase() ===
                            color.toLowerCase()}
                    >
                        {#if tempColor.toLowerCase() === color.toLowerCase()}
                            <IconCheck size={16} stroke={3} color="white" />
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick={onclose}>Cancel</button>
            <button class="btn btn-primary" onclick={applyColor}>
                Apply Color
            </button>
        </div>
    </div>
</div>

<style>
    /* Theme Variables */
    .modal[data-theme="light"] {
        --bg-primary: #f8fafc;
        --bg-secondary: #ffffff;
        --bg-tertiary: #f1f5f9;

        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-tertiary: #94a3b8;

        --accent-primary: #3b82f6;
        --accent-primary-hover: #2563eb;

        --border-primary: #e2e8f0;
        --border-focus: #3b82f6;

        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

        --btn-bg: #f1f5f9;
        --btn-bg-hover: #e2e8f0;
    }

    .modal[data-theme="dark"] {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;

        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
        --text-tertiary: #64748b;

        --accent-primary: #60a5fa;
        --accent-primary-hover: #3b82f6;

        --border-primary: #334155;
        --border-focus: #60a5fa;

        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);

        --btn-bg: #334155;
        --btn-bg-hover: #475569;
    }

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
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow: auto;
        animation: slideUp 0.3s ease-out;
        box-shadow: var(--shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
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
        margin-bottom: 1.5rem;
    }

    .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
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

    /* Color Preview */
    .color-preview {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--bg-tertiary, #f9fafb);
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .preview-box {
        width: 80px;
        height: 80px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
        transition: all 0.3s ease;
    }

    .preview-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .preview-label {
        font-size: 0.875rem;
        color: var(--text-secondary, #6b7280);
        font-weight: 500;
    }

    .preview-hex {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary, #111827);
        font-family: "Monaco", "Courier New", monospace;
    }

    /* Picker Sections */
    .picker-section {
        margin-bottom: 1.5rem;
    }

    .picker-section label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary, #374151);
        margin-bottom: 0.75rem;
    }

    /* Sliders */
    input[type="range"] {
        width: 100%;
        height: 32px;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
    }

    input[type="range"]::-webkit-slider-track {
        height: 12px;
        border-radius: 6px;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--bg-secondary, white);
        cursor: pointer;
        border: 3px solid var(--text-primary, #111827);
        box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.2));
        margin-top: -6px;
    }

    input[type="range"]::-moz-range-track {
        height: 12px;
        border-radius: 6px;
    }

    input[type="range"]::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--bg-secondary, white);
        cursor: pointer;
        border: 3px solid var(--text-primary, #111827);
        box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.2));
    }

    /* Hue Slider */
    .hue-slider::-webkit-slider-track {
        background: linear-gradient(
            to right,
            #ff0000 0%,
            #ffff00 17%,
            #00ff00 33%,
            #00ffff 50%,
            #0000ff 67%,
            #ff00ff 83%,
            #ff0000 100%
        );
    }

    .hue-slider::-moz-range-track {
        background: linear-gradient(
            to right,
            #ff0000 0%,
            #ffff00 17%,
            #00ff00 33%,
            #00ffff 50%,
            #0000ff 67%,
            #ff00ff 83%,
            #ff0000 100%
        );
    }

    /* Saturation Slider */
    .saturation-slider::-webkit-slider-track {
        background: linear-gradient(
            to right,
            hsl(var(--hue), 0%, 50%),
            hsl(var(--hue), 100%, 50%)
        );
    }

    .saturation-slider::-moz-range-track {
        background: linear-gradient(
            to right,
            hsl(var(--hue), 0%, 50%),
            hsl(var(--hue), 100%, 50%)
        );
    }

    /* Lightness Slider */
    .lightness-slider::-webkit-slider-track {
        background: linear-gradient(
            to right,
            hsl(var(--hue), var(--saturation), 0%),
            hsl(var(--hue), var(--saturation), 50%),
            hsl(var(--hue), var(--saturation), 100%)
        );
    }

    .lightness-slider::-moz-range-track {
        background: linear-gradient(
            to right,
            hsl(var(--hue), var(--saturation), 0%),
            hsl(var(--hue), var(--saturation), 50%),
            hsl(var(--hue), var(--saturation), 100%)
        );
    }

    /* Hex Input */
    .hex-input-group {
        position: relative;
    }

    .hex-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--border-primary, #e5e7eb);
        border-radius: 8px;
        font-size: 1rem;
        font-family: "Monaco", "Courier New", monospace;
        text-transform: uppercase;
        transition: all 0.2s;
        background: var(--bg-secondary, white);
        color: var(--text-primary, #111827);
    }

    .hex-input:focus {
        outline: none;
        border-color: var(--accent-primary, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Preset Colors */
    .preset-grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 0.5rem;
    }

    .preset-color {
        aspect-ratio: 1;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
    }

    .preset-color:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.15));
    }

    .preset-color.active {
        border-color: var(--text-primary, #111827);
        box-shadow:
            0 0 0 2px var(--bg-secondary, white),
            0 0 0 4px var(--text-primary, #111827);
    }

    /* Action Buttons */
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-primary, #e5e7eb);
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .btn-secondary {
        background: var(--btn-bg, #f3f4f6);
        color: var(--text-primary, #374151);
    }

    .btn-secondary:hover {
        background: var(--btn-bg-hover, #e5e7eb);
    }

    .btn-primary {
        background: var(--accent-primary, #3b82f6);
        color: white;
    }

    .btn-primary:hover {
        background: var(--accent-primary-hover, #2563eb);
    }

    /* Mobile Responsiveness */
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

        .preset-grid {
            grid-template-columns: repeat(8, 1fr);
        }

        .color-preview {
            flex-direction: column;
            text-align: center;
        }
    }

    @media (max-width: 400px) {
        .preset-grid {
            grid-template-columns: repeat(5, 1fr);
        }
    }
</style>
