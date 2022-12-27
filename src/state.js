import { writable } from "svelte/store";
import { gallerySample } from "./sample-data";

export const allFields = ["thumbnail", "name", "timestamp", "tags"];
export const displayedFields = writable(allFields);
export const timeFormat = writable("YYYY-MM-DD HH:mm:ss Z");
export const gallery = writable(gallerySample);

function findDuplicate(array) {
  const sorted = [...array].sort();
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] == sorted[i]) return sorted[i - 1];
  }
  return false;
}

// return error message or undefined if all OK
export function verifyParsedGalleryIntegrity(obj) {
  if (typeof obj !== "object" || Array.isArray(obj)) return "not an object";

  // check obj.tags
  const tags = obj.tags;
  if (!Array.isArray(tags)) return "no tags array";
  for (const tag of tags) {
    if (typeof tag !== "string" || tag.length < 1)
      return `invalid tag "${tag}" among [${tags}]`;
  }
  const dupTag = findDuplicate(tags);
  if (dupTag) return `duplicate tag "${dupTag}" among [${tags}]`;

  // check obj.images
  const imgs = obj.images;
  if (!Array.isArray(imgs)) return "no images array";
  function checkImage(img) {
    const requireFields = ["name", "filename", "timestamp", "tags", "notes"];
    for (const f of requireFields) {
      if (img[f] === undefined) return `field "${f}" is absent`;
    }
    const dupTag = findDuplicate(img.tags);
    if (dupTag) return `duplicate tag "${dupTag}"`;
    for (const tag of img.tags) {
      if (!tags.includes(tag)) return `unknown tag "${tag}"`;
    }
  }
  for (let i = 0; i < imgs.length; i++) {
    const err = checkImage(imgs[i]);
    if (err) return `images[${i}] is invalid: ${err} in ${JSON.stringify(imgs[i])}`;
  }
}
