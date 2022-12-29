<script>
	import Controls from "./Controls.svelte";
	import ImagesList from "./ImagesList.svelte";
	import ImagePanel from "./ImagePanel.svelte";
	import { filter } from "../state";

	let selectedName;
	function onSelect(name) {
		selectedName = name;
	}
	function navigateImage(delta) {
		// delta: -1 is previous, 1 is next
		const finder = (img) => img.name === selectedName;
		const index = $filter.imagesToDisplay.findIndex(finder);
		const img = $filter.imagesToDisplay[index + delta];
		if (img === undefined) return;
		selectedName = img.name;
	}
</script>

<div class="App">
	<Controls />
	<ImagesList {selectedName} {onSelect} />
	<ImagePanel {selectedName} {navigateImage} />
</div>

<style>
	.App {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
