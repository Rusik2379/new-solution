// Accounting has its own editorial layout; content still comes from the Word source.
import {financeHero} from './finance-hero.mjs';
export function accountingPage(service, {esc, heading, processBlock}) {
  const items = service.features.flatMap(([, body]) => body);
  const mainServices = items.slice(0, 6).map(item => {
    const colon = item.indexOf(':');
    if (colon < 0) throw Error('Accounting service needs a title and description');
    return {title: item.slice(0, colon), description: item.slice(colon + 1).trim()};
  });
  const organization = [
    ['Анализ и диагностика', [6, 7]],
    ['Документооборот и взаимодействие', [8, 9, 14]],
    ['Операции и участки учета', [10, 11, 12, 13, 15]],
    ['Автоматизация и внутренний контроль', [16, 17, 18]]
  ];
  const resultParts = service.result.split(/(?=Наша задача —)/);
  return `
    ${financeHero(esc,{title:service.title,prefix:'Бухгалтерский',titleId:'accounting-title',className:'bookkeeping-hero',image:'assets/accounting-isometric-v1.png',illustration:true,eyebrow:'НОВЫЕ РЕШЕНИЯ / БУХГАЛТЕРСКИЙ УЧЕТ',headline:['Порядок в цифрах —','свобода в решениях'],description:'Бухгалтерский и налоговый учет,\nотчетность и сопровождение бизнеса.',topics:['Учет и налоги','Отчетность','Документы','Зарплата и кадры','Проверки','Восстановление'].map((title,index)=>[title,`accounting-service-${index+1}`])})}

    <section class="section container accounting-intro" aria-labelledby="accounting-intro-title">
      <div><div class="eyebrow">01 / СИСТЕМНЫЙ ПОДХОД</div><h2 id="accounting-intro-title">Учет, на который<br> <span class="muted">можно опереться.</span></h2></div>
      <div class="accounting-intro-copy"><p class="accounting-intro-lead">${esc(service.lead)}</p><p>${esc(service.intro)}</p></div>
    </section>

    <section class="scope-section accounting-scope" id="scope" aria-labelledby="accounting-scope-title"><div class="section container">
      ${heading('02 / ЧТО ВХОДИТ В КОНСАЛТИНГ','<span id="accounting-scope-title">Ежедневные задачи.<br> <span class="muted">Профессиональная поддержка.</span></span>','От текущих операций и отчетности до взаимодействия с государственными органами и восстановления учета.')}
      <div class="feature-grid accounting-services">${mainServices.map((item, index) => `
        <article class="service-feature accounting-service" id="accounting-service-${index+1}"><span class="feature-number">0${index + 1}<i aria-hidden="true">↗</i></span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('')}
      </div>
    </div></section>

    <section class="section container accounting-organization" id="organization" aria-labelledby="accounting-organization-title">
      ${heading('03 / ОРГАНИЗАЦИЯ УЧЕТА','<span id="accounting-organization-title">Выстраиваем процессы.<br> <span class="muted">Соединяем данные и людей.</span></span>','Анализируем учетную систему и помогаем организовать работу бухгалтерии и ее взаимодействие с другими подразделениями.')}
      <div class="accounting-work-grid">${organization.map(([title, indexes], index) => `
        <article class="accounting-work"><span class="accounting-work-number">0${index + 1}</span><div><h3>${title}</h3><ul>${indexes.map(i => `<li>${esc(items[i])}</li>`).join('')}</ul></div></article>`).join('')}
      </div>
    </section>

    <section class="accounting-result wide" id="result" aria-labelledby="accounting-result-title"><div class="container accounting-result-inner">
      <div><div class="eyebrow light">04 / РЕЗУЛЬТАТ ДЛЯ БИЗНЕСА</div><h2 id="accounting-result-title">Прозрачный учет.<br> Понятное управление<span class="blue-dot">.</span></h2><div class="accounting-result-tags"><span>Документы в порядке</span><span>Ответственность распределена</span><span>Данные для решений</span></div></div>
      <div class="accounting-result-copy"><p><strong>${esc(resultParts[0].trim())}</strong></p><p>${esc(resultParts.slice(1).join('').trim())}</p><a class="button button-white" href="#request">Начнем с вашей задачи <span aria-hidden="true">↗</span></a></div>
    </div></section>
    ${processBlock()}
    <section class="container accounting-next"><div><div class="eyebrow">НУЖНА ПОМОЩЬ В ОТДЕЛЬНОМ ВОПРОСЕ?</div><h2>Начнем с того, что важно сейчас.</h2><p>Можно обсудить отдельный участок учета или комплексное сопровождение компании.</p></div><a class="text-link" href="ceny.html">Стоимость и форматы работы <span aria-hidden="true">⟶</span></a></section>
  `;
}
