export const getZoom = (outer) => {
  const inner = outer.children;
  const x_zoom = outer.getBoundingClientRect().width / inner.offsetWidth;
  const y_zoom = outer.getBoundingClientRect().height / inner.offsetHeight;
  return Math.min(x_zoom, y_zoom);
};
