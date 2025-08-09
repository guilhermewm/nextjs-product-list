require("@testing-library/jest-dom");
require("whatwg-fetch");

// Polyfills/mocks for Ant Design and rc-* libs under jsdom
if (!("matchMedia" in window)) {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = elt => {
  try {
    return originalGetComputedStyle(elt);
  } catch {
    return {
      getPropertyValue: () => "",
      overflowY: "scroll",
    };
  }
};
