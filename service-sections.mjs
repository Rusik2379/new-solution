const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function catalogCard(service){
  const description=service.heading?service.tag:service.lead;
  const search=(service.title+' '+(service.lead||service.tag||'')).toLocaleLowerCase('ru');
  return `<a class="catalog-card" href="${service.path}" data-category="${esc(service.category)}" data-search="${esc(search)}"><div class="catalog-card-top"><span>${esc(service.category)}</span><i aria-hidden="true">↗</i></div><h3>${esc(service.title)}</h3><p>${esc(description)}</p><span class="catalog-card-bottom">Подробнее об услуге <span aria-hidden="true">⟶</span></span></a>`;
}

export function serviceTopics(features){
 return `<nav class="service-topics container" aria-label="Направления услуги"><div class="service-topics-grid">${features.map(([title],index)=>`<a href="#work-${index+1}"><span class="service-topic-number">${String(index+1).padStart(2,'0')}</span><span class="service-topic-label">${esc(title)}</span><span class="service-topic-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><div class="service-topic-links"><a href="#scope">Состав работ <span aria-hidden="true">↓</span></a><a href="#service-price">Стоимость услуги <span aria-hidden="true">↓</span></a><a href="#request">Оформить заявку <span aria-hidden="true">↗</span></a></div></nav>`;
}

export function scopeRows(features){
 return `<div class="service-scope-list">${features.map(([title,body],index)=>`<article class="service-scope-row" id="work-${index+1}"><span class="service-scope-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><div class="service-scope-copy">${Array.isArray(body)?`<ul>${body.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:`<p>${esc(body)}</p>`}</div></article>`).join('')}</div>`;
}

export function servicePrice(service){
 return `<section class="service-rate container" id="service-price" aria-labelledby="service-price-title" data-price-service="${esc(service.id)}"><div><h2 id="service-price-title">Стоимость услуги</h2><p>${esc(service.title)}</p></div><strong>${esc(service.price||'Стоимость уточняется')}</strong><button type="button" class="button" data-request-service="${esc(service.title)}">Уточнить стоимость <span aria-hidden="true">↗</span></button></section>`;
}
