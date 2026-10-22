/**
 * Helper utilities for currency parsing and formatting.
 * All financial amounts are handled in cents (integer values) to avoid float inaccuracies.
 */

export interface ParseResult {
  valid: boolean;
  cents?: number;
  error?: string;
}

export interface FormatMoneyOptions {
  showSign?: boolean;
  showDollar?: boolean;
}

export function normalizeArabicDigits(input: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = input;
  for (let i = 0; i < 10; i++) {
    res = res.replace(new RegExp(arabicDigits[i], 'g'), i.toString());
  }
  return res;
}

export function parseMoneyToCents(rawInput: string): ParseResult {
  const normalized = normalizeArabicDigits(rawInput.trim().replace(/[\$،]/g, ','));
  if (!normalized) {
    return { valid: false, error: 'يرجى إدخال نتيجة الصفقة.' };
  }

  const match = normalized.replace(',', '.').match(/^([+-])?(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    return { valid: false, error: 'يرجى إدخال رقم صحيح.' };
  }

  const sign = match[1] === '-' ? -1 : 1;
  const whole = parseInt(match[2], 10);
  const fracStr = match[3] ? match[3].padEnd(2, '0') : '00';
  const frac = parseInt(fracStr.slice(0, 2), 10);
  const cents = sign * (whole * 100 + frac);

  if (cents === 0) {
    return { valid: false, error: 'لا يمكن أن تكون نتيجة الصفقة صفراً.' };
  }

  return { valid: true, cents };
}

export function parseCapitalToCents(rawInput: string): ParseResult {
  const normalized = normalizeArabicDigits(rawInput.trim().replace(/[\$،]/g, ','));
  if (!normalized) {
    return { valid: false, error: 'يرجى إدخال قيمة صحيحة.' };
  }

  const match = normalized.replace(',', '.').match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    return { valid: false, error: 'يرجى إدخال رقم صحيح أكبر من صفر.' };
  }

  const whole = parseInt(match[1], 10);
  const fracStr = match[2] ? match[2].padEnd(2, '0') : '00';
  const frac = parseInt(fracStr.slice(0, 2), 10);
  const cents = whole * 100 + frac;

  if (cents <= 0) {
    return { valid: false, error: 'يجب أن تكون القيمة أكبر من صفر.' };
  }

  return { valid: true, cents };
}

export function formatMoney(
  cents: number | null | undefined,
  options?: FormatMoneyOptions | boolean
): string {
  if (cents == null) return '-';

  const opts: FormatMoneyOptions =
    typeof options === 'boolean' ? { showSign: options } : options || {};
  const { showSign = false, showDollar = true } = opts;

  const isNegative = cents < 0;
  const isPositive = cents > 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const formattedNumber = `${dollars.toLocaleString('en-US')}.${remainder.toString().padStart(2, '0')}`;
  const prefix = showDollar ? '$' : '';

  if (isNegative) {
    return `-${prefix}${formattedNumber}`;
  }
  if (isPositive && showSign) {
    return `+${prefix}${formattedNumber}`;
  }
  return `${prefix}${formattedNumber}`;
}

export function calculateProgress(currentCents: number, targetCents: number): number {
  if (targetCents <= 0 || currentCents <= 0) return 0;
  const pct = (currentCents / targetCents) * 100;
  return Math.min(Math.max(pct, 0), 100);
}

export function formatDateTime(dateVal: number | string | Date): string {
  const d = new Date(dateVal);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
