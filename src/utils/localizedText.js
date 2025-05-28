import { getLang, DEFAULT_LANG } from '../locale';

export const getLocalizedText = (value, lang) => {
  if (!value || typeof value !== 'object' || !value.localized) {
    return '';
  }

  const localized = value.localized;
//  const lang = getLang();

  // Попытка взять по текущему языку
  if (localized[lang]) {
    return localized[lang];
  }

  // Если есть только один вариант — используем его
  const values = Object.values(localized);
  if (values.length === 1) {
    return values[0];
  }

  // Если есть дефолтный — используем его
  if (localized[DEFAULT_LANG]) {
    return localized[DEFAULT_LANG];
  }

  // Взять первый доступный (можно поменять логику)
  return values[0] || '';
};
