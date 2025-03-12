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

  it('should return "black" for invalid color codes instead of throwing an error', () => {
    expect(getTextColor('#GGGGGG')).toBe('black');
    expect(getTextColor('XYZ')).toBe('black');
    expect(getTextColor('#1234')).toBe('black');
    expect(getTextColor('')).toBe('black');
    expect(getTextColor(null as unknown as string)).toBe('black');
    expect(getTextColor(undefined as unknown as string)).toBe('black');
  });
});
