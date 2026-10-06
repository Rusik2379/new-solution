// Shared first-screen composition for the two financial service pages.
export function financeHero(esc, {title, prefix, titleId, description, topics, className='', image='assets/accounting-eye.png', illustration=false, headline, eyebrow='НОВЫЕ РЕШЕНИЯ / УЧЕТ И ФИНАНСЫ'}) {
  const visual = `<img class="accounting-hero-image" src="${esc(image)}" width="${illustration?1024:1672}" height="${illustration?1024:941}" alt="" fetchpriority="high">`;
  return `<section class="accounting-hero ${className} wide" aria-labelledby="${titleId}">
    ${illustration?'':visual}
    <div class="accounting-hero-shade" aria-hidden="true"></div>
    <div class="container accounting-hero-inner">
      <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><a href="uslugi.html">Услуги</a><span aria-hidden="true">/</span><span>${esc(title)}</span></nav>
      <div class="accounting-hero-copy">
        <div class="eyebrow light">${esc(eyebrow)}</div>
        <h1 id="${titleId}">${headline?headline.map(esc).join('<br> '):`<span class="accounting-title-prefix">${esc(prefix)}</span><span class="accounting-title-main">учет<span class="accounting-title-dot">.</span></span>`}</h1>
        <p>${description.split('\n').map(esc).join('<br> ')}</p>
        <div class="accounting-hero-actions"><a class="button button-white" href="#request">Обсудить задачу <span aria-hidden="true">↗</span></a><a class="accounting-hero-link" href="#result">Ваш результат <span aria-hidden="true">↓</span></a></div>
      </div>
      ${illustration?visual:''}
      <nav class="accounting-hero-foot" aria-label="Направления услуги">${topics.map(([label,target],index)=>`<a class="accounting-hero-topic" href="#${target}"><span class="accounting-topic-number">0${index+1}</span><span class="accounting-topic-title">${esc(label)}</span><span class="accounting-topic-arrow" aria-hidden="true">↗</span></a>`).join('')}</nav>
      <div class="accounting-hero-bottom"><a href="#scope">Состав работ <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>`;
}
