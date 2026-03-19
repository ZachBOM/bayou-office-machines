// Minimal type shim so TypeScript accepts window.google.maps in dispatch page
interface Window {
  google: typeof google;
}
