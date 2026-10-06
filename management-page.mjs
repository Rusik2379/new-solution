import {financeHero} from './finance-hero.mjs';

export function managementPage(service,{esc,heading,processBlock}) {
  return `
    ${financeHero(esc,{title:service.title,prefix:'Управленческий',titleId:'management-title',className:'management-hero bookkeeping-hero',image:'assets/management-banknote-v1.png',illustration:true,eyebrow:'НОВЫЕ РЕШЕНИЯ / УПРАВЛЕНЧЕСКИЙ УЧЕТ',description:'Видеть реальную прибыль.\nУправлять развитием бизнеса.',topics:[['Система учета','management-service-1'],['Отчетность','management-service-3'],['Себестоимость и прибыль','management-service-4'],['Бюджеты и расходы','management-service-5'],['Поддержка руководителя','management-service-6']]})}

    <section class="section container accounting-intro management-intro" aria-labelledby="management-intro-title">
      <div><div class="eyebrow">01 / БИЗНЕС В ЦИФРАХ</div><h2 id="management-intro-title">Реальная картина.<br> <span class="muted">Обоснованные решения.</span></h2></div>
      <div class="accounting-intro-copy"><p class="accounting-intro-lead">${esc(service.lead)}</p><p>${esc(service.intro)}</p></div>
    </section>

    <section class="scope-section" id="scope" aria-labelledby="management-scope-title"><div class="section container">
      ${heading('02 / МЫ ПРЕДЛАГАЕМ','<span id="management-scope-title">Выстраиваем систему.<br> <span class="muted">Настраиваем показатели.</span></span>','От анализа текущего учета до отчетности для собственника и сопровождения вашей команды.')}
      <div class="feature-grid management-services">${service.features.map(([title,items],i)=>`<article class="service-feature accounting-service" id="management-service-${i+1}"><span class="feature-number">0${i+1}<i aria-hidden="true">↗</i></span><h3>${esc(title)}</h3><ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div>
    </div></section>

    <section class="section container management-reports" aria-labelledby="management-reports-title">
      ${heading('03 / ИНСТРУМЕНТЫ УПРАВЛЕНИЯ','<span id="management-reports-title">Отчеты, которые<br> <span class="muted">отвечают на ваши вопросы.</span></span>','Формируем отчетность, с которой удобно работать руководителю. Структуру показателей настраиваем под задачи компании.')}
      <div class="management-report-grid">
        <article class="management-report"><span class="management-report-label">ПРИБЫЛЬ И УБЫТКИ</span><strong class="management-report-mark">P&amp;L</strong><h3>Сколько бизнес зарабатывает?</h3><p>Доходы, расходы и финансовый результат. Основа для анализа прибыли, маржинальности и рентабельности.</p><div class="management-report-lines"><span>Доходы</span><span>Расходы</span><span>Прибыль</span></div></article>
        <article class="management-report"><span class="management-report-label">ДВИЖЕНИЕ ДЕНЕЖНЫХ СРЕДСТВ</span><strong class="management-report-mark">ДДС</strong><h3>Куда уходят деньги?</h3><p>Поступления, платежи и движение денежных средств. Понятная картина денежных потоков компании.</p><div class="management-report-lines"><span>Поступления</span><span>Платежи</span><span>Остатки</span></div></article>
        <article class="management-report"><span class="management-report-label">БЮДЖЕТИРОВАНИЕ</span><strong class="management-report-mark management-report-mark-small">План / факт</strong><h3>Почему результат отличается от плана?</h3><p>Сопоставление запланированных и фактических показателей для контроля расходов и поиска точек оптимизации.</p><div class="management-report-lines"><span>План</span><span>Факт</span><span>Отклонения</span></div></article>
      </div>
    </section>

    <section class="accounting-result wide" id="result" aria-labelledby="management-result-title"><div class="container accounting-result-inner">
      <div><div class="eyebrow light">04 / РЕЗУЛЬТАТ ДЛЯ СОБСТВЕННИКА</div><h2 id="management-result-title">Понимать прибыль.<br> Видеть точки роста<span class="blue-dot">.</span></h2><div class="accounting-result-tags"><span>Реальная прибыль</span><span>Контроль расходов</span><span>Эффективность направлений</span></div></div>
      <div class="accounting-result-copy"><p><strong>${esc(service.result)}</strong></p><a class="button button-white" href="#request">Обсудить систему учета <span aria-hidden="true">↗</span></a></div>
    </div></section>
    ${processBlock()}
    <section class="container accounting-next"><div><div class="eyebrow">С ЧЕГО НАЧАТЬ?</div><h2>Разберемся в вашей финансовой картине.</h2><p>Расскажите, какие данные уже есть и на какие вопросы пока не получается ответить. Определим приоритеты для работы с учетом.</p></div><a class="text-link" href="ceny.html">Стоимость и форматы работы <span aria-hidden="true">⟶</span></a></section>
  `;
}
