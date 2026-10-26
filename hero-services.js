function initializeServiceCarousel() {
  const carousel = document.querySelector('.hero-service-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.hero-service-track');
  const stage = carousel.querySelector('.hero-service-stage');
  const slides = [...track.children];
  const more = carousel.querySelector('.hero-service-more');
  const hero = carousel.closest('.home-hero-services');
  const description = hero?.querySelector('.hero-service-description');
  const order = hero?.querySelector('.hero-service-order');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 1200, duration = 500, offset = 2;
  let current = 0, timer = 0, finishTimer = 0, visible = true, hovering = false, focused = false;
  let moving = false, ordering = false, orderFocused = false;
  function clone(slide) {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden','true'); copy.inert = true;
    copy.classList.remove('is-current'); return copy;
  }
  // Matching neighbours keep both faded edges seamless when the list wraps.
  track.prepend(clone(slides.at(-2)),clone(slides.at(-1)));
  track.append(clone(slides[0]),clone(slides[1]));
  const rows = [...track.children];
  function stop() { clearTimeout(timer);timer = 0;carousel.dataset.running = 'false'; }
  function schedule() {
    stop();
    if (reduced.matches || hovering || focused || ordering || orderFocused || moving || !visible || document.hidden) return;
    carousel.dataset.running = 'true'; timer = setTimeout(()=>select(current+1),interval);
  }
  function position(index,animated) {
    track.style.transition = animated && !reduced.matches ? '' : 'none';
    const y = (stage.clientHeight-slides[0].offsetHeight)/2-index*slides[0].offsetHeight;
    track.style.transform = `translateY(${y}px)`;
  }
  function highlight(index) { rows.forEach((row,i)=>row.classList.toggle('is-current',i === index)); }
  function updateLinks() {
    slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i !== current));slide.inert = i !== current;});
    if (more) {
      more.href = slides[current].querySelector('a').getAttribute('href');
      more.setAttribute('aria-label',`Об услуге: ${slides[current].dataset.serviceName}`);
    }
    if (hero) hero.dataset.serviceIndex = String(current);
    if (description) {
      description.textContent = slides[current].dataset.serviceDescription;
      if (!reduced.matches && typeof description.animate === 'function') {
        description.getAnimations().forEach(animation=>animation.cancel());
        description.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});
      }
    }
  }
  function select(index) {
    if (moving) return;
    const previous = current, next = (index+slides.length)%slides.length;
    if (next === current) { schedule();return; }
    let destination = next+offset;
    if (previous === slides.length-1 && index === previous+1) destination = slides.length+offset;
    current = next; moving = true; stop(); updateLinks(); highlight(destination); position(destination,true);
    finishTimer = setTimeout(()=>{
      moving = false;
      if (destination !== current+offset) { position(current+offset,false);highlight(current+offset); }
      schedule();
    },reduced.matches ? 0 : duration);
  }
  function resize() {
    clearTimeout(finishTimer); moving = false;
    position(current+offset,false);highlight(current+offset);schedule();
  }
  carousel.addEventListener('pointerenter',event=>{if(event.pointerType !== 'touch'){hovering = true;schedule();}});
  carousel.addEventListener('pointerleave',()=>{hovering = false;schedule();});
  carousel.addEventListener('focusin',()=>{focused = true;schedule();});
  carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused = false;schedule();}});
  if (order) {
    // Keep the chosen direction steady while a visitor reaches for the order button.
    order.addEventListener('pointerenter',event=>{if(event.pointerType !== 'touch'){ordering = true;schedule();}});
    order.addEventListener('pointerleave',()=>{ordering = false;schedule();});
    order.addEventListener('focusin',()=>{orderFocused = true;schedule();});
    order.addEventListener('focusout',()=>{orderFocused = false;schedule();});
    order.addEventListener('click',()=>{
      const message = document.querySelector('#message');
      if (!message) return;
      const previous = message.value.replace(/^Услуга: [^\n]*\n?/gm, '');
      message.value = `Услуга: ${slides[current].dataset.serviceName}\n${previous}`;
    });
  }
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',resize);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>{visible = entries[0].isIntersecting;schedule();},{threshold:0});observer.observe(carousel);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  if (hero) {
    let artVisible = true;
    const updateArt = ()=>{hero.dataset.artRunning = String(artVisible && !document.hidden);};
    document.addEventListener('visibilitychange',updateArt);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries=>{artVisible = entries[0].isIntersecting;updateArt();},{threshold:0}).observe(hero);
    }
    updateArt();
  }
  window.addEventListener('resize',resize,{passive:true});
  updateLinks();resize();
}

if (document.readyState !== 'loading') initializeServiceCarousel();
else document.addEventListener('DOMContentLoaded',initializeServiceCarousel,{once:true});
