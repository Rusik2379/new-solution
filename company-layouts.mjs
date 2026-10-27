export function companyExpertise(){
 const team=[
  ['Бухгалтеры','Учет, налоги и отчетность'],
  ['Экономисты','Управленческий учет и финансовый анализ'],
  ['Юристы','Договоры и правовая поддержка'],
  ['Маркетологи','Стратегия, продвижение и коммуникации'],
  ['Технологи','Себестоимость, меню и процессы HoReCa'],
  ['Программисты','1С, сайты, чат-боты и автоматизация']
 ];
 return `<section class="section container company-experience" id="expertise" aria-labelledby="expertise-title">
  <div class="company-experience-heading"><h2 id="expertise-title">Разная экспертиза.<br><span>Общая картина бизнеса.</span></h2><p>Смотрим на цифры, людей и процессы вместе. Подключаем нужных специалистов к вашей задаче и работаем на общую цель — чтобы бизнесом было проще управлять.</p></div>
  <ul class="company-specialists" aria-label="Наша команда">${team.map(([role,scope])=>`<li><h3>${role}</h3><p>${scope}</p></li>`).join('')}</ul>
  <div class="company-experience-note"><div><h3>От предпринимателя до холдинга</h3><p>В нашем опыте — работа с индивидуальными предпринимателями с ежемесячной выручкой до 1 млн рублей, крупными компаниями и холдингами с оборотом в десятки миллионов.</p></div><p>Учитываем масштаб, структуру, текущие задачи и цели развития вашей компании.</p></div>
 </section>`;
}

export function companyHero(title,lead,category,{esc,core}){
 const kind={'КАТАЛОГ УСЛУГ':'catalog','О КОМПАНИИ':'about','НАШ ПОДХОД':'work','СТОИМОСТЬ':'prices','МЫ НА СВЯЗИ':'contacts'}[category];
 if(!kind)throw Error('Missing company cover: '+category);
 const art={
  catalog:`<nav class="cover-catalog" aria-label="Основные направления">${core.map((s,i)=>`<a href="${s.path}"><span>0${i+1}</span>${esc(s.title)}<i aria-hidden="true">↗</i></a>`).join('')}</nav>`,
  about:'<div class="company-brand-composition" aria-hidden="true"><img src="assets/glass-quarter-finance-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-process-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-people-v2.webp" alt="" width="384" height="384"><img src="assets/glass-quarter-growth-v2.webp" alt="" width="384" height="384"></div>',
  work:`<div class="cover-route">${['Задача','Решение','Внедрение','Сопровождение'].map((label,i)=>`<div><span>0${i+1}</span><strong>${label}</strong></div>`).join('')}</div>`,
  prices:'<div class="cover-formats"><span>Под вашу ситуацию</span><strong>Задача.<br>Проект.<br>Сопровождение.</strong><p>Определим объем.<br>Согласуем стоимость.</p></div>',
  contacts:'<div class="cover-contact"><span>МЫ НА СВЯЗИ</span><a href="tel:+79628184499">+7 (962)<br>818-44-99 <i aria-hidden="true">↗</i></a><a href="mailto:i.korkina@nr-com.ru">i.korkina@nr-com.ru</a><p>Барнаул, ул. Ярных, 6</p></div>'
 }[kind];
 return `<section class="company-cover company-cover-${kind} wide"><div class="container"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><span>${esc(category.charAt(0)+category.slice(1).toLocaleLowerCase('ru'))}</span></nav><div class="company-cover-grid"><div class="company-cover-copy"><div class="eyebrow">${esc(category)}</div><h1>${esc(title)}<span class="blue-dot">.</span></h1><p>${esc(lead)}</p><a class="button" href="#${kind==='catalog'?'catalog':'request'}">${kind==='catalog'?'Подобрать услугу':'Обсудить задачу'} <span aria-hidden="true">↗</span></a></div>${art}</div></div></section>`;
}
