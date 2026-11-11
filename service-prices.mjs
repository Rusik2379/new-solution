// Starting prices supplied by the company, 11 November 2026.
export const serviceStartingPrices={
  accounting:5000,
  legal:2000,
  'vnedrenie-1c':3000,
  'sites-bots':20000,
  management:10000,
  registration:2500,
  'registraciya-ip':2500,
  'registraciya-ooo':2500,
  people:2000,
  horeca:900,
  marketing:1000
};

export function startingPrice(id){
  const value=serviceStartingPrices[id];
  return value===undefined?undefined:`от ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g,' ')} ₽`;
}
