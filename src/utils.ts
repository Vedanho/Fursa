import { PRICE_LIMITS, SETTINGS, MONTHS, MIN_TERM, MAX_TERM } from "./constants";
import type { Result } from "./types";

export const onlyDigits = (value: string) => value.replace(/\D/g, "");
export const parseMoney = (value: string) => Number(onlyDigits(value)) || 0;
export const formatNumber = (value: number) => Math.round(value).toLocaleString("ru-RU");
export const formatMoney = (value: number) => `${formatNumber(value)} ₽`;
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
export const roundUp = (value: number, step = SETTINGS.roundStep) => Math.ceil(value / step) * step;
export const progress = (value: number, min: number, max: number) =>
  max > min ? ((value - min) / (max - min)) * 100 : 0;

export function paymentWord(value: number) {
  const lastTwo = Math.abs(value) % 100;
  const last = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return "платежей";
  if (last === 1) return "платеж";
  if (last >= 2 && last <= 4) return "платежа";
  return "платежей";
}

export function calculate(
  priceInput: number,
  downInput: number,
  term: number,
  markupRate: number,
): Result {
  const price = clamp(priceInput, PRICE_LIMITS.min, PRICE_LIMITS.max);
  const paymentsCount = clamp(Math.floor(term), MIN_TERM, MAX_TERM);
  const minDown = roundUp(price * SETTINGS.minDownRate);
  const maxDown = roundUp(price * SETTINGS.maxDownRate);
  const downPayment = clamp(Math.max(downInput, minDown), minDown, maxDown);
  const rawTotal = price * (1 + markupRate);
  const monthly = (rawTotal - downPayment) / paymentsCount;
  const payments = Array.from({ length: paymentsCount }, () => monthly);
  const total = monthly * paymentsCount + downPayment;

  return { price, downPayment, minDown, maxDown, monthly, payments, rest: total - downPayment, total, markupRate };
}

export function buildSchedule(result: Result): string {
  const now = new Date();
  const startMonth = now.getMonth() + 1;
  const startYear = now.getFullYear();
  const overpay = Math.max(result.total - result.price, 0);

  const lines = [
    "График платежей",
    "----------------",
    `Стоимость: ${formatMoney(result.price)}`,
    `Первоначальный взнос: ${formatMoney(result.downPayment)}`,
    `Ежемесячный платеж: ${formatMoney(result.monthly)}`,
    `Переплата: ${formatMoney(overpay)}`,
    "",
    "Платежи:",
  ];

  result.payments.forEach((payment, index) => {
    const monthIndex = (startMonth + index) % 12;
    const year = startYear + Math.floor((startMonth + index) / 12);
    lines.push(`${index + 1}. ${MONTHS[monthIndex]} ${year}: ${formatMoney(payment)}`);
  });

  lines.push("", `Итого: ${formatMoney(result.total)}`);
  return lines.join("\n");
}
