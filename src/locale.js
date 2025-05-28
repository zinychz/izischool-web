export const DEFAULT_LANG = 'RU';

let currentLang = DEFAULT_LANG;

export const setLang = (lang) => {
  currentLang = lang;
};

export const getLang = () => currentLang;
