<script>
    import moment from "moment";
    import { gallery, timeFormat } from "../state";
    import { displayedFields } from "../state";
</script>

<div class="ImagesList">
    <table>
        <tbody>
            {#each $gallery.images as image}
                <tr>
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
        width: 100%;
    }

    td.thumbnail {
        width: 80px;
        height: 45px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: contain;
    }
</style>
