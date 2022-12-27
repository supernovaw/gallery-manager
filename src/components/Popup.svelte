<script>
    import { fade } from "svelte/transition";

    export let shown;
    export let onClose;
</script>

{#if shown}
    <div class="Popup" class:shown transition:fade={{ duration: 100 }}>
        <slot />
        <button on:click={onClose}>Close</button>
    </div>
{/if}

<style>
    .Popup {
        background: #171717e0;
        backdrop-filter: blur(10px);
        border-radius: 16px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 15vh 15vw;
        padding: 32px;
        overflow: auto;
    }

    button {
        position: absolute;
        bottom: 12px;
        right: 12px;
        padding: 6px 12px;
    }
</style>
