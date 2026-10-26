import {process} from './content.mjs';

// Layout follows the nature of the work rather than the position in the catalog.
export const serviceLayouts = {
  accounting:'ledger', management:'metrics', horeca:'editorial', people:'team',
  marketing:'campaign', legal:'document', it:'systems',
  'vosstanovlenie-ucheta':'journey', tax:'analysis', marketplace:'systems',
  medical:'team', food:'editorial', 'biznes-klining':'analysis',
  'razovye-uslugi':'focus', 'vnedrenie-1c':'systems', 'sites-bots':'campaign',
  'registraciya-ip':'journey', 'registraciya-ooo':'document',
  'zakrytie-ip':'focus', 'likvidaciya-ooo':'journey', 'deklaraciya-3-ndfl':'document'
};
const motion = {editorial:'left',team:'up',campaign:'zoom',document:'wipe',systems:'right',journey:'left',analysis:'soft',focus:'up',ledger:'up',metrics:'wipe'};
const n = i => String(i+1).padStart(2,'0');
const content = (body,esc) => Array.isArray(body)?`<ul>${body.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:`<p>${esc(body)}</p>`;
const profile = {
  editorial:{hero:'Рабочие процессы.<br>Понятная экономика.',scope:'Разбираем работу<br>по направлениям',intro:'Смотрим на повседневные процессы и связываем их с учетом и финансовым результатом.',result:'Система, на которую<br>можно опереться'},
  team:{hero:'Люди. Роли.<br>Согласованная работа.',scope:'Организуем работу<br>без разрозненных задач',intro:'Соединяем структуру, обязанности и документы в понятный порядок работы.',result:'Понятные процессы.<br>Распределенная ответственность.'},
  campaign:{hero:'От стратегии<br>к действиям.',scope:'Собираем план<br>из нужных направлений',intro:'Определяем приоритеты и соединяем аналитику, коммуникации и конкретные действия.',result:'Ваша стратегия<br>обретает форму'},
  document:{hero:'Внимание к деталям.<br>Ясность в решениях.',scope:'Каждый вопрос —<br>в своем разделе',intro:'Откройте направление, чтобы посмотреть состав работы. Объем сопровождения согласуем под вашу ситуацию.',result:'Основа для<br>следующего решения'},
  systems:{hero:'Связываем процессы<br>и инструменты.',scope:'Отдельные задачи.<br>Общая система.',intro:'Разбираем источники данных, рабочие инструменты и взаимодействие между ними.',result:'Меньше разрозненности.<br>Больше управляемости.'},
  journey:{hero:'Понятный маршрут<br>для вашей задачи.',scope:'Проходим задачу<br>последовательно',intro:'Определяем исходную ситуацию, состав работ и следующие действия. Порядок этапов уточняем после знакомства с задачей.',result:'Понятный результат.<br>Следующие шаги.'},
  analysis:{hero:'Сначала разобраться.<br>Затем действовать.',scope:'От анализа ситуации<br>к рекомендациям',intro:'Рассматриваем задачу с разных сторон, выявляем проблемные участки и определяем возможные решения.',result:'Целая картина<br>для ваших решений'},
  focus:{hero:'Начнем с того,<br>что важно сейчас.',scope:'Выберите вопрос,<br>который нужно решить',intro:'Можно начать с конкретной задачи. Определим необходимый объем работы и подготовим понятный план.',result:'Конкретная задача.<br>Понятный результат.'}
};

function visual(s,layout,esc){
  if(s.id==='sites-bots')return '<div class="digital-studio"><div class="studio-browser"><div class="studio-toolbar"><span></span><span></span><span></span><b>Сайт вашего бизнеса</b></div><div class="studio-screen"><strong>Понятный сайт.<br>Удобный сервис.</strong><div class="studio-lines"><i></i><i></i></div><a class="studio-action" href="#request">Обсудить задачу ↗</a></div></div><div class="studio-chat"><span>Чат-бот</span><p>Здравствуйте! Чем можем помочь?</p><p>Хочу узнать об услугах</p><div>Заявка · Запись · Поддержка</div></div></div>';
  if(s.id==='vnedrenie-1c')return '<div class="one-c-workspace"><div class="one-c-mark">1С</div><p>Разработка<br>и сопровождение</p><ul><li>Доработки под ваши процессы</li><li>Обмен данными и интеграции</li><li>Поддержка пользователей</li></ul><a class="text-link" href="sozdanie-saytov-i-botov.html">Нужен сайт или бот? ⟶</a></div>';
  if(s.id==='horeca')return '<div class="horeca-typographic-art"><img src="assets/horeca-typographic-v1.png" width="1024" height="1024" alt="" fetchpriority="high"></div>';
  if(s.id==='marketing')return '<div class="marketing-isometric-art"><img src="assets/marketing-isometric-v1.png" width="1254" height="1254" alt="Мегафон, план публикаций и цель — продвижение и коммуникации" fetchpriority="high"></div>';
  if(s.id==='it')return '<div class="it-workspace-art"><img src="assets/it-workspace-v1.png" width="1254" height="1254" alt="Цифровая инфраструктура бизнеса" fetchpriority="high"><ul class="it-directions" aria-label="Отдельные IT-услуги"><li><a href="sozdanie-saytov-i-botov.html">Сайты и чат-боты ↗</a></li><li>Системное администрирование</li><li><a href="vnedrenie-1c.html">Разработка и сопровождение 1С ↗</a></li></ul></div>';
  const titles=s.heroTopics||s.features.slice(0,3).map(([title])=>title);
  if(layout==='systems')return `<div class="system-map" aria-label="Направления работы"><div class="system-hub">${esc(s.id==='it'?'Ваш бизнес':s.title)}</div><div class="system-nodes">${titles.map((title,i)=>`<div><span>${n(i)}</span>${esc(title)}</div>`).join('')}</div></div>`;
  if(layout==='document')return `<div class="hero-dossier"><span class="dossier-tab">${esc(s.category)}</span><div class="dossier-title">В деталях<br>всё имеет значение</div>${titles.map((title,i)=>`<div class="dossier-line"><span>${n(i)}</span>${esc(title)}<i aria-hidden="true">✓</i></div>`).join('')}</div>`;
  if(layout==='team')return `<div class="team-map"><span class="team-map-center">${esc(s.id==='people'?'Команда':'Организация')}</span>${titles.map((title,i)=>`<div class="team-node team-node-${i+1}"><span>${n(i)}</span>${esc(title)}</div>`).join('')}</div>`;
  return `<div class="hero-index"><span class="hero-index-label">${esc(s.category)}</span><span class="hero-index-mark" aria-hidden="true">${layout==='editorial'?'↗':layout==='journey'?'→':layout==='analysis'?'∑':'+'}</span><strong>${profile[layout].hero}</strong><div class="hero-index-topics">${titles.map(title=>`<span>${esc(title)}</span>`).join('')}</div></div>`;
}

function serviceHero(s,layout,esc){
  return `<section class="service-hero service-hero-${layout} wide"><div class="container"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><a href="uslugi.html">Услуги</a><span aria-hidden="true">/</span><span>${esc(s.title)}</span></nav><div class="service-hero-grid"><div class="service-hero-copy"><div class="eyebrow">${esc(s.category)}</div><h1>${esc(s.title)}<span class="blue-dot">.</span></h1><p>${esc(s.lead)}</p><a class="button" href="#request">Обсудить задачу <span aria-hidden="true">↗</span></a></div>${visual(s,layout,esc)}</div></div></section>`;
}

function situation(s,layout,esc,heading){
  const entries=s.needs.map((text,i)=>`<article class="situation-item" data-reveal="${i%2?'right':motion[layout]}"><span>${n(i)}</span><p>${esc(text)}</p></article>`).join('');
  return `<section class="section container situation situation-${layout}"><div class="situation-heading">${heading('ВАША СИТУАЦИЯ',layout==='focus'?'Что нужно<br>решить сейчас?':'Узнаете<br>свою ситуацию?',s.hideSituationIntro?'':s.intro||'Начнем с вашей ситуации и согласуем конкретный объем работы.')}</div><div class="situation-list">${entries}</div></section>`;
}

function scope(s,layout,esc,heading){
  const p=profile[layout];
  const head=heading('СОСТАВ РАБОТЫ',s.scopeTitle||p.scope,s.scopeIntro||p.intro);
  let blocks;
  if(layout==='document'||layout==='focus'){
    blocks=`<div class="scope-disclosures">${s.features.map(([title,body],i)=>`<details class="scope-disclosure"${i===0?' open':''} data-reveal="${motion[layout]}"><summary><span class="scope-order">${n(i)}</span><h3>${esc(title)}</h3><span class="scope-plus" aria-hidden="true">+</span></summary><div class="scope-disclosure-body">${content(body,esc)}</div></details>`).join('')}</div>`;
  }else{
    blocks=`<div class="scope-layout scope-${layout}">${s.features.map(([title,body],i)=>`<article class="scope-item" data-reveal="${layout==='analysis'?(i%2?'right':'left'):motion[layout]}"><span class="scope-order">${n(i)}</span><div class="scope-item-copy"><h3>${esc(title)}</h3>${content(body,esc)}</div>${layout==='journey'?'<span class="journey-marker" aria-hidden="true"></span>':''}</article>`).join('')}</div>`;
  }
  return `<section class="service-scope service-scope-${layout}" id="scope"><div class="section container">${head}${blocks}</div></section>`;
}

export function serviceProcess(layout,{esc,heading}){
  const row=['journey','document','ledger','focus'].includes(layout);
  const shell=row?'route':'track';
  return `<section class="service-process service-process-${layout} container section">${heading('ПУТЬ К РЕЗУЛЬТАТУ','Как строится работа','Согласуем задачу и объем участия, затем помогаем с внедрением и сопровождением.')}<div class="process-${shell}">${process.map(([title,body],i)=>`<article class="process-point" data-reveal="${layout==='metrics'?'wipe':row?'left':'up'}"><span class="process-index">${n(i)}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></article>`).join('')}</div><a class="text-link" href="kak-my-rabotaem.html">Подробнее о нашем подходе <span aria-hidden="true">⟶</span></a></section>`;
}

function result(s,layout,esc){
  return `<section class="service-outcome service-outcome-${layout} wide" id="result"><div class="container" data-reveal="${layout==='campaign'?'zoom':'soft'}"><div><div class="eyebrow">ВАШ РЕЗУЛЬТАТ</div><h2>${s.resultTitle||profile[layout].result}</h2></div><div class="outcome-copy"><p>${esc(s.result)}</p><a class="text-link" href="#request">Расскажите о вашей задаче <span aria-hidden="true">⟶</span></a></div></div></section>`;
}

export function servicePage(s,{esc,heading,catalogCard,byId}){
  const layout=serviceLayouts[s.id];
  if(!profile[layout])throw Error('Missing service layout: '+s.id);
  const questions=[...s.questions,['Как определяется стоимость и формат работы?','Они зависят от объема задачи, состояния исходных данных и глубины сопровождения. После обсуждения согласуем разовую работу, проект или регулярную поддержку.']];
  const faq=`<section class="section container faq-section">${heading('ВОПРОСЫ И ОТВЕТЫ','Перед началом работы')}<div class="faq-list">${questions.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
  const subnav=`<nav class="page-subnav container" aria-label="На этой странице"><a href="#scope">Что входит в работу</a><a href="#result">Ваш результат</a><a href="ceny.html">Стоимость и форматы ↗</a><a href="#request">Оформить заявку</a></nav>`;
  const sections=[scope(s,layout,esc,heading),result(s,layout,esc),serviceProcess(layout,{esc,heading})];
  // Journey pages explain the route first, while analytical pages lead with the expected output.
  const order=layout==='journey'?[2,0,1]:layout==='analysis'?[1,0,2]:[0,1,2];
  return serviceHero(s,layout,esc)+subnav+situation(s,layout,esc,heading)+order.map(i=>sections[i]).join('')+faq;
}
