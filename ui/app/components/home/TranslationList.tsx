import { Locale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { TranslationItem } from "./TranslationItem";

type Translation = {
  slug: string,
  title: string,
  gmtCreate: string,
  tagNames: string[],
}

interface TranslationListProps {
  translations: Translation[];
  locale: Locale;
}

export default function TranslationList({translations, locale}: TranslationListProps) {
  return (
    <ul className="divide-y divide-purple-100 dark:divide-purple-800/30 bg-gradient-to-r from-purple-50/30 to-transparent dark:from-purple-950/10 rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
      {translations.map((item, i) => (
        <TranslationItem link={withLocale(locale, `/blog/${item.slug}`)} name={item.title} gmtCreate={item.gmtCreate} tagNames={item.tagNames} locale={locale} key={i}></TranslationItem>
      ))}
    </ul>
  );
}