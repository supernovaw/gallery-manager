<script>
    import { gallery, allFields, displayedFields, filter } from "../state.js";
    import getNewFilterState from "../userFiltering";
    import JsonMenu from "./JsonMenu.svelte";
    import TimeFormatMenu from "./TimeFormatMenu.svelte";

    let group = [...allFields];
    function onChange(e) {
        if (group.length === 0) group = [e.target.value]; // do not allow to remove the last field
        displayedFields.set(group);
    }
    let showJsonMenu = $gallery.images.length === 0;
    let showTimeFormatMenu = false;
    function enableJsonMenu() {
        showJsonMenu = true;
        showTimeFormatMenu = false;
    }
    function enableTimeFormatMenu() {
        showJsonMenu = false;
        showTimeFormatMenu = true;
    }

    function onFilterChange(e) {
        $filter = getNewFilterState(e.target.value, $gallery);
    }
</script>

<div class="Controls">
    <!-- Upper row -->
    <div style="display: flex; gap: 8px">
        <input
            type="text"
            placeholder={'Filter, e.g. return it("cat")'}
            style="flex: 1"
            on:input={onFilterChange}
        />
        <div style="flex: 0 0 160px; text-align: center">
            {`Showing ${$filter.imagesToDisplay.length}/${$gallery.images.length}`}
        </div>
        <button on:click={enableJsonMenu}>Import/export JSON</button>
    </div>

    <!-- Lower row -->
    <div>
        Display fields:
        {#each allFields as field}
            <label>
                <input
                    type="checkbox"
                    value={field}
                    bind:group
                    on:change={onChange}
                />{field}
            </label>
        {/each}
        <button on:click={enableTimeFormatMenu}>Time format</button>
    </div>
</div>
<JsonMenu shown={showJsonMenu} onClose={() => (showJsonMenu = false)} />
<TimeFormatMenu
    shown={showTimeFormatMenu}
    onClose={() => (showTimeFormatMenu = false)}
/>

<style>
    .Controls {
        padding-inline: 8px;
        padding-bottom: 8px;
    }

    .Controls > div {
        margin-top: 8px;
    }

    label {
        padding-inline: 8px;
    }

    label {
        transition: 70ms ease-out;
        color: #666;
        user-select: none;
    }

    label:has(input:checked) {
        color: var(--accent);
    }
</style>
