<script>
    import { gallery } from "../state";
</script>

<div class="ImagesList">
    <table>
        <tbody>
            {#each $gallery.images as image}
                <tr>
                    <td
                        class="thumbnail"
                        style="background-image: url(/gallery/thumbnails/{image.name})"
                    />
                    <td>{image.name}</td>
                    <td>{image.timestamp}</td>
                    <td>{image.tags.join(", ")}</td>
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
