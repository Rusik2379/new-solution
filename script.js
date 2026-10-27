const nav = document.querySelector('.main-nav');
const menuButton = document.querySelector('.menu-toggle');
const hoverMenus = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
let dropdownCloseTimer;
const dropdowns = [...document.querySelectorAll('.nav-dropdown')].map(element => {
  const toggle = element.querySelector('.services-toggle');
  return {element, toggle, menu: document.getElementById(toggle.getAttribute('aria-controls'))};
});
function setDropdownOpen(target, open) {
  clearTimeout(dropdownCloseTimer);
  dropdowns.forEach(item => {
    const expanded = item === target && open;
    item.toggle.setAttribute('aria-expanded', String(expanded));
    item.menu.setAttribute('aria-hidden', String(!expanded));
    item.menu.inert = !expanded;
    item.element.classList.toggle('expanded', expanded);
  });
  document.body.classList.toggle('services-open', Boolean(target && open));
}
dropdowns.forEach(item => {
  item.toggle.addEventListener('click', event => {
    const open = hoverMenus.matches && event.detail > 0 ? true : item.toggle.getAttribute('aria-expanded') !== 'true';
    setDropdownOpen(item, open);
  });
  item.element.addEventListener('pointerenter', event => {
    if (hoverMenus.matches && event.pointerType !== 'touch') setDropdownOpen(item, true);
  });
  item.element.addEventListener('pointerleave', () => {
    if (!hoverMenus.matches) return;
    clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = setTimeout(() => {
      if (!item.element.matches(':hover') && item.element.classList.contains('expanded')) setDropdownOpen(null, false);
    }, 180);
  });
  item.element.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!item.element.contains(document.activeElement) && !(hoverMenus.matches && item.element.matches(':hover')) && item.element.classList.contains('expanded')) setDropdownOpen(null, false);
    }, 0);
  });
});
document.querySelector('.nav-backdrop').addEventListener('click', closeMenu);
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('open', open);
  if (open) nav.scrollTop = 0;
  if (!open) setDropdownOpen(null, false);
});
function closeMenu() {
  setDropdownOpen(null, false);
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
document.querySelectorAll('.header a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const expanded = dropdowns.find(item => item.element.classList.contains('expanded'));
  if (expanded) {
    setDropdownOpen(null, false);
    expanded.toggle.focus();
  } else if (nav.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
const mobileBreakpoint = matchMedia('(max-width: 760px)');
mobileBreakpoint.addEventListener('change', closeMenu);

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
function goToRequest() {
  document.querySelector('#request').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}
function requestMessageForService(previous,service) {
  const message=previous.replace(/^Услуга: [^\n]*\n?/gm, '');
  return `Услуга: ${service}\n${message}`;
}
document.querySelectorAll('[data-request-service]').forEach(button=>{
  button.addEventListener('click',()=>{
    const message=document.querySelector('#message');
    message.value=requestMessageForService(message.value,button.dataset.requestService);
    goToRequest();
  });
});
document.querySelectorAll('[data-format]').forEach(button => {
  button.addEventListener('click', () => {
    const message = document.querySelector('#message');
    const previous = message.value.replace(/^Формат работы: [^\n]*\n?/gm, '');
    message.value = `Формат работы: ${button.dataset.format}\n${previous}`;
    goToRequest();
  });
});
document.querySelectorAll('.policy-trigger').forEach(button => {
  button.addEventListener('click', () => document.querySelector('#policy-dialog').showModal());
});

const form = document.querySelector('#request-form');
const phone = form.elements.phone;
phone.addEventListener('input', () => phone.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (phone.value.replace(/\D/g, '').length < 10) {
    phone.setCustomValidity('Введите номер телефона: не менее 10 цифр');
    phone.reportValidity();
    return;
  }
  const data = new FormData(form);
  const body = `Заявка с сайта «Новые решения»\n\nИмя: ${data.get('name')}\nТелефон: ${data.get('phone')}\n\nЗадача:\n${data.get('message') || 'Хочу обсудить задачи моего бизнеса'}`;
  const emailUrl = `mailto:i.korkina@nr-com.ru?subject=${encodeURIComponent('Заявка с сайта «Новые решения»')}&body=${encodeURIComponent(body)}`;
  const link = document.createElement('a');
  link.href = emailUrl;
  link.click();
  const status = document.querySelector('#form-status');
  status.textContent = 'Заявка подготовлена — отправьте письмо из почтового приложения\nЕсли оно не открылось, скопируйте текст и отправьте на i.korkina@nr-com.ru';
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.textContent = 'Скопировать текст заявки';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(body);
      copyButton.textContent = 'Текст скопирован';
    } catch {
      const text = document.createElement('textarea');
      text.value = body;
      text.readOnly = true;
      text.setAttribute('aria-label', 'Текст заявки для копирования');
      status.append(text);
      text.focus();
      text.select();
      copyButton.textContent = 'Выделите и скопируйте текст';
    }
  });
  status.append(copyButton);
});
document.querySelector('#year').textContent = new Date().getFullYear();

