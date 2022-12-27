<script>
	import Controls from "./Controls.svelte";
	import ImagesList from "./ImagesList.svelte";
	import ImagePanel from "./ImagePanel.svelte";

	let selectedName;
	function onSelect(name) {
		selectedName = name;
	}
</script>

<div class="App">
	<Controls />
	<ImagesList {selectedName} {onSelect} />
	<ImagePanel {selectedName} />
</div>

<style>
	.App {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
