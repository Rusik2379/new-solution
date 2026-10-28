import {serviceTopics,scopeRows} from './service-sections.mjs';

export function peoplePage(service,{esc,heading}){
  const items=service.features.flatMap(([,body])=>body);
  const chapters=[
    {title:'Штат и затраты',tag:'Структура · численность · ФОТ',start:0,end:3},
    {title:'Загрузка и графики',tag:'Рабочее время · сменность',start:3,end:6},
    {title:'Роли и ответственность',tag:'Функции · взаимодействие · KPI',start:6,end:11},
    {title:'Кадровый учет',tag:'Документы · процедуры · поддержка',start:11,end:16}
  ];
  if(items.length!==16||chapters.flatMap(({start,end})=>items.slice(start,end)).length!==items.length)throw Error('Incomplete personnel scope');
  return `<section class="people-hero wide" aria-labelledby="people-title"><div class="container">
    <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><a href="uslugi.html">Услуги</a><span aria-hidden="true">/</span><span>${esc(service.title)}</span></nav>
    <div class="people-hero-grid"><div class="people-hero-copy"><div class="eyebrow">ОРГАНИЗАЦИЯ КОМАНДЫ И КАДРОВЫЙ КОНСАЛТИНГ</div><h1 id="people-title">Персонал<br>и кадровый учет<span class="blue-dot">.</span></h1><p>${esc(service.lead)}</p><div class="people-hero-actions"><a class="button" href="#request">Обсудить задачу <span aria-hidden="true">↗</span></a><a class="text-link" href="#scope">Что входит в работу <span aria-hidden="true">↓</span></a></div></div>
    <div class="people-hero-art"><img src="assets/people-isometric-v1.png" width="1024" height="1024" alt="" fetchpriority="high"></div></div>
  </div></section>

  ${serviceTopics(chapters.map(chapter=>[chapter.title]))}

  <section class="people-scope" id="scope"><div class="section container">${heading('ЧТО ВХОДИТ В КОНСАЛТИНГ','От штатной структуры<br>до кадровых документов','Разбираем работу с персоналом по четырем направлениям. Необходимый объем участия определяем под вашу задачу.')}
    ${scopeRows(chapters.map(chapter=>[chapter.title,items.slice(chapter.start,chapter.end)]))}
  </div></section>

  <section class="people-result wide" id="result" aria-labelledby="people-result-title"><div class="container"><div class="people-result-heading"><h2 id="people-result-title">Команда работает<br><span>как система.</span></h2><a class="button" href="#request">Обсудим вашу команду <span aria-hidden="true">↗</span></a></div><ul class="people-result-points"><li><h3>Понятные обязанности</h3><p>Оптимальная штатная структура и распределение ответственности</p></li><li><h3>Эффективные графики</h3><p>Загрузка и рабочее время соответствуют задачам бизнеса</p></li><li><h3>Контроль затрат</h3><p>Прозрачные расходы на персонал и фонд оплаты труда</p></li><li><h3>Порядок в документах</h3><p>Системный кадровый учет и актуальные документы</p></li></ul><p class="people-result-summary">Снижаем административную нагрузку на руководителя, повышаем эффективность команды и делаем управление персоналом более прозрачным и контролируемым</p></div></section>

  <section class="section container faq-section">${heading('ВОПРОСЫ И ОТВЕТЫ','Перед началом работы')}<div class="faq-list">${service.questions.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>
  `;
}
