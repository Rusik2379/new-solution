// Accounting has its own editorial layout; content still comes from the Word source.
import {financeHero} from './finance-hero.mjs';
import {serviceTopics,scopeRows} from './service-sections.mjs';
export function accountingPage(service, {esc, heading}) {
  const items = service.features.flatMap(([, body]) => body);
  const mainServices = items.slice(0, 6).map(item => {
    const colon = item.indexOf(':');
    if (colon < 0) throw Error('Accounting service needs a title and description');
    return {title: item.slice(0, colon), description: item.slice(colon + 1).trim()};
  });
  const mainFeatures=mainServices.map(({title,description})=>[title,description]);
  const resultParts = service.result.split(/(?=Наша задача —)/);
  return `
    ${financeHero(esc,{title:service.title,prefix:'Бухгалтерский',titleId:'accounting-title',className:'bookkeeping-hero',image:'assets/accounting-isometric-v1.png',illustration:true,eyebrow:'НОВЫЕ РЕШЕНИЯ / БУХГАЛТЕРСКИЙ УЧЕТ',headline:['Порядок в цифрах —','свобода в решениях'],description:'Бухгалтерский и налоговый учет,\nотчетность и сопровождение бизнеса.'})}

    ${serviceTopics(mainFeatures)}
    <section class="section container accounting-intro" aria-labelledby="accounting-intro-title">
      <div><div class="eyebrow">01 / СИСТЕМНЫЙ ПОДХОД</div><h2 id="accounting-intro-title">Учет, на который<br> <span class="muted">можно опереться.</span></h2></div>
      <div class="accounting-intro-copy"><p class="accounting-intro-lead">${esc(service.lead)}</p><p>${esc(service.intro)}</p></div>
    </section>

    <section class="scope-section accounting-scope" id="scope" aria-labelledby="accounting-scope-title"><div class="section container">
      ${heading('02 / ЧТО ВХОДИТ В КОНСАЛТИНГ','<span id="accounting-scope-title">Ежедневные задачи.<br> <span class="muted">Профессиональная поддержка.</span></span>','От текущих операций и отчетности до взаимодействия с государственными органами и восстановления учета.')}
      ${scopeRows(mainFeatures)}
    </div></section>

    <section class="accounting-result wide" id="result" aria-labelledby="accounting-result-title"><div class="container accounting-result-inner">
      <div><div class="eyebrow light">04 / РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА</div><h2 id="accounting-result-title">Прозрачный учет.<br> Понятное управление<span class="blue-dot">.</span></h2><div class="accounting-result-tags"><span>Документы в порядке</span><span>Ответственность распределена</span><span>Данные для решений</span></div></div>
      <div class="accounting-result-copy"><p><strong>${esc(resultParts[0].trim())}</strong></p><p>${esc(resultParts.slice(1).join('').trim())}</p><a class="button button-white" href="#request">Начнем с вашей задачи <span aria-hidden="true">↗</span></a></div>
    </div></section>
  `;
}
