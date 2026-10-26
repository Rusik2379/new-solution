export function companyHero(title,lead,category,{esc,core}){
 const kind={'КАТАЛОГ УСЛУГ':'catalog','О КОМПАНИИ':'about','НАШ ПОДХОД':'work','СТОИМОСТЬ':'prices','МЫ НА СВЯЗИ':'contacts'}[category];
 if(!kind)throw Error('Missing company cover: '+category);
 const art={
  catalog:`<nav class="cover-catalog" aria-label="Основные направления">${core.map((s,i)=>`<a href="${s.path}"><span>0${i+1}</span>${esc(s.title)}<i aria-hidden="true">↗</i></a>`).join('')}</nav>`,
  about:'<div class="company-brand-composition" aria-hidden="true"><img src="assets/glass-quarter-finance-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-process-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-people-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-growth-v2.webp" alt="" width="384" height="384"></div>',
  work:`<div class="cover-route">${['Задача','Решение','Внедрение','Сопровождение'].map((label,i)=>`<div><span>0${i+1}</span><strong>${label}</strong></div>`).join('')}</div>`,
  prices:'<div class="cover-formats"><span>Под вашу ситуацию</span><strong>Задача.<br>Проект.<br>Сопровождение.</strong><p>Определим объем.<br>Согласуем стоимость.</p></div>',
  contacts:'<div class="cover-contact"><span>МЫ НА СВЯЗИ</span><a href="tel:+79628184499">+7 (962)<br>818-44-99 <i aria-hidden="true">↗</i></a><a href="mailto:t.zorina@nr-com.ru">t.zorina@nr-com.ru</a><p>Барнаул, ул. Ярных, 6</p></div>'
 }[kind];
 return `<section class="company-cover company-cover-${kind} wide"><div class="container"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><span>${esc(category.charAt(0)+category.slice(1).toLocaleLowerCase('ru'))}</span></nav><div class="company-cover-grid"><div class="company-cover-copy"><div class="eyebrow">${esc(category)}</div><h1>${esc(title)}<span class="blue-dot">.</span></h1><p>${esc(lead)}</p><a class="button" href="#${kind==='catalog'?'catalog':'request'}">${kind==='catalog'?'Подобрать услугу':'Обсудить задачу'} <span aria-hidden="true">↗</span></a></div>${art}</div></div></section>`;
}
