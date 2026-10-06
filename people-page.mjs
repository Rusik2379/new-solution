import {serviceProcess} from './service-layouts.mjs';

export function peoplePage(service,{esc,heading,catalogCard,byId}){
  const items=service.features.flatMap(([,body])=>body);
  const chapters=[
    {title:'Штат и затраты',tag:'Структура · численность · ФОТ',start:0,end:3},
    {title:'Загрузка и графики',tag:'Рабочее время · сменность',start:3,end:6},
    {title:'Роли и ответственность',tag:'Функции · взаимодействие · KPI',start:6,end:11},
    {title:'Кадровый учет',tag:'Документы · процедуры · поддержка',start:11,end:16}
  ];
  if(items.length!==16||chapters.flatMap(({start,end})=>items.slice(start,end)).length!==items.length)throw Error('Incomplete personnel scope');
  const number=i=>String(i+1).padStart(2,'0');
  return `<section class="people-hero wide" aria-labelledby="people-title"><div class="container">
    <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><a href="uslugi.html">Услуги</a><span aria-hidden="true">/</span><span>${esc(service.title)}</span></nav>
    <div class="people-hero-grid"><div class="people-hero-copy"><div class="eyebrow">ОРГАНИЗАЦИЯ КОМАНДЫ И КАДРОВЫЙ КОНСАЛТИНГ</div><h1 id="people-title">Персонал<br>и кадровый учет<span class="blue-dot">.</span></h1><p>${esc(service.lead)}</p><div class="people-hero-actions"><a class="button" href="#request">Обсудить задачу <span aria-hidden="true">↗</span></a><a class="text-link" href="#scope">Что входит в работу <span aria-hidden="true">↓</span></a></div></div>
    <div class="people-hero-art"><img src="assets/people-isometric-v1.png" width="1024" height="1024" alt="" fetchpriority="high"></div></div>
    <nav class="people-topics" aria-label="Направления кадрового консалтинга">${chapters.map((chapter,i)=>`<a href="#people-work-${i+1}"><span>${number(i)}</span><strong>${chapter.title}</strong><i aria-hidden="true">↗</i></a>`).join('')}</nav>
  </div></section>

  <section class="section container people-intro"><div data-reveal="left"><div class="eyebrow">СИСТЕМНАЯ РАБОТА С ПЕРСОНАЛОМ</div><h2>Организация команды.<br>Оптимизация штата.<br><span class="muted">Порядок в кадрах.</span></h2></div><div class="people-intro-copy" data-reveal="right"><p>${esc(service.intro)}</p></div></section>

  <section class="container people-signals" aria-labelledby="people-signals-title"><h2 id="people-signals-title">Когда стоит пересмотреть систему?</h2><div>${service.needs.map((text,i)=>`<p data-reveal="up"><span>${number(i)}</span>${esc(text)}</p>`).join('')}</div></section>

  <section class="people-scope" id="scope"><div class="section container">${heading('ЧТО ВХОДИТ В КОНСАЛТИНГ','От штатной структуры<br>до кадровых документов','Разбираем работу с персоналом по четырем направлениям. Необходимый объем участия определяем под вашу задачу.')}
    <div class="people-chapters">${chapters.map((chapter,i)=>`<article class="people-chapter" id="people-work-${i+1}" data-reveal="${i===3?'wipe':i%2?'right':'left'}"><span class="people-chapter-number">${number(i)}</span><div class="people-chapter-heading"><h3>${chapter.title}</h3><p>${chapter.tag}</p></div><ul>${items.slice(chapter.start,chapter.end).map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div>
  </div></section>

  <section class="people-result wide" id="result"><div class="container"><div data-reveal="left"><div class="eyebrow">РЕЗУЛЬТАТ ДЛЯ РУКОВОДИТЕЛЯ</div><h2>Команда работает<br><span>как система.</span></h2><div class="people-result-tags"><span>Понятные обязанности</span><span>Эффективные графики</span><span>Контроль ФОТ</span><span>Документы в порядке</span></div></div><div class="people-result-copy" data-reveal="right"><p>${esc(service.result)}</p><a class="button" href="#request">Обсудим вашу команду <span aria-hidden="true">↗</span></a></div></div></section>

  ${serviceProcess('team',{esc,heading})}
  <section class="section container faq-section">${heading('ВОПРОСЫ И ОТВЕТЫ','Перед началом работы')}<div class="faq-list">${service.questions.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>
  <section class="section container related-section">${heading('СВЯЗАННЫЕ ЗАДАЧИ','Поддержка для вашей команды')}<div class="related-grid">${service.related.map(id=>catalogCard(byId[id])).join('')}</div></section>`;
}
