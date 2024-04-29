import type { StyckDetaljTitle } from '../components';

/**
 * @description Get the prefered language from the browser.
 */
export function browserLanguage(): 'sv' | 'en' {
  const { language } = (window as any).navigator as Navigator;
  if (language.match('sv')) return 'sv';
  else return 'en';
}

export function createButtonId(title: StyckDetaljTitle) {
  return `hk-${title.toLowerCase()}-button`;
}

export function createTabId(title: StyckDetaljTitle) {
  return `hk-${title.toLowerCase()}-tab`;
}
