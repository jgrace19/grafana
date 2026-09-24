const LATIN_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const ROBOTO_MONO_LATIN = 'roboto/L0xTDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vrtSM1J-gEPT5Ese6hmHSh0mQ.woff2';

/*
  To add new variations/version of Inter, download from https://rsms.me/inter/ and add the
  web font files to the public/fonts/inter folder. Do not download the fonts from Google Fonts
  or somewhere else because they don't support the features we require (like tabular numerals).

  If adding additional weights, consider switching to the InterVariable variable font as combined
  it may take less space than multiple static weights.
*/
const FONT_FACES: Array<{ family: string; file: string; style: string; weight: string; unicodeRange?: string }> = [
  { family: 'Roboto Mono', file: ROBOTO_MONO_LATIN, style: 'normal', weight: '400', unicodeRange: LATIN_RANGE },
  { family: 'Roboto Mono', file: ROBOTO_MONO_LATIN, style: 'normal', weight: '500', unicodeRange: LATIN_RANGE },
  { family: 'Inter', file: 'inter/Inter-Regular.woff2', style: 'normal', weight: '400' },
  { family: 'Inter', file: 'inter/Inter-Medium.woff2', style: 'normal', weight: '500' },
  { family: 'Inter', file: 'inter/Inter-Italic.woff2', style: 'italic', weight: '400' },
  { family: 'Inter', file: 'inter/Inter-MediumItalic.woff2', style: 'italic', weight: '500' },
];

let registered = false;

/**
 * Registers Grafana's web fonts. Done through the FontFace API rather than static `@font-face` rules because
 * the font URLs depend on the runtime public path (`window.__grafana_public_path__`, e.g. a CDN).
 */
export function registerFonts() {
  if (registered || typeof document === 'undefined' || typeof FontFace === 'undefined' || !document.fonts) {
    return;
  }
  registered = true;

  const publicPath = window.__grafana_public_path__;
  const fontRoot = publicPath ? `${publicPath}fonts/` : 'public/fonts/';
  for (const { family, file, unicodeRange, ...descriptors } of FONT_FACES) {
    const face = new FontFace(family, `url('${fontRoot}${file}') format('woff2')`, {
      ...descriptors,
      display: 'swap',
      ...(unicodeRange ? { unicodeRange } : {}),
    });
    document.fonts.add(face);
  }
}
