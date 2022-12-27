<script>
    import moment from "moment";
    import Popup from "./Popup.svelte";
    import { timeFormat } from "../state";
    export let shown, onClose;

    let enteredFormat = $timeFormat;
    let examples = [moment(-1), moment()];
    const suggestions = [
        "L LT",
        "MMM Do YYYY LT",
        "YYYY-MM-DD h:mm a",
        "YYYY-MM-DD HH:mm:ss Z",
    ];
    function updateExamples() {
        examples[1] = moment();
        examples = examples; // triggers update
    }

    let intervalId;
    $: onShownToggle(shown);
    function onShownToggle() {
        if (shown) intervalId = setInterval(updateExamples, 1000);
        else clearInterval(intervalId);
    }

    function apply() {
        $timeFormat = enteredFormat;
        onClose();
    }
</script>

<Popup title="Select date and time format" {shown} {onClose}>
    <div class="input">
        <input bind:value={enteredFormat} />
        <button on:click={apply}>Apply</button>
    </div>

    {#each examples as example}
        <div class="example">{example.format(enteredFormat)}</div>
    {/each}

    {#each suggestions as fmt}
        <button class="suggestion" on:click={() => (enteredFormat = fmt)}>
            {fmt}
        </button>
    {/each}
</Popup>

<style>
    .input {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
    }

    input {
        display: block;
        resize: none;
        font-size: 1em;
        width: 100%;
        box-sizing: border-box;
    }

    button.suggestion {
        border: 1px solid grey;
        display: block;
        margin-top: 8px;
    }

    .example {
        font-family: monospace;
    }
</style>
