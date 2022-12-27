import { writable } from "svelte/store";
import { gallerySample } from "./sample-data";

export const allFields = ["thumbnail", "name", "timestamp", "tags"];
export const displayedFields = writable(allFields);
export const gallery = writable(gallerySample);

// return error message or undefined if all OK
export function verifyParsedGalleryIntegrity(obj) {
  if (typeof obj !== "object" || Array.isArray(obj)) return "not an object";

  // check obj.images
  const imgs = obj.images;
  if (!Array.isArray(imgs)) return "no images array";
  function checkImage(img) {
    const requireFields = ["name"];
    for (const f of requireFields) {
      if (img[f] === undefined) return `field "${f}" is absent`;
    }
  }
  for (let i = 0; i < imgs.length; i++) {
    const err = checkImage(imgs[i]);
    if (err) return `images[${i}] is invalid: ${err} in ${JSON.stringify(imgs[i])}`;
  }
}
