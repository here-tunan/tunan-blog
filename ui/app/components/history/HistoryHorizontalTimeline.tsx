import Link from 'next/link';
import { Locale } from '@/app/i18n/config';
import { formatDate } from '@/app/i18n/format';
import { withLocale } from '@/app/i18n/routes';
import { formatHistoryTitle, getEventIcon } from './utils';

interface HistoryEvent {
  id: number;
  title: string;
  content: string;
  slug: string;
  gmtCreate: string;
  tagNames: string[];
}

interface HistoryHorizontalTimelineProps {
  events: HistoryEvent[];
  locale: Locale;
}

export default function HistoryHorizontalTimeline({ events, locale }: HistoryHorizontalTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  const displayEvents = [...events]
    .sort((a, b) => new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime())
    .slice(-5);

  return (
    <div className="relative">
      <style>{`
        @keyframes history-wave-flow {
          0% { transform: translateX(-35%) scaleX(0.65); opacity: 0; }
          15% { opacity: 0.95; }
          70% { opacity: 0.95; }
          100% { transform: translateX(135%) scaleX(0.95); opacity: 0; }
        }
        .history-wave-flow {
          animation: history-wave-flow 2.6s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }
      `}</style>
      <div className="relative">
        <div className="absolute top-14 left-0 right-3 hidden h-0.5 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 sm:block">
          <span className="history-wave-flow absolute -inset-y-2 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-sm"></span>
          <span className="history-wave-flow absolute -inset-y-1 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-80" style={{ animationDelay: '0.18s' }}></span>
        </div>
        <div className="absolute top-[3.27rem] right-0 hidden h-2.5 w-2.5 rotate-45 border-r-2 border-t-2 border-purple-500 sm:block"></div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {displayEvents.map((event) => (
            <Link key={event.id} href={withLocale(locale, `/blog/${event.slug}`)} className="group flex flex-col items-center text-center">
              <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-4">
                {formatDate(event.gmtCreate, locale, { month: 'short', year: 'numeric' })}
              </div>

              <div className="w-12 h-12 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-4 border-orange-400 hover:border-orange-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl mb-4 hover:scale-110 transition-all duration-300 hover:rotate-12 z-10">
                <span className="text-xl">{getEventIcon(event.title, event.id)}</span>
              </div>

              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-gray-800/90 dark:to-gray-750/90 backdrop-blur-sm border border-orange-200/60 dark:border-gray-600/40 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] w-full">
                <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 line-clamp-2 text-center min-h-[2rem]">
                  {formatHistoryTitle(event.title)}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
