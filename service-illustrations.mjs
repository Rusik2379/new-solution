const primary={
  accounting:{src:'assets/accounting-isometric-v2.webp',alt:'Калькулятор, документы и расчеты — бухгалтерский учет'},
  management:{src:'assets/management-isometric-v2.webp',alt:'Доходы, расходы и прибыль — управленческий учет'},
  people:{src:'assets/people-isometric-v2.webp',alt:'Карточки сотрудников, график и документы — работа с персоналом'},
  horeca:{src:'assets/horeca-typographic-brand-v2.webp',alt:'Надпись HORECA с поварским колпаком, вилкой и бутылкой в фирменных цветах'},
  marketing:{src:'assets/marketing-isometric-v2.webp',alt:'Мегафон, календарь публикаций и цель — маркетинг и PR'},
  registration:{src:'assets/registration-isometric-v1.webp',alt:'Документы, печать и компания — регистрация и завершение деятельности'},
  legal:{src:'assets/legal-isometric-v1.webp',alt:'Весы, договор и защитный щит — юридическая поддержка'},
  'vnedrenie-1c':{src:'assets/one-c-isometric-v1.webp',alt:'Рабочая система, база данных и интеграции — разработка и сопровождение 1С'},
  'sites-bots':{src:'assets/web-bots-isometric-v1.webp',alt:'Сайт, мобильный интерфейс и чат-бот — цифровые сервисы для бизнеса'}
};
const families={
  'vosstanovlenie-ucheta':'accounting',tax:'accounting',marketplace:'accounting',
  medical:'accounting',food:'accounting','razovye-uslugi':'accounting','deklaraciya-3-ndfl':'accounting',
  'biznes-klining':'management','registraciya-ip':'registration','registraciya-ooo':'registration',
  'zakrytie-ip':'registration','likvidaciya-ooo':'registration'
};
export const serviceArtwork={...primary,...Object.fromEntries(Object.entries(families).map(([id,family])=>[id,primary[family]]))};
