<script>
    import moment from "moment";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { gallery, timeFormat } from "../state";
    export let selectedName, navigateImage;

    $: sortedTags = [...$gallery.tags].sort();

    $: imageIndex = $gallery.images.findIndex((o) => o.name === selectedName);
    $: image = $gallery.images[imageIndex];

    let selectedTags = [];
    let previousTags;
    let enteredNotes;
    function onTagSelect() {
        $gallery.images[imageIndex].tags = selectedTags;
    }
    function onEnteredNotesChange() {
        $gallery.images[imageIndex].notes = enteredNotes;
    }

    const onImageChange = () => {
        previousTags = selectedTags;
        selectedTags = image?.tags || [];
        enteredNotes = image?.notes;
    };
    $: image, onImageChange();

    onMount(() => {
        function onKeyDown(e) {
            if (e.target.nodeName !== "BODY") return;
            if (e.code === "KeyQ") {
                navigateImage(-1);
            } else if (e.code === "KeyE") {
                navigateImage(+1);
            } else if (e.code === "KeyW") {
                selectedTags = previousTags;
                onTagSelect();
            } else if (e.code === "KeyS") {
                selectedTags = [];
                onTagSelect();
            }
        }
        document.body.addEventListener("keydown", onKeyDown);
        return () => document.body.removeEventListener("keydown", onKeyDown);
    });
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
            <div class="tags-selector">
                {#each sortedTags as tag}
                    <label>
                        <input
                            type="checkbox"
                            value={tag}
                            bind:group={selectedTags}
                            on:change={onTagSelect}
                        />
                        {tag}
                    </label>
                {/each}
            </div>
            <textarea
                class="notes"
                placeholder="Notes"
                bind:value={enteredNotes}
                on:change={onEnteredNotesChange}
            />
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

    .tags-selector {
        margin-top: 8px;
    }

    .tags-selector label input {
        position: absolute;
        visibility: hidden;
    }

    .tags-selector label {
        transition: 0.1s ease-out;
        display: inline-block;
        user-select: none;
        cursor: pointer;
        color: #777;
        background-color: #272727;
        border-radius: 10px;
        margin: 4px;
        padding: 3px 6px;
        text-decoration: underline transparent;
    }

    .tags-selector label:has(input:checked) {
        color: var(--accent);
        outline: 2px solid var(--accent);
    }

    .tags-selector label:hover {
        text-decoration-color: inherit;
    }

    textarea.notes {
        margin-top: 12px;
        display: block;
        width: 100%;
        box-sizing: border-box;
        resize: none;
    }
</style>
