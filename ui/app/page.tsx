import { redirect } from 'next/navigation';
import { defaultLocale } from '@/app/i18n/config';

export default function Page() {
  redirect(`/${defaultLocale}`);
}
