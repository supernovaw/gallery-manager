import { writable } from "svelte/store";
import { gallerySample } from "./sample-data";

export const allFields = ["thumbnail", "name", "timestamp", "tags"];
export const displayedFields = writable(allFields);
export const timeFormat = writable("YYYY-MM-DD HH:mm:ss Z");
export const gallery = writable(gallerySample);
