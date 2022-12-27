<script>
	import Controls from "./Controls.svelte";
	import ImagesList from "./ImagesList.svelte";
	import ImagePanel from "./ImagePanel.svelte";
	import { gallery } from "../state";

	let selectedName;
	function onSelect(name) {
		selectedName = name;
	}
	function navigateImage(delta) {
		// delta: -1 is previous, 1 is next
		const index = $gallery.images.findIndex((o) => o.name === selectedName);
		const img = $gallery.images[index + delta];
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
