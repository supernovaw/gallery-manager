import getNewFilterState from "./userFiltering";

let galleryLatest;

let filterVal = {
  imagesToDisplay: undefined, // filtered list of images
  filterFnRaw: "", // function code entered by user
  errorMessage: undefined, // error message when creating Function from user code (if any)
  errorInUserFn: undefined, // error when executing user function (if any)
  warningInUserFn: undefined, // warning if user function returned neither true or false (if any)
};

// setup store according to svelte store contract
const subs = new Set();
const notifySubs = () => subs.forEach(sub => sub(filterVal));

const filter = {
  subscribe: function (sub) {
    subs.add(sub);
    sub(filterVal);
    return () => subs.delete(sub);
  },
  set: function (newVal) {
    if (newVal.filterFnRaw !== filterVal.filterFnRaw) {
      filterVal = getNewFilterState(newVal.filterFnRaw, galleryLatest);
    } else {
      filterVal = newVal;
    }
    notifySubs();
  },
  update: function (updater) {
    this.set(updater(filterVal));
  }
};

// we can't directly import { gallery } from "./state" because "./state" imports "./filterState",
// so we're relying on ./state.js to subscribe us to gallery changes
export function gallerySubscriber(newValue) {
  galleryLatest = newValue;
  filterVal = getNewFilterState(filterVal.filterFnRaw, galleryLatest);
  notifySubs();
}
export default filter;
