<script lang="ts">
    let { icon, iconColor = "#3b82f6", onclick } = $props();
</script>

<button class="icon-card" {onclick}>
    <div class="icon-svg" style="color: {iconColor};">
        <icon.component size="60%" stroke={1.5} />
    </div>
    <div class="icon-name">{icon.name}</div>
    <div class="icon-style">{icon.style}</div>
</button>

<style>
    .icon-card {
        width: 100%;
        height: 100%;
        border: 2px solid var(--border-primary, #e5e7eb);
        border-radius: 12px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: var(--bg-secondary, white);
        box-sizing: border-box;
    }

    .icon-card:hover {
        border-color: var(--accent-primary, #3b82f6);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .icon-svg {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
        transition: filter 0.3s ease;
    }

    .icon-name {
        font-size: clamp(0.65rem, 1.5vw, 0.75rem);
        color: var(--text-primary, #374151);
        text-align: center;
        word-break: break-word;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 100%;
        line-height: 1.2;
        transition: color 0.3s ease;
    }

    .icon-style {
        font-size: clamp(0.6rem, 1.2vw, 0.65rem);
        color: var(--text-tertiary, #9ca3af);
        text-transform: capitalize;
        transition: color 0.3s ease;
    }
</style>
