import Link from 'next/link';

interface PaginationProps {
  basePath: string;
  currentPage: number;
  hasNextPage: boolean;
}

export default function Pagination({ basePath, currentPage, hasNextPage }: PaginationProps) {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0 mt-8 pt-4">
      <div className="-mt-px flex w-0 flex-1">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
            </svg>
            Previous
          </Link>
        ) : (
          <div /> // Empty div to maintain layout
        )}
      </div>

      <div className="hidden md:-mt-px md:flex">
        <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Page {currentPage}
        </span>
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {hasNextPage && (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Next
            <svg className="ml-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
