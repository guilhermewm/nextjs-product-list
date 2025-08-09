import "@testing-library/jest-dom";
import "whatwg-fetch";

// Polyfills/mocks for Ant Design and rc-* libs under jsdom
if (!("matchMedia" in window)) {
  // @ts-expect-error add minimal stub for tests
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

// jsdom throws for getComputedStyle with pseudo elements; provide a tolerant stub
const originalGetComputedStyle = window.getComputedStyle;
// @ts-expect-error override for tests
window.getComputedStyle = (elt: Element) => {
  try {
    return originalGetComputedStyle(elt);
  } catch {
    // Fallback minimal style object
    return {
      getPropertyValue: () => "",
      overflowY: "scroll",
    } as any;
  }
};
