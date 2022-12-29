<script>
    import moment from "moment";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";
    import { gallery, timeFormat, filter } from "../state";
    import { displayedFields } from "../state";
    import { sortNames } from "../userFiltering";
    export let selectedName, onSelect;

    let tbodyEl;
    $: tbodyEl
        ?.querySelector(`tr[imagename="${selectedName}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });

    let sortedTableRows;
    $: updateSortedTableRows($gallery);
    async function updateSortedTableRows() {
        sortedTableRows = undefined; // prevent hideFilteredRows from working on outdated values
        await tick(); // if we don't await a tick, querySelectorAll will return outdated values
        sortedTableRows = [
            ...document.querySelectorAll(".ImagesList tbody tr"),
        ].sort((a, b) =>
            sortNames(a.getAttribute("imagename"), b.getAttribute("imagename"))
        );
        hideFilteredRows();
    }

    // in order to avoid unnecessary component and node creation, just switch the DOM attr "hidden"
    $: hideFilteredRows($filter);
    function hideFilteredRows() {
        if (!sortedTableRows) return;

        const filteredImgs = [...$filter.imagesToDisplay].sort((a, b) =>
            sortNames(a.name, b.name)
        );
        /* At this point, we have two sorted arrays, where sortedTableRows has every image, and
           filteredImgs has only part of the images. If we linearly traverse both filteredImgs and
           sortedTableRows (because they are both sorted in the same way), we can determine if to
           show each row in O(n + n log n) operations (n log n is because of sorting) instead of
           O(n * n) if we ran filteredImgs.some() for every row. This is a lot more code than if
           using {#each $filter.imagesToDisplay}, but, for a set of 2000 images this code runs in
           several milliseconds as opposed to about 100ms for me if using forEach() and some() */
        let filteredArrayIndex = 0;
        for (let i = 0; i < sortedTableRows.length; i++) {
            const thisRow = sortedTableRows[i];
            const thisRowName = thisRow.getAttribute("imagename");
            if (filteredImgs[filteredArrayIndex]?.name === thisRowName) {
                filteredArrayIndex++;
                thisRow.hidden = false;
            } else {
                thisRow.hidden = true;
            }
        }
    }
</script>

<div class="ImagesList">
    {#if $filter.errorMessage}
        <div class="overlay-warning" transition:fade={{ duration: 150 }}>
            Failed to create the filter function<br />
            <i>{$filter.errorMessage}</i>
        </div>
    {/if}

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

    {#if $gallery.images.length === 0}
        <div class="warning">No images in gallery, import JSON first</div>
    {:else if $filter.imagesToDisplay.length === 0}
        <div class="warning">No images left after filtering</div>
    {/if}

    <table>
        <tbody bind:this={tbodyEl}>
            {#each $gallery.images as image (image.name)}
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
        top: 60px;
        padding: 16px;
        background-color: #ec6d8250;
        border-radius: 16px;
        backdrop-filter: blur(10px);
        z-index: 1;
    }

    .overlay-warning.light {
        background-color: #d9cd2950;
    }

    .warning {
        text-align: center;
        padding: 32px;
        font-style: italic;
        z-index: 1;
    }
</style>
