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
}

function formatShortDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid';
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (error) {
    return 'Invalid';
  }
}

import { getEventIcon } from './utils';

export default function HistoryHorizontalTimeline({ events }: HistoryHorizontalTimelineProps) {
  if (events.length === 0) {
    return null; // Don't render if no events
  }

  // Sort events by date (oldest first for timeline flow, left to right) and take only the last 10 (most recent)
  const sortedEvents = [...events].sort((a, b) => new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime());
  // Take the last 10 events (most recent ones) 
  const displayEvents = sortedEvents.slice(-10);

  return (
    <div className="relative">
      {/* Horizontal scrollable container */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500"></div>
        
        {/* Events container with custom scrollbar */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 gap-6 scroll-smooth scrollbar-none">
            {displayEvents.map((event, index) => (
              <div key={event.id} className="flex-shrink-0 flex flex-col items-center w-48">
                {/* Date above timeline */}
                <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-4 text-center">
                  {formatShortDate(event.gmtCreate)}
                </div>
                
                {/* Timeline node */}
                <div className="w-12 h-12 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-4 border-orange-400 hover:border-orange-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl mb-4 hover:scale-110 transition-all duration-300 hover:rotate-12">
                  <span className="text-xl">{getEventIcon(event.title, event.id)}</span>
                </div>
                
                {/* Event card - simplified */}
                <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-gray-800/90 dark:to-gray-750/90 backdrop-blur-sm border border-orange-200/60 dark:border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 w-full group-hover:border-orange-300/80 dark:group-hover:border-gray-500/60">
                  {/* Title only */}
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 text-center">
                    <a 
                      href={`/blog/${event.slug}`} 
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {event.title}
                    </a>
                  </h4>
                </div>
              </div>
            ))}
          </div>
          
          {/* Elegant scroll indicators */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/60 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Subtle scroll hint dots */}
          <div className="flex justify-center mt-2 space-x-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-orange-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}