'use client'

import Link from 'next/link';
import { useLocale } from '@/app/i18n/locale-context';

interface PaginationProps {
  basePath: string;
  currentPage: number;
  hasNextPage: boolean;
}

export default function Pagination({ basePath, currentPage, hasNextPage }: PaginationProps) {
  const { dictionary } = useLocale();

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-5">
      <div className="flex w-0 flex-1">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
            </svg>
            {dictionary.pagination.previous}
          </Link>
        ) : (
          <div /> // Empty div to maintain layout
        )}
      </div>

      <span className="hidden font-mono text-xs text-muted-foreground md:inline">
        {dictionary.pagination.page} {currentPage}
      </span>

      <div className="flex w-0 flex-1 justify-end">
        {hasNextPage && (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {dictionary.pagination.next}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
