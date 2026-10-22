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
    <ul className="divide-y divide-border">
      {translations.map((item, i) => (
        <TranslationItem link={withLocale(locale, `/blog/${item.slug}`)} name={item.title} gmtCreate={item.gmtCreate} tagNames={item.tagNames} locale={locale} key={i}></TranslationItem>
      ))}
    </ul>
  );
}
