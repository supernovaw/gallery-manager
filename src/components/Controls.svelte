<script>
    import { allFields, displayedFields } from "../state.js";
    import JsonMenu from "./JsonMenu.svelte";

    let group = [...allFields];
    function onChange(e) {
        if (group.length === 0) group = [e.target.value]; // do not allow to remove the last field
        displayedFields.set(group);
    }
    let showJsonMenu = false;
</script>

<div class="Controls">
    <!-- Upper row -->
    <div style="display: flex; gap: 8px">
        <input type="text" placeholder="Filter" style="flex: 1" />
        <button on:click={() => (showJsonMenu = true)}>
            Import/export JSON
        </button>
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
    </div>
</div>
<JsonMenu shown={showJsonMenu} onClose={() => (showJsonMenu = false)} />

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
