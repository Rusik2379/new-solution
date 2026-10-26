import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {core,additional,process} from './content.mjs';
import {accountingPage} from './accounting-page.mjs';
import {managementPage} from './management-page.mjs';
import {serviceLayouts,servicePage,serviceProcess} from './service-layouts.mjs';
import {companyHero} from './company-layouts.mjs';
import {peoplePage} from './people-page.mjs';
import {applyEditorialChanges,cleanCopyHTML} from './editorial.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const lines = (await readFile('content/word-source.txt','utf8')).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
for (const [i,s] of core.entries()) {
  const start=lines.indexOf(s.heading), end=i+1<core.length?lines.indexOf(core[i+1].heading):lines.length;
  if(start<0||end<=start) throw Error(`Missing Word section ${s.heading}`);
  const section=lines.slice(start+1,end), marker=section.findIndex(x=>/^(Что входит|Мы предлагаем|Основные направления)/.test(x));
  const tail=section.findIndex((x,j)=>j>marker&&/^(Вы получаете|В результате|Собственник получает)/.test(x));
  if(marker<0||tail<0) throw Error(`Invalid Word structure ${s.heading}`);
  s.lead=section[0]; s.intro=section.slice(1,marker).join(' ');
  s.result=section.slice(tail).join(' ').replace(/\.(?=[А-Я])/g,'. ');
  const items=section.slice(marker+1,tail).map(x=>x.replace(/[;.]\s*$/,'').replace(/^(.)/,c=>c.toUpperCase()));
  s.features=s.groups.map(([title,a,b])=>[title,items.slice(a,b)]);
  if(s.groups.flatMap(([,a,b])=>items.slice(a,b)).length!==items.length) throw Error(`Incomplete scope ${s.id}: ${items.length}`);
}
applyEditorialChanges(core);
// Web development has its own service; retain the original Word scope there.
const infrastructure=core.find(service=>service.id==='it');
const webDevelopment=additional.find(service=>service.id==='sites-bots');
const webScope=infrastructure.features.find(([title])=>title==='Сайты и чат-боты')[1];
infrastructure.features=infrastructure.features.filter(([title])=>title!=='Сайты и чат-боты');
infrastructure.lead='Организуем IT-инфраструктуру, системное администрирование и интеграции. Настраиваем рабочие системы, помогаем сократить ручные операции и поддерживать стабильную работу команды.';
infrastructure.questions[1]=['Как заказать сайт, чат-бота или доработку 1С?','Создание сайтов и чат-ботов и разработка и сопровождение 1С — отдельные услуги. Их можно заказать самостоятельно или объединить с задачами инфраструктуры и интеграций.'];
webDevelopment.features=[webDevelopment.features[0],['Разработка сайтов',webScope.slice(0,2)],['Создание чат-ботов',webScope.slice(3)],['Доработки и сопровождение',[webScope[2]]],webDevelopment.features[4],webDevelopment.features[5]];
const services=[...core,...additional];
const byId=Object.fromEntries(services.map(s=>[s.id,s]));
const home=await readFile('index.html','utf8');
/* The homepage is the source for shared chrome; rebuilding never rewrites it. */
const header=home.match(/<header[\s\S]*?<\/header>/)[0].replace(/href="#([^"]+)" data-home-section="([^"]+)"/g,(_,hash,section)=>`href="index.html#${hash}" data-home-section="${section}"`)+'<div class="nav-backdrop" aria-hidden="true"></div>';
const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0];
const sectionById=id=>{const match=home.match(new RegExp('<section\\b[^>]*\\bid="'+id+'"[\\s\\S]*?<\\/section>'));if(!match)throw Error('Missing shared section '+id);return match[0];};
const contact=sectionById('contacts');
const policy=home.match(/<dialog id="policy-dialog"[\s\S]*?<\/dialog>/)[0];
const prices=sectionById('prices');
const icons=Object.fromEntries(core.map(s=>[s.id,home.match(new RegExp(`href="${s.path}"[^>]*><div class="service-top">[\\s\\S]*?(<svg[\\s\\S]*?<\\/svg>)`))?.[1]||'<span class="art-symbol" aria-hidden="true">↗</span>']));
const relative=(html,base)=>html.replace(/(href|src)="(?!#|https?:|mailto:|tel:)([^"]+)"/g,(_,attr,url)=>`${attr}="${base}${url}"`);
function hero(title,lead,category='НОВЫЕ РЕШЕНИЯ',icon='',sub='Одна команда для ваших задач') {
 return companyHero(title.replace(/\.$/,''),lead,category,{esc,core});
}
const heading=(n,title,desc='')=>`<div class="section-heading"><div><div class="eyebrow">${n}</div><h2>${title}</h2></div>${desc?`<p class="section-intro">${esc(desc)}</p>`:''}</div>`;
const featureCards=features=>`<div class="feature-grid">${features.map(([title,body],i)=>`<article class="service-feature"><span class="feature-number">${String(i+1).padStart(2,'0')} <i aria-hidden="true">↗</i></span><h3>${esc(title)}</h3>${Array.isArray(body)?`<ul>${body.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(body)}</p>`}</article>`).join('')}</div>`;
const processBlock=()=>serviceProcess('document',{esc,heading});
function catalogCard(s,i=0){return `<a class="catalog-card" href="${s.path}" data-category="${esc(s.category)}" data-search="${esc((s.title+' '+s.lead).toLocaleLowerCase('ru'))}"><div class="catalog-card-top"><span>${esc(s.category)}</span><i aria-hidden="true">↗</i></div><h3>${esc(s.title)}</h3><p>${esc(s.heading?s.tag:s.lead)}</p><span class="catalog-card-bottom">Подробнее об услуге <span aria-hidden="true">⟶</span></span></a>`;}
async function page(file,title,lead,body,selected=''){
 const base=file.includes('/')?'../':'';
 let contacts=contact;
 if(selected)contacts=contacts.replace('С чего начнем?','Обсудим вашу задачу');
 let h=header.replace(new RegExp(`href="${file.replaceAll('.','\\.')}"(?! aria-current)`,'g'),`href="${file}" aria-current="page"`);
 const html=`<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#F7F5EF"><title>${esc(title)} — Новые решения</title><meta name="description" content="${esc(lead)}"><link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="pages.css"><link rel="preload" href="assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin><script src="script.js" defer></script></head><body class="inner-page"><a class="skip-link" href="#main">Перейти к содержанию</a>${h}<main id="main">${body}${contacts}</main>${footer}${policy}</body></html>`;
 const themes={'buhgalterskiy-uchet.html':['accounting.css'],'upravlencheskiy-uchet.html':['accounting.css','management.css'],'personal-i-kadry.html':['people.css']};
 const service=services.find(s=>s.path===file);
 const pageClass=service?`service-page service--${service.id} layout-${serviceLayouts[service.id]}`:`company-page page-${file.replace('.html','')}`;
const themedHtml=html.replace('class="inner-page"',`class="inner-page ${pageClass}"`).replace('</head>',['service-layouts.css',...(themes[file]||[]),'brand.css','home-bottom.css?v=3','inner-pages.css?v=1'].map(css=>`<link rel="stylesheet" href="${css}">`).join('')+'</head>');
 await mkdir(path.dirname(file),{recursive:true});await writeFile(file,relative(cleanCopyHTML(themedHtml),base));
}
for(const s of services){
 if(s.id==='people'){
   await page(s.path,s.title,s.lead,peoplePage(s,{esc,heading,catalogCard,byId}),s.title);
   continue;
 }
 if(s.id==='accounting') {
   await page(s.path,s.title,s.lead,accountingPage(s,{esc,heading,processBlock:()=>serviceProcess('ledger',{esc,heading})}),s.title);
   continue;
 }
 if(s.id==='management') {
   await page(s.path,s.title,s.lead,managementPage(s,{esc,heading,processBlock:()=>serviceProcess('metrics',{esc,heading})}),s.title);
   continue;
 }
 await page(s.path,s.title,s.lead,servicePage(s,{esc,heading,catalogCard,byId}),s.title);
}
const catalogLead='Учет, сопровождение, развитие бизнеса и отдельные услуги по разработке 1С, сайтов и чат-ботов.';
const categories=[...new Set(services.map(s=>s.category))];
await page('uslugi.html','Наши услуги',catalogLead,hero('Для каждой задачи — свое решение',catalogLead,'КАТАЛОГ УСЛУГ')+`<section class="section container catalog-section" id="catalog">${heading('НАПРАВЛЕНИЯ ЭКСПЕРТИЗЫ','Найдем точку приложения усилий','Выберите направление или найдите конкретную услугу.')}<div class="catalog-tools" hidden><label class="catalog-search">Поиск услуги<input type="search" id="catalog-search" placeholder="Например, учет, 1С или регистрация"></label><div class="catalog-filters" role="group" aria-label="Направление услуг"><button class="filter-button active" type="button" data-filter="all" aria-pressed="true">Все услуги</button>${categories.map(c=>`<button class="filter-button" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}</div></div><p class="catalog-count" role="status">Всего ${services.length} услуг</p><div class="catalog-grid">${services.map(catalogCard).join('')}</div><div class="catalog-empty" hidden><h3>Услуга не найдена</h3><p>Попробуйте другое название или расскажите нам о задаче.</p><button type="button" class="button button-outline" id="catalog-reset">Показать все услуги</button></div></section>`);
const aboutLead='Команда бухгалтеров, экономистов, юристов, маркетологов, технологов и программистов. Комплексные решения для уверенного развития.';
await page('o-kompanii.html','О компании',aboutLead,hero('Новые решения. Системный подход.',aboutLead,'О КОМПАНИИ')+`<section class="section container company-story"><div class="company-principle"><span>Новые решения</span><strong>Смотрим на бизнес целиком</strong><p>Финансы · Процессы · Люди · Развитие</p></div><div>${heading('ЭКСПЕРТИЗА И ОПЫТ','Разные специалисты.<br> <span class="muted">Общая цель.</span>')}<p>Мы помогаем бизнесу работать эффективнее и развиваться системно. Смотрим на цифры, людей и процессы в комплексе, чтобы предложить решение с учетом реальной ситуации компании.</p><p>В нашем опыте — работа с индивидуальными предпринимателями с ежемесячной выручкой до 1 млн рублей, крупными компаниями и холдингами с оборотом в десятки миллионов.</p><p>Для каждого бизнеса учитываем масштаб, структуру, текущие задачи и цели развития.</p><div class="expertise-tags">${['Бухгалтеры','Экономисты','Юристы','Маркетологи','Технологи','Программисты'].map(x=>`<span>${x}</span>`).join('')}</div></div></section><section class="scope-section"><div class="section container">${heading('НАШ ПОДХОД','Собираем задачи в работающую систему')}${featureCards([['Начинаем с ситуации','Разбираемся в текущих процессах и целях компании, прежде чем предлагать изменения.'],['Объединяем экспертизу','Подключаем специалистов разных направлений к общей бизнес-задаче.'],['Помогаем внедрить','Сопровождаем работу с процессами, инструментами и командой.']])}</div></section>`+processBlock()+`<section class="section container">${heading('НАШИ НАПРАВЛЕНИЯ','От учета до развития бизнеса')}<div class="catalog-grid">${core.map(catalogCard).join('')}</div></section>`);
const workLead='Изучаем вашу ситуацию, согласуем план, внедряем решения и помогаем поддерживать результат.';
await page('kak-my-rabotaem.html','Как мы работаем',workLead,hero('От задачи — к результату',workLead,'НАШ ПОДХОД')+`<section class="section container">${heading('ПОСЛЕДОВАТЕЛЬНО И ПОНЯТНО','Четыре этапа работы','Состав этапов и глубина участия зависят от вашей задачи.')}<div class="workflow-list">${process.map(([t,p],i)=>`<article class="workflow-item"><span>0${i+1}</span><div><h2>${t}</h2><p>${p}</p></div><ul>${[['Ваша задача и цели','Текущие процессы и исходные данные'],['Состав и границы работ','Формат, стоимость и результат'],['Настройка процессов и инструментов','Инструкции и работа с командой'],['Контроль показателей','Поддержка и дальнейшие улучшения']][i].map(x=>`<li>${x}</li>`).join('')}</ul></article>`).join('')}</div></section><section class="scope-section"><div class="section container">${heading('С ЧЕГО НАЧАТЬ','Подготовьте короткое описание задачи')}${featureCards([['Что хотите изменить','Какая проблема мешает работе или какая цель сейчас важнее всего.'],['Как устроен бизнес','Сфера деятельности, масштаб, команда и используемые инструменты.'],['Что уже есть','Текущие отчеты, документы, программы и решения, которые вы пробовали.']])}</div></section>`+prices);
const priceLead='Разовая задача, проект под ключ или регулярное сопровождение. Стоимость рассчитываем под объем и особенности работы.';
await page('ceny.html','Цены и форматы работы',priceLead,hero('Ваши задачи. Ваш формат работы.',priceLead,'СТОИМОСТЬ')+prices+`<section class="section container">${heading('ИНДИВИДУАЛЬНЫЙ РАСЧЕТ','Из чего складывается стоимость')}${featureCards([['Объем задач','Количество участков, документов, операций и направлений работы.'],['Состояние данных','Готовность исходной информации и необходимость восстановления или систематизации.'],['Глубина сопровождения','Консультация, разработка решения, внедрение, обучение и постоянная поддержка.']])}</section><section class="page-result container"><div><div class="eyebrow">ДЛЯ РАСЧЕТА</div><h2>Начнем с вашей ситуации</h2></div><div><p>Расскажите о компании и задаче. Определим необходимые работы и подготовим предложение. Объем, результат и стоимость согласуем до начала работы.</p><a class="text-link" href="#request">Запросить расчет <span aria-hidden="true">⟶</span></a></div></section>`);
const contactLead='Позвоните, напишите или оставьте заявку. Наш офис: Барнаул, ул. Ярных, 6.';
await page('kontakty.html','Контакты',contactLead,hero('Давайте обсудим ваш бизнес',contactLead,'МЫ НА СВЯЗИ')+`<section class="container contact-routing"><div><div class="eyebrow">КАК НАС НАЙТИ</div><h2>Барнаул, ул. Ярных, 6</h2><p>Перед визитом свяжитесь с нами, чтобы согласовать встречу.</p></div><a class="button button-outline" href="https://yandex.ru/maps/?text=${encodeURIComponent('Барнаул ул. Ярных 6')}" target="_blank" rel="noopener">Открыть на карте <span aria-hidden="true">↗</span></a></section>`);
console.log(`Created ${services.length+5} pages; ${core.length} core directions, ${additional.length} additional services.`);
