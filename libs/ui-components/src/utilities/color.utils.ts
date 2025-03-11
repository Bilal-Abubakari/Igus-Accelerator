export function getTextColor(backgroundColor: string): string {
  if (!backgroundColor || !/^#?[0-9A-F]{6}$/i.test(backgroundColor)) {
    return 'black';
  }

  if (backgroundColor.startsWith('#')) {
    backgroundColor = backgroundColor.slice(1);
  }

  const r = parseInt(backgroundColor.slice(0, 2), 16);
  const g = parseInt(backgroundColor.slice(2, 4), 16);
  const b = parseInt(backgroundColor.slice(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}
