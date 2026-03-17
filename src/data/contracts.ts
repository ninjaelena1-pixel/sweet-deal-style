export interface Contract {
  id: number;
  numDog: string;
  idSog: string;
  idAs: string;
  tipDog: string;
  dataDog: string;
  statusDog: string;
  statusSog: string;
  podpisant: string;
  nameAs: string;
  yurLico: string;
  inn: string;
  region: string;
  kam: string;
  specOtv: string;
  aptQ1: number; aptQ2: number; aptQ3: number; aptQ4: number;
  tipSogQ1: string; percQ1: string; planQ1: number; faktQ1: number; premQ1: number;
  tipSogQ2: string; percQ2: string; planQ2: number; faktQ2: number; premQ2: number;
  tipSogQ3: string; percQ3: string; planQ3: number; faktQ3: number; premQ3: number;
  tipSogQ4: string; percQ4: string; planQ4: number; faktQ4: number; premQ4: number;
  godPlan: number; godFakt: number; godPrem: number;
  komGen: string;
}

const REGIONS = ['Москва', 'Московская область', 'Северо-Запад', 'Центр', 'Верхнее Поволжье', 'Нижнее Поволжье', 'Урал', 'Западная Сибирь', 'Восточная Сибирь', 'Дальний Восток', 'Северный Кавказ', 'Юг'];
const KAMS = ['Алиев Исмаил', 'Алтуньян Ольга', 'Бецкова Ксения', 'Битиева Кристина', 'Ганченко Алена', 'Гудинова Анастасия', 'Ефремов Игорь', 'Забазнова Елена', 'Зайцев Дмитрий', 'Куликова Мария', 'Леснов Роман', 'Мазитов Данис', 'Новиков Сергей', 'Овсянников Николай', 'Одинец Ольга', 'Сидоров Денис', 'Тихомиров Олег', 'Улизко Анна', 'Шамарин Дмитрий', 'Якобсон Пётр'];
const SPECS = ['Агальцова Юлия', 'Баранова Дарья', 'Митянина Олеся', 'Парова Дарья', 'Соколова Софья', 'Степовая Ольга', 'Шабурова Елена'];
const STATUSES = ['Оригинал в офисе', 'Проверка', 'Скан', 'Согласование условий', '—'];
const TIP_DOGS = ['ДПП', 'ДПП/Агент'];
const TIP_SOGS = ['Базовое', 'УСТМ до 100 млн', 'УСТМ от 20 до 100 млн', 'УСТМ от 25 до 100 млн', 'УСТМ от 75 до 300 млн', 'УСТМ от 100 до 500 млн', 'УСТМ более 500 млн'];
const APTEKI = ['АС Ромашка', 'Фармстандарт', 'Аптека-Сервис', '36.6', 'Нео-Фарм', 'Столичные аптеки', 'Алфавит Фарма', 'Здоровье+', 'Аптечная сеть "Дельта"', 'Фарма-Лайн', 'МедФарм', 'Аптека Плюс', 'Аптечный Двор', 'ФармМакс', 'Эко-Аптека', 'Социальная Аптека', 'Аптечная Столица', 'ЛекОптика', 'Аптека Доступная', 'Фарм-Регион', 'Будь Здоров', 'Здравница', 'МедЛайф', 'Аптека Низких Цен', 'ФармСтиль'];
const YURS = ['ООО "Ромашка"', 'ООО "ФС-Трейд"', 'ООО "Апт-С"', 'ООО "Нео"', 'ООО "Столичная"', 'АО "Алфавит"', 'ООО "Здоровье"', 'ООО "Дельта-Ф"', 'ООО "ФЛ-Групп"', 'ООО "МедФ"'];

function rnd(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function rn(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function generateContracts(count: number = 25): Contract[] {
  return Array.from({ length: count }, (_, i) => {
    const planQ1 = rn(50000, 5000000);
    const planQ2 = rn(50000, 5000000);
    const planQ3 = rn(50000, 5000000);
    const planQ4 = rn(50000, 5000000);
    const faktQ1 = rn(Math.floor(planQ1 * 0.5), Math.floor(planQ1 * 1.3));
    const faktQ2 = rn(Math.floor(planQ2 * 0.3), Math.floor(planQ2 * 1.2));
    const faktQ3 = rn(0, Math.floor(planQ3 * 0.8));
    const faktQ4 = rn(0, Math.floor(planQ4 * 0.4));
    const premQ1 = Math.floor(faktQ1 * (rn(3, 12) / 100));
    const premQ2 = Math.floor(faktQ2 * (rn(3, 12) / 100));
    const premQ3 = Math.floor(faktQ3 * (rn(3, 12) / 100));
    const premQ4 = Math.floor(faktQ4 * (rn(3, 12) / 100));
    const godPlan = planQ1 + planQ2 + planQ3 + planQ4;
    const godFakt = faktQ1 + faktQ2 + faktQ3 + faktQ4;
    const godPrem = premQ1 + premQ2 + premQ3 + premQ4;
    const month = String(rn(1, 12)).padStart(2, '0');
    const day = String(rn(1, 28)).padStart(2, '0');
    const statusDog = rnd(STATUSES);
    const statusSog = rnd(STATUSES.filter(s => s !== '—'));

    return {
      id: i + 1,
      numDog: `${rn(1, 30)}/${month}-М-${String(i + 1).padStart(2, '0')}/26`,
      idSog: String(rn(1, 999)),
      idAs: String(rn(10000, 99999)),
      tipDog: rnd(TIP_DOGS),
      dataDog: `2026-${month}-${day}`,
      statusDog,
      statusSog,
      podpisant: rnd(KAMS),
      nameAs: rnd(APTEKI),
      yurLico: rnd(YURS),
      inn: String(rn(7700000000, 7799999999)),
      region: rnd(REGIONS),
      kam: rnd(KAMS),
      specOtv: rnd(SPECS),
      aptQ1: rn(5, 250), aptQ2: rn(5, 250), aptQ3: rn(5, 250), aptQ4: rn(5, 250),
      tipSogQ1: rnd(TIP_SOGS), percQ1: `${rn(3, 15)}%`,
      planQ1, faktQ1, premQ1,
      tipSogQ2: rnd(TIP_SOGS), percQ2: `${rn(3, 15)}%`,
      planQ2, faktQ2, premQ2,
      tipSogQ3: rnd(TIP_SOGS), percQ3: `${rn(3, 15)}%`,
      planQ3, faktQ3, premQ3,
      tipSogQ4: rnd(TIP_SOGS), percQ4: `${rn(3, 15)}%`,
      planQ4, faktQ4, premQ4,
      godPlan, godFakt, godPrem,
      komGen: '',
    };
  });
}

export const REGION_OPTIONS = REGIONS;
export const KAM_OPTIONS = KAMS;
export const SPEC_OPTIONS = SPECS;
export const STATUS_OPTIONS = ['Оригинал в офисе', 'Проверка', 'Скан', 'Согласование условий', '—'];
export const TIP_DOG_OPTIONS = TIP_DOGS;
export const TIP_SOG_OPTIONS = TIP_SOGS;

export function formatCurrency(n: number): string {
  if (!n) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + ' млн';
  if (n >= 1000) return (n / 1000).toFixed(0) + ' тыс';
  return n.toLocaleString('ru-RU');
}

export function formatDate(d: string): string {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function pct(fakt: number, plan: number): number {
  if (!plan) return 0;
  return Math.round((fakt / plan) * 100);
}
