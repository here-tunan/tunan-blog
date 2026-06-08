import { Locale } from './config';
import { en } from './dictionaries/en';
import { zhCN } from './dictionaries/zh-CN';

const dictionaries = {
  en,
  'zh-CN': zhCN,
};

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
