<script>
    import moment from "moment";
    import { fade } from "svelte/transition";
    import { gallery, timeFormat, filter } from "../state";
    import { displayedFields } from "../state";
    export let selectedName, onSelect;

    let tbodyEl;
    $: tbodyEl
        ?.querySelector(`tr[imagename="${selectedName}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
</script>

<div class="ImagesList">
    {#if $filter.errorInUserFn}
        <div class="overlay-warning" transition:fade={{ duration: 150 }}>
            An error ({$filter.errorInUserFn.name}) occured during execution of
            the filter function<br />
            <i>{$filter.errorInUserFn.message}</i>
        </div>
    {/if}

    {#if $filter.warningInUserFn && !$filter.errorInUserFn}
        <div class="overlay-warning light" transition:fade={{ duration: 150 }}>
            <i>{$filter.warningInUserFn}</i>
        </div>
    {/if}

    {#if $filter.imagesToDisplay.length > 0 && !$filter.errorMessage}
        <table>
            <tbody bind:this={tbodyEl}>
                {#each $filter.imagesToDisplay as image (image.name)}
                    <tr
                        on:click={() => onSelect(image.name)}
                        class:selected={selectedName === image.name}
                        imagename={image.name}
                    >
                        {#if $displayedFields.includes("thumbnail")}
                            <td class="thumbnail">
                                <img
                                    src="/gallery/thumbnails/{image.name}"
                                    alt={image.name}
                                    loading="lazy"
                                />
                            </td>
                        {/if}
                        {#if $displayedFields.includes("name")}
                            <td>{image.name}</td>
                        {/if}
                        {#if $displayedFields.includes("timestamp")}
                            <td>{moment(image.timestamp).format($timeFormat)}</td>
                        {/if}
                        {#if $displayedFields.includes("tags")}
                            <td>{image.tags.join(", ")}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="warning">
            {#if $filter.errorMessage}
                Failed to create a filter function<br />
                <i>{$filter.errorMessage}</i>
            {:else if $gallery.images.length === 0}
                No images in gallery, import JSON first
            {:else if $filter.imagesToDisplay.length === 0}
                No images left after filtering
            {/if}
        </div>
    {/if}
</div>

<style>
    .ImagesList {
        flex: 1;
        overflow-y: auto;
        position: relative;
    }

    table {
        margin-top: 2px;
        width: 100%;
        border: none;
        border-collapse: separate;
        border-spacing: 0;
    }

    tr {
        transition: 0.1s ease-out;
        outline: 2px solid transparent;
    }

    tr.selected {
        outline: 2px solid var(--accent);
    }

    tr.selected,
    tr:hover {
        background-color: #333;
    }

    td {
        padding: 3px;
        cursor: default;
    }

    td.thumbnail {
        padding: 0;
        width: 80px;
        height: 45px;
    }

    td.thumbnail img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 50%;
    }

    .overlay-warning {
        position: absolute;
        left: 25%;
        right: 25%;
        top: 50px;
        padding: 16px;
        background-color: #ec6d8250;
        border-radius: 16px;
        backdrop-filter: blur(10px);
    }

    .overlay-warning.light {
        background-color: #d9cd2950;
    }

    .warning {
        text-align: center;
        padding: 32px;
        font-style: italic;
    }
</style>
