const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function catalogCard(service){
  const description=service.heading?service.tag:service.lead;
  const search=(service.title+' '+(service.lead||service.tag||'')).toLocaleLowerCase('ru');
  return `<a class="catalog-card" href="${service.path}" data-category="${esc(service.category)}" data-search="${esc(search)}"><div class="catalog-card-top"><span>${esc(service.category)}</span><i aria-hidden="true">↗</i></div><h3>${esc(service.title)}</h3><p>${esc(description)}</p><span class="catalog-card-bottom">Подробнее об услуге <span aria-hidden="true">⟶</span></span></a>`;
}

const serviceHighlights = {
  accounting: ['Учет и налоги', 'Отчетность', 'Документы', 'Зарплата и кадры'],
  management: ['Доходы и расходы', 'Себестоимость и прибыль', 'Управленческие отчеты', 'Бюджеты и контроль'],
  horeca: ['Запуск заведения', 'Экономика и себестоимость', 'Команда и процессы', 'Развитие и масштабирование'],
  people: ['Штат и обязанности', 'Загрузка и графики', 'Затраты на персонал', 'Кадровый учет'],
  marketing: ['Стратегия и позиционирование', 'Реклама и продвижение', 'Контент и PR', 'Репутация и лояльность'],
  legal: ['Договоры', 'Юридические консультации', 'Внутренние документы', 'Претензии и споры'],
  it: ['IT-инфраструктура', 'Автоматизация', 'Интеграции', 'Техническая поддержка'],
  'vosstanovlenie-ucheta': ['Документы и учетная база', 'Отчетность', 'Сверки', 'Восстановление учета'],
  tax: ['Налоговая нагрузка', 'Система налогообложения', 'Налоговые риски', 'Рекомендации для бизнеса'],
  marketplace: ['Выручка и комиссии', 'Возвраты и расчеты', 'Учет и налоги', 'Отчетность'],
  medical: ['Бухгалтерский учет', 'Зарплата и кадры', 'Расчеты и налоги', 'Отчетность'],
  food: ['Учет и налоги', 'Закупки и документы', 'Зарплата и кадры', 'Отчетность'],
  'biznes-klining': ['Процессы и ответственность', 'Документы', 'Платежи', 'Рабочие системы'],
  'razovye-uslugi': ['Консультации', 'Документы и сверки', 'Отчетность', 'Исправление учета'],
  'vnedrenie-1c': ['Разработка и доработки', 'Интеграции', 'Сопровождение 1С', 'Поддержка пользователей'],
  'sites-bots': ['Создание сайтов', 'Разработка чат-ботов', 'Интеграции', 'Поддержка и развитие'],
  'registraciya-ip': ['Регистрация ИП', 'Виды деятельности', 'Налоговый режим', 'Начало работы'],
  'registraciya-ooo': ['Регистрация ООО', 'Учредительные документы', 'Учет и налоги', 'Запуск компании'],
  'zakrytie-ip': ['Закрытие ИП', 'Документы', 'Отчетность', 'Завершение расчетов'],
  'likvidaciya-ooo': ['Ликвидация компании', 'Документы', 'Учет и обязательства', 'Сопровождение процедуры'],
  'deklaraciya-3-ndfl': ['Декларирование доходов', 'Имущественные вычеты', 'Социальные вычеты', 'Инвестиционные вычеты']
};

export function serviceTopics(service) {
  const topics = serviceHighlights[service.id];
  if (!topics) throw new Error(`Missing service highlights for ${service.id}`);
  return `<section class="service-topics container" aria-label="Основные направления услуги">
    <ol class="service-topics-grid">${topics.map((title, index) => `
      <li><span class="service-topic-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="service-topic-label">${esc(title)}</span></li>`).join('')}
    </ol>
  </section>`;
}

export function scopeRows(features){
 return `<div class="service-scope-list">${features.map(([title,body],index)=>`<article class="service-scope-row" id="work-${index+1}"><span class="service-scope-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><div class="service-scope-copy">${Array.isArray(body)?`<ul>${body.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:`<p>${esc(body)}</p>`}</div></article>`).join('')}</div>`;
}

export function servicePrice(service){
 return `<section class="service-rate container" id="service-price" aria-labelledby="service-price-title" data-price-service="${esc(service.id)}"><div><h2 id="service-price-title">Стоимость услуги</h2><p>${esc(service.title)}</p></div><strong>${esc(service.price||'Стоимость уточняется')}</strong><button type="button" class="button" data-request-service="${esc(service.title)}">Уточнить стоимость <span aria-hidden="true">↗</span></button></section>`;
}
