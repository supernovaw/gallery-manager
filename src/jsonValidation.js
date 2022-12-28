function findDuplicate(array) {
  const sorted = [...array].sort();
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] == sorted[i]) return sorted[i - 1];
  }
  return false;
}

function hasCircularDependency(dependenciesMap, tag, visited = new Set()) {
  visited.add(tag);
  if (!dependenciesMap[tag] || !dependenciesMap[tag].length) return false;

  for (const dependency of dependenciesMap[tag]) {
    if (visited.has(dependency)) return true;
    if (hasCircularDependency(dependenciesMap, dependency, visited)) return true;
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
  let dupTag = findDuplicate(tags);
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

  // check obj.inferredTags
  const inferredTags = obj.inferredTags;
  if (typeof inferredTags !== "object") return "no inferredTags";
  dupTag = findDuplicate(Object.keys(inferredTags));
  if (dupTag) return `duplicate key tag "${dupTag}" in inferredTags`;

  for (const key of Object.keys(inferredTags)) {
    if (typeof key !== "string" || key.length < 1)
      return `key that is not string of len>0 in inferredTags: ${JSON.stringify(obj.inferredTags)}`;

    if (!tags.includes(key))
      return `unknown key tag in inferredTags: "${key}"`;

    const value = inferredTags[key];
    if (!Array.isArray(value)) return `inferredTags["${key}"] is not an array`;
    const dupTag = findDuplicate(value);
    if (dupTag) return `duplicate tag "${dupTag}" in inferredTags["${key}"]`;

    for (const t of value) {
      if (typeof t !== "string" || t.length < 1)
        return `inferredTags["${key}"] has an invalid value "${t}"`;

      if (!tags.includes(t))
        return `inferredTags["${key}"] has an unknown tag "${t}"`;
    }
  }
  for (const tag of Object.keys(inferredTags)) {
    if (hasCircularDependency(inferredTags, tag))
      return `found a circular dependency (starting from "${tag}") in inferredTags`;
  }
}
