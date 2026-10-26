const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function catalogCard(service){
  const description=service.heading?service.tag:service.lead;
  const search=(service.title+' '+(service.lead||service.tag||'')).toLocaleLowerCase('ru');
  return `<a class="catalog-card" href="${service.path}" data-category="${esc(service.category)}" data-search="${esc(search)}"><div class="catalog-card-top"><span>${esc(service.category)}</span><i aria-hidden="true">↗</i></div><h3>${esc(service.title)}</h3><p>${esc(description)}</p><span class="catalog-card-bottom">Подробнее об услуге <span aria-hidden="true">⟶</span></span></a>`;
}

export function relatedTasks(ids,byId){
  const services=[...new Set(ids)].map(id=>byId[id]).filter(service=>service&&!service.hiddenFromCatalog).slice(0,3);
  if(!services.length)return '';
  return `<section class="section container related-section" id="related-tasks" aria-labelledby="related-tasks-title"><div class="section-heading"><div><h2 id="related-tasks-title">Связанные задачи</h2></div><p class="section-intro">Услуги, которые дополняют решение и помогают связать работу бизнеса в единую систему</p></div><div class="related-grid">${services.map(catalogCard).join('')}</div><div class="related-actions"><a class="text-link" href="uslugi.html">Все услуги <span aria-hidden="true">⟶</span></a><a class="text-link" href="ceny.html#service-prices">Услуги и стоимость <span aria-hidden="true">⟶</span></a></div></section>`;
}

export function servicePriceList(services){
  const visible=services.filter(service=>!service.hiddenFromCatalog);
  const categories=[...new Set(visible.map(service=>service.category))];
  return `<section class="section container service-prices" id="service-prices" aria-labelledby="service-prices-title"><div class="section-heading"><div><h2 id="service-prices-title">Все услуги и стоимость</h2></div><p class="section-intro">Стоимость зависит от объёма задачи и формата работы. Уточним детали и подготовим предложение</p></div><div class="service-price-groups">${categories.map((category,index)=>`<section class="service-price-group" aria-labelledby="price-group-${index}"><h3 id="price-group-${index}">${esc(category)}</h3><div class="service-price-table" role="table" aria-label="${esc(category)} — стоимость услуг"><div class="service-price-head" role="row"><span role="columnheader">Услуга</span><span role="columnheader">Стоимость</span><span role="columnheader">Обсудить задачу</span></div>${visible.filter(service=>service.category===category).map(service=>`<div class="service-price-row" role="row" data-price-service="${service.id}"><div role="cell"><a href="${service.path}">${esc(service.title)} <span aria-hidden="true">↗</span></a></div><div class="service-price-value" role="cell">${esc(service.price||'Стоимость уточняется')}</div><div role="cell"><button type="button" class="service-price-request" data-request-service="${esc(service.title)}" aria-label="Уточнить стоимость: ${esc(service.title)}">Уточнить стоимость <span aria-hidden="true">↗</span></button></div></div>`).join('')}</div></section>`).join('')}</div><p class="service-prices-note">Состав работ и стоимость согласуем до начала сотрудничества</p></section>`;
}
