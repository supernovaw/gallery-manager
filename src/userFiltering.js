import inferTags from "./tagsInferrer";

const userFunctionArgNames = ["i", "it"]; // image and inferred tags
function getArgsForUserFunction(img, gallery) {
  const inferredTags = [
    ...img.tags,
    ...inferTags(gallery.inferredTags, img.tags)
  ];
  return [
    img, // "i"
    t => inferredTags.includes(t), // "it"
  ];
}

export default function getNewFilterState(filterFnRaw, gallery) {
  if (!filterFnRaw) {
    return { imagesToDisplay: gallery.images, filterFnRaw };
  }

  let userFn, errorInUserFn = null, warningInUserFn = null;
  try {
    userFn = Function(...userFunctionArgNames, filterFnRaw);
  } catch (e) {
    return { imagesToDisplay: [], errorMessage: e.message, filterFnRaw };
  }

  function finalFilterFn(img) {
    if (errorInUserFn) return false; // if the user function threw once, don't bother filtering further
    const args = getArgsForUserFunction(img, gallery);
    let fnResult;
    try {
      fnResult = userFn(...args);
    } catch (e) {
      errorInUserFn = e;
      return false;
    }
    if (fnResult !== false && fnResult !== true) {
      warningInUserFn ||= `Function returned neither true or false (${typeof fnResult}) for ${img.name}`;
    }
    return fnResult;
  }
  const filteredImages = gallery.images.filter(finalFilterFn);
  return { imagesToDisplay: filteredImages, errorInUserFn, warningInUserFn, filterFnRaw };
}
