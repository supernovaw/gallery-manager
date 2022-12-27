<script>
    import moment from "moment";
    import { fade } from "svelte/transition";
    import { gallery, timeFormat } from "../state";

    export let selectedName;
    $: image = $gallery.images.find((img) => img.name === selectedName);
    $: console.log(image);
</script>

{#if image}
    <div class="ImagePanel" in:fade={{ duration: 150 }}>
        <div class="image-part">
            <img
                src="/gallery/images/{image.filename}"
                alt={image.name}
                title={image.filename}
            />
        </div>
        <div class="main-part">
            <div class="title">{image.name}</div>
            <div class="time">
                {moment(image.timestamp).format($timeFormat)}
            </div>
        </div>
    </div>
{/if}

<style>
    .ImagePanel {
        flex: 1;
        overflow: auto;
        display: flex;
        background-color: #1a1a1a;
    }

    .ImagePanel > div {
        flex: 1;
        box-sizing: border-box;
    }

    .image-part {
        box-sizing: border-box;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        max-height: 100%;
        box-sizing: content-box;
        object-fit: contain;
        object-position: 50% 50%;
    }

    .main-part {
        padding: 16px;
    }

    .title {
        text-align: center;
    }

    .time {
        font-size: 13px;
        text-align: center;
    }
</style>
