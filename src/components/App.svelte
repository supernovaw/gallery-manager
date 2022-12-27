<script>
	import Controls from "./Controls.svelte";
	import ImagesList from "./ImagesList.svelte";
</script>

<div class="App">
	<Controls />
	<ImagesList />
</div>

<style>
	.App {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
