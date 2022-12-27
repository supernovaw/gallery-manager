<script>
    import Popup from "./Popup.svelte";
    import { gallery, verifyParsedGalleryIntegrity } from "../state";
    export let shown, onClose;
    let textarea,
        errorMsg = "";

    function copy() {
        navigator.clipboard.writeText(JSON.stringify($gallery));
    }
    function parseAndApply() {
        let parsed;
        try {
            parsed = JSON.parse(textarea.value);
        } catch (e) {
            errorMsg = e.message;
            return;
        }
        const validationError = verifyParsedGalleryIntegrity(parsed);
        if (validationError) {
            errorMsg = "Validation failed: " + validationError;
            return;
        }
        $gallery = parsed;
        errorMsg = "";
    }
</script>

<Popup title="Import/export JSON" {shown} {onClose}>
    <button on:click={copy}>Copy JSON to clipboard</button>
    <button on:click={parseAndApply}>Apply pasted JSON</button>
    <textarea bind:this={textarea} />
    <span>{errorMsg}</span>
</Popup>

<style>
    button {
        display: block;
        margin-bottom: 8px;
    }

    textarea {
        display: block;
        resize: none;
        font-size: 11px;
        width: 100%;
        height: 10em;
        box-sizing: border-box;
        margin-bottom: 8px;
    }

    span {
        font-style: italic;
        font-size: 12px;
        color: #f69696;
        word-wrap: break-word;
    }
</style>
