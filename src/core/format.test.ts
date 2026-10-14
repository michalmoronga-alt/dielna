import { describe, expect, it } from 'vitest';
import { formatMm, parseNum, roundTo } from './format';

describe('roundTo', () => {
  it('zaokrúhli na krok', () => {
    expect(roundTo(123.26, 0.5)).toBe(123.5);
    expect(roundTo(123.24, 0.5)).toBe(123);
    expect(roundTo(0.1 + 0.2, 0.1)).toBe(0.3);
    expect(roundTo(17.6, 1)).toBe(18);
  });
});

describe('formatMm', () => {
  it('slovenská čiarka a pevné desatinné miesto', () => {
    expect(formatMm(123, 0.5, true)).toBe('123,0');
    expect(formatMm(123, 0.5)).toBe('123');
    expect(formatMm(126.666, 0.1)).toBe('126,7');
    expect(formatMm(1234.4, 1)).toBe('1234');
    expect(formatMm(NaN, 0.5)).toBe('—');
  });
});

describe('parseNum', () => {
  it('prijme čiarku aj bodku', () => {
    expect(parseNum('18')).toBe(18);
    expect(parseNum('18,5')).toBe(18.5);
    expect(parseNum(' 18.5 ')).toBe(18.5);
    expect(parseNum('')).toBeNaN();
    expect(parseNum('abc')).toBeNaN();
    expect(parseNum('1,2,3')).toBeNaN();
  });
});
