import { Locale } from './config';

export function formatDate(
  dateString: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
) {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '';
  }
}
