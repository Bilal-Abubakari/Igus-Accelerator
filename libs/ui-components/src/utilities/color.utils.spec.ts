import { getTextColor } from './color.utils';

describe('getTextColor', () => {
  it('should return "black" for light background colors', () => {
    expect(getTextColor('#FFFFFF')).toBe('black');
    expect(getTextColor('#F0F0F0')).toBe('black');
    expect(getTextColor('#FFD700')).toBe('black');
  });

  it('should return "white" for dark background colors', () => {
    expect(getTextColor('#000000')).toBe('white');
    expect(getTextColor('#333333')).toBe('white');
    expect(getTextColor('#8B0000')).toBe('white');
  });

  it('should handle edge cases correctly', () => {
    expect(getTextColor('#808080')).toBe('white');
    expect(getTextColor('#7F7F7F')).toBe('white');
    expect(getTextColor('#818181')).toBe('black');
  });

  it('should remove the "#" if present', () => {
    expect(getTextColor('FFFFFF')).toBe('black');
    expect(getTextColor('000000')).toBe('white');
  });

  it('should throw an error for invalid color codes', () => {
    expect(() => getTextColor('#GGGGGG')).toThrow();
    expect(() => getTextColor('XYZ')).toThrow();
    expect(() => getTextColor('#1234')).toThrow();
  });
});
