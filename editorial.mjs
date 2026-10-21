// Copy changes from «сайт поправки.docx», 20 October 2026.
// The original Word extraction remains unchanged for reference.
export function applyEditorialChanges(services) {
  const legal=services.find(service=>service.id==='legal');
  const old=legal.features;
  legal.features=[
    old[0],
    ['Договоры и правовая экспертиза',[...old[1][1],...old[2][1]]],
    ['Юридическое консультирование',old[5][1]],
    old[3],
    old[4]
  ];
  legal.heroTopics=['Анализ правовых рисков','Договоры и правовая экспертиза','Юридическое консультирование','Внутренние документы и кадры'];
  const horeca=services.find(service=>service.id==='horeca');
  horeca.hideSituationIntro=true;
  const [audit,...other]=horeca.features;
  horeca.features=[
    [audit[0],audit[1].filter((_,index)=>index!==1)],
    ['Постановка и оптимизация управленческого учета',[audit[1][1]]],
    ...other
  ];
  horeca.result='Собственник получает прозрачный и управляемый бизнес: понимание реальной себестоимости и фудкоста, контроль расходов, потерь и среднего чека, понятные показатели эффективности и выстроенные рабочие процессы. Можно начать с разовой задачи — например, разобраться со списанием продуктов — или выбрать комплексный консалтинг с сопровождением и контролем внедрения решений';
}

export function cleanCopyHTML(html) {
  // Keep URLs, attributes, decimals and abbreviations intact. Sentences in
  // longer text blocks get line breaks, as requested, instead of full stops.
  return html.replace(/<span class="(?:blue-dot|accounting-title-dot)">\.<\/span>/g,'')
    .split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/i)
    .map((part,index)=>index%2?part:part.replace(/(^|>)([^<]+)(?=<|$)/g,(_,prefix,text)=>{
      const copy=text.replace(/\.\s+(?=[А-ЯЁA-Z])/gu,(match,offset,whole)=>
        /(?:^|[^\p{L}])(?:ул|г|им|др|т)$/u.test(whole.slice(0,offset))?match:'<br> ')
        .replace(/\.([\s]*)$/u,'$1');
      return prefix+copy;
    })).join('');
}
