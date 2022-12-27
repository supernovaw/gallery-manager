<script>
    import moment from "moment";
    import { gallery, timeFormat } from "../state";
    import { displayedFields } from "../state";
    export let selectedName, onSelect;
</script>

<div class="ImagesList">
    <table>
        <tbody>
            {#each $gallery.images as image (image.name)}
                <tr
                    on:click={() => onSelect(image.name)}
                    class:selected={selectedName === image.name}
                >
                    {#if $displayedFields.includes("thumbnail")}
                        <td
                            class="thumbnail"
                            style="background-image: url(/gallery/thumbnails/{image.name})"
                        />
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
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: contain;
    }
</style>
