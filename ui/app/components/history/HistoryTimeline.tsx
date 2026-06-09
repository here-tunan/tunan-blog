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

interface HistoryTimelineProps {
  events: HistoryEvent[];
  locale: Locale;
}

export default function HistoryTimeline({ events, locale }: HistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40">
        <div className="text-6xl mb-4">📜</div>
        <p className="text-muted-foreground">No history events found</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.gmtCreate).getTime() - new Date(a.gmtCreate).getTime());

  return (
    <div className="relative">
      <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gradient-to-b from-orange-400 via-red-400 to-purple-400" />

      <div className="space-y-5">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="relative flex gap-5">
            <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-gray-900 shadow-md ring-4 ring-orange-100 dark:ring-orange-950 border border-orange-100 dark:border-gray-800">
              <span className="text-lg">{getEventIcon(event.title, event.id)}</span>
            </div>

            <Link
              href={withLocale(locale, `/blog/${event.slug}`)}
              className="group relative block flex-1 overflow-hidden rounded-[1.5rem] border border-orange-100/70 dark:border-gray-800 bg-gradient-to-br from-orange-50/80 via-white/80 to-red-50/80 dark:from-orange-950/15 dark:via-gray-900/50 dark:to-red-950/15 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-300/20 blur-3xl transition-transform group-hover:scale-125" />
              <div className="relative">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-1 text-xs font-semibold">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(event.gmtCreate, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 className="line-clamp-2 font-mono text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-300">
                  {formatHistoryTitle(event.title)}
                </h3>

                {event.tagNames && event.tagNames.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {event.tagNames.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-orange-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/50 px-2 py-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
