import { SanitizeNumberPipe } from './sanitize-number.pipe';

describe('SanitizeNumberPipe', () => {
  let pipe: SanitizeNumberPipe;

  beforeEach(() => {
    pipe = new SanitizeNumberPipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same value if it is a positive number', () => {
    expect(pipe.transform(42)).toBe(42);
  });

  it('should return the same value if it is a positive numeric string', () => {
    expect(pipe.transform('42')).toBe(42);
  });

  it('should return 0 for negative numbers', () => {
    expect(pipe.transform(-42)).toBe(0);
  });

  it('should return 0 for negative numeric strings', () => {
    expect(pipe.transform('-42')).toBe(0);
  });

  it('should return 0 for non-numeric strings', () => {
    expect(pipe.transform('abc')).toBe(0);
  });

  it('should return 0 for NaN values', () => {
    expect(pipe.transform(NaN)).toBe(0);
  });

  it('should return 0 for null values', () => {
    expect(pipe.transform(null as any)).toBe(0);
  });

  it('should return 0 for undefined values', () => {
    expect(pipe.transform(undefined as any)).toBe(0);
  });
});
