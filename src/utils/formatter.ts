export function parseLocaleNumber(input: string, locale: string = "de-DE"): number | null {
  if (!input) return null;
  const raw = input.replace(/\s|[€$]/g, "");
  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");

  let normalized = raw;

  if (hasComma && hasDot) {
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    const decimalIsComma = lastComma > lastDot;
    normalized = decimalIsComma ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(/,/g, "");
  } else if (hasComma) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (hasDot) {
    normalized = raw.replace(/,/g, "");
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function formatNumber(
  value: number,
  {
    locale = "de-DE",
    minFraction = 0,
    maxFraction = 8,
  }: { locale?: string; minFraction?: number; maxFraction?: number } = {}
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  }).format(value);
}

export function formatEurCurrency(
  value: number,
  { locale = "de-DE" }: { locale?: string } = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatEurDecimal(
  value: number,
  { locale = "de-DE" }: { locale?: string } = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatBtc(
  value: number,
  { decimals = 8, trim = true }: { decimals?: number; trim?: boolean } = {}
): string {
  const s = value.toFixed(decimals);
  const trimmed = trim ? s.replace(/\.?0+$/, "") : s;
  return `${trimmed} BTC`;
}

export function formatTimeHMS(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().substring(11, 19);
}