// The full catalog is usable without JavaScript; filtering is progressive enhancement.
const searchInput = document.querySelector('#catalog-search');
if (searchInput) {
  document.querySelector('.catalog-tools').hidden = false;
  const cards = [...document.querySelectorAll('.catalog-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  let category = 'all';
  const normalize = text => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  function filterCatalog() {
    const query = normalize(searchInput.value);
    let count = 0;
    cards.forEach(card => {
      const visible = (category === 'all' || card.dataset.category === category) && normalize(card.dataset.search).includes(query);
      card.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector('.catalog-count').textContent = `Найдено услуг: ${count}`;
    document.querySelector('.catalog-empty').hidden = count > 0;
    filters.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; filterCatalog(); }));
  searchInput.addEventListener('input', filterCatalog);
  document.querySelector('#catalog-reset').addEventListener('click', () => { category = 'all'; searchInput.value = ''; filterCatalog(); searchInput.focus(); });
}

// Reveal once, with different directions and a short stagger within card groups.
// Without JS/IntersectionObserver, all content stays visible.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealGroups = [
    ['.section-heading, .process-heading', 'up', false],
    ['.problem-grid .problem', 'up', true],
    ['.problem-caption, .audience-strip', 'soft', false],
    ['.section-tile, .contact-copy', 'left', false],
    ['.about-copy, .request-card', 'right', false],
    ['.team-photo', 'zoom', false],
    ['.approach-stat', 'up', true],
    ['.steps .step', 'up', true],
    ['.services-grid .service-card', 'up', true],
    ['.price-grid .price-card', 'up', true],
    ['.service-feature:not(.management-services .service-feature), .usecase', 'up', true],
    ['.management-services .service-feature', 'wipe', true],
    ['.management-report', 'wipe', true],
    ['.page-result', 'soft', false],
    ['.workflow-item', 'left', true],
    ['.company-photo', 'zoom', false],
    ['.accounting-intro, .accounting-result-inner', 'soft', false],
    ['.accounting-work', 'up', true]
  ];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
  revealGroups.forEach(([selector, effect, stagger]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal', `reveal-${effect}`);
      element.style.setProperty('--reveal-delay', `${stagger ? (index % 4) * 85 : 0}ms`);
      observer.observe(element);
    });
  });
  document.querySelectorAll('[data-reveal]').forEach((element,index) => {
    const effect = element.dataset.reveal;
    if (!['up','left','right','zoom','soft','wipe'].includes(effect)) return;
    element.classList.add('reveal', `reveal-${effect}`);
    element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    observer.observe(element);
  });
  document.documentElement.classList.add('motion-enabled');
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('motion-enabled');
      observer.disconnect();
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
    }
  });
}
