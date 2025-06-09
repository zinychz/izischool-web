export function getLocalizedTextWithInfo(
  value: { localized: Record<string, string> } | string,
  lang: string
): { text: string; usedLang: string; fallback: boolean } {
  if (typeof value === 'string') {
    return { text: value, usedLang: 'plain', fallback: false };
  }

  if (!value || !value.localized) {
//    return { text: '', usedLang: '', fallback: true };
    return { text: '', usedLang: '', fallback: false };
  }

  if (value.localized[lang]) {
    return { text: value.localized[lang], usedLang: lang, fallback: false };
  }

  const availableLangs = Object.keys(value.localized);
  if (availableLangs.length > 0) {
    const firstLang = availableLangs[0];
    return {
      text: value.localized[firstLang],
      usedLang: firstLang,
      fallback: true,
    };
  }

//  return { text: '', usedLang: '', fallback: true };
  return { text: '', usedLang: '', fallback: false };
}
