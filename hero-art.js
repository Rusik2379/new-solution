// The service carousel is the default; both sculptures remain available by URL.
const hero = document.querySelector('.home-hero');
if (hero) {
  const variant = new URLSearchParams(location.search).get('hero');
  if (variant === 'ring' || variant === 'pillars') {
    const template = document.querySelector('#hero-sculpture-template');
    hero.replaceChildren(template.content.cloneNode(true));
    hero.classList.remove('home-hero-services');
    hero.querySelector('.hero-brand-art').dataset.variant = variant;
  }
  if (variant === 'ring') {
    await import('./hero-ribbon.js');
    await import('./hero-ribbon-3d.js?v=matte-morph-2');
  } else if (variant === 'pillars') {
    await import('./hero-pillars.js?v=pillars-1');
  } else {
    await import('./hero-services.js?v=services-2');
  }
}
