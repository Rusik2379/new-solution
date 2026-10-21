// Keep the ring available as a complete alternative to the four rising pillars.
const hero = document.querySelector('.hero-brand-art');
if (hero) {
  const ring = new URLSearchParams(location.search).get('hero') === 'ring';
  hero.dataset.variant = ring ? 'ring' : 'pillars';
  if (ring) {
    await import('./hero-ribbon.js');
    await import('./hero-ribbon-3d.js?v=matte-morph-2');
  } else {
    await import('./hero-pillars.js?v=pillars-1');
  }
}
