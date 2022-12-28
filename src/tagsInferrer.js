// Returns the list of tags that are automatically inferred based on already
// selected ones (e.g. if it's "landscape", "outside" is inferred).
export default function inferTags(inferredTags, selectedTags) {
  if (inferredTags === undefined) return [];

  let result = [];
  // A separate result accumulator is used because we're doing multiple passes until
  // no more tags are added. The reason for doing is that there can be inferences based
  // on other inferences, and doing 1 pass whould only infer first-order dependencies.
  let resultAccumulator = [];

  const addIfAbsent = (t) => {
    if (!result.includes(t))
      resultAccumulator.push(t);
  };
  const inferredKeyVals = Object.keys(inferredTags).map((key) => [key, inferredTags[key]]);

  // 1st pass - infer tags based on user selection
  selectedTags.forEach((sel) => {
    inferredKeyVals.forEach(([key, addIfAnyPresent]) => {
      if (addIfAnyPresent.includes(sel)) addIfAbsent(key);
    });
  });

  // 2nd and further passes - infer tags based on earlier inferences
  do {
    result = result.concat(resultAccumulator);
    resultAccumulator = [];
    result.forEach((tag) => {
      inferredKeyVals.forEach(([key, addIfAnyPresent]) => {
        if (addIfAnyPresent.includes(tag)) addIfAbsent(key);
      });
    });
  } while (resultAccumulator.length !== 0); // go on until the cycle doesn't add anything

  return result;
}
