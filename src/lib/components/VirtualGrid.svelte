<script lang="ts">
    import { onMount } from "svelte";

    let { items = [], columns = 6, gap = 16, children }: any = $props();

    let containerHeight = $state(600);
    let containerWidth = $state(1000);
    let scrollTop = $state(0);
    let container: HTMLElement;

    // Function to scroll to top
    export function scrollToTop() {
        if (container) {
            container.scrollTop = 0;
            scrollTop = 0;
        }
    }

    // Reset scroll when items change
    $effect(() => {
        // This will run whenever items array reference changes
        items;
        scrollToTop();
    });

    // Calculate item dimensions based on columns
    let itemWidth = $derived(
        Math.floor((containerWidth - gap * (columns - 1)) / columns)
    );
    let itemHeight = $derived(itemWidth); // Square items

    // Calculate grid dimensions
    let gridColumns = $derived(columns);
    let gridRows = $derived(Math.ceil(items.length / gridColumns));
    let totalHeight = $derived(gridRows * (itemHeight + gap) - gap);

    // Calculate visible range
    let startRow = $derived(Math.floor(scrollTop / (itemHeight + gap)));
    let endRow = $derived(
        Math.ceil((scrollTop + containerHeight) / (itemHeight + gap))
    );

    // Add buffer rows above and below
    let bufferRows = 2;
    let renderStartRow = $derived(Math.max(0, startRow - bufferRows));
    let renderEndRow = $derived(Math.min(gridRows, endRow + bufferRows));

    // Get visible items
    let visibleItems = $derived.by(() => {
        const start = renderStartRow * gridColumns;
        const end = renderEndRow * gridColumns;
        return items.slice(start, end).map((item: any, index: number) => {
            const absoluteIndex = start + index;
            const row = Math.floor(absoluteIndex / gridColumns);
            const col = absoluteIndex % gridColumns;
            return {
                item,
                top: row * (itemHeight + gap),
                left: col * (itemWidth + gap),
                index: absoluteIndex,
            };
        });
    });

    function handleScroll(e: Event) {
        scrollTop = (e.target as HTMLElement).scrollTop;
    }

    onMount(() => {
        if (container) {
            containerHeight = container.clientHeight;
            containerWidth = container.clientWidth;

            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    containerHeight = entry.contentRect.height;
                    containerWidth = entry.contentRect.width;
                }
            });
            resizeObserver.observe(container);

            return () => resizeObserver.disconnect();
        }
    });
</script>

<div
    bind:this={container}
    class="virtual-grid-container"
    onscroll={handleScroll}
>
    <div class="virtual-grid-inner" style="height: {totalHeight}px;">
        {#each visibleItems as { item, top, left, index } (item.componentName || index)}
            <div
                class="virtual-grid-item"
                style="position: absolute; top: {top}px; left: {left}px; width: {itemWidth}px; height: {itemHeight}px;"
            >
                {@render children(item)}
            </div>
        {/each}
    </div>
</div>

<style>
    .virtual-grid-container {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
        position: relative;
        box-sizing: border-box;
    }

    .virtual-grid-inner {
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .virtual-grid-item {
        position: absolute;
        box-sizing: border-box;
        padding: 0;
    }

    .virtual-grid-item > :global(*) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
</style>
