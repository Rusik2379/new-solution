import {financeHero} from './finance-hero.mjs';
import {serviceTopics,scopeRows} from './service-sections.mjs';

export function managementPage(service,{esc,heading}) {
  return `
    ${financeHero(esc,{title:service.title,prefix:'Управленческий',titleId:'management-title',className:'management-hero bookkeeping-hero',image:'assets/management-banknote-v1.png',illustration:true,eyebrow:'НОВЫЕ РЕШЕНИЯ / УПРАВЛЕНЧЕСКИЙ УЧЕТ',description:'Выручка растет, а прибыль — нет?\nРазберемся, сколько бизнес зарабатывает на самом деле'})}

    ${serviceTopics(service.features)}

    <section class="scope-section" id="scope" aria-labelledby="management-scope-title"><div class="section container">
      ${heading('02 / МЫ ПРЕДЛАГАЕМ','<span id="management-scope-title">Выстраиваем систему.<br> <span class="muted">Настраиваем показатели.</span></span>','От анализа текущего учета до отчетности для собственника и сопровождения вашей команды.')}
      ${scopeRows(service.features)}
    </div></section>

    <section class="section container management-reports" aria-labelledby="management-reports-title">
      ${heading('03 / ИНСТРУМЕНТЫ УПРАВЛЕНИЯ','<span id="management-reports-title">Отчеты, которые<br> <span class="muted">отвечают на ваши вопросы.</span></span>','Формируем отчетность, с которой удобно работать руководителю. Структуру показателей настраиваем под задачи компании.')}
      <div class="management-report-grid">
        <article class="management-report"><span class="management-report-label">ПРИБЫЛЬ И УБЫТКИ</span><strong class="management-report-mark">P&amp;L</strong><h3>Что мешает зарабатывать больше?</h3><p>Доходы, расходы и финансовый результат — основа для анализа прибыли, маржинальности и рентабельности</p><p>Покажем, где бизнес теряет прибыль и как анализировать показатели, чтобы находить возможности для роста</p><div class="management-report-lines"><span>Доходы</span><span>Расходы</span><span>Прибыль</span></div></article>
        <article class="management-report"><span class="management-report-label">ДВИЖЕНИЕ ДЕНЕЖНЫХ СРЕДСТВ</span><strong class="management-report-mark">ДДС</strong><h3>Куда уходят деньги?</h3><p>Поступления, платежи и движение денежных средств. Понятная картина денежных потоков компании.</p><div class="management-report-lines"><span>Поступления</span><span>Платежи</span><span>Остатки</span></div></article>
        <article class="management-report"><span class="management-report-label">БЮДЖЕТИРОВАНИЕ</span><strong class="management-report-mark management-report-mark-small">План / факт</strong><h3>Почему факт далек от плана?</h3><p>Поможем ставить достижимые цели, планировать показатели и разбираться в отклонениях, чтобы выполнять намеченное</p><div class="management-report-lines"><span>План</span><span>Факт</span><span>Отклонения</span></div></article>
      </div>
    </section>

  `;
}
