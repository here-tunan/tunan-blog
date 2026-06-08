'use client';

import React, { useState } from 'react';
import { useLocale } from '@/app/i18n/locale-context';
import { Dictionary } from '@/app/i18n/get-dictionary';

interface Book {
    id: number;
    name: string;
    author: string;
    category: string;
    douban_link: string | null;
    my_review: string | null;
    score: number;
    gmt_create: string;
    gmt_modified: string;
    is_deleted: boolean;
}

const Star = ({filled}: { filled: boolean }) => {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'gold' : 'gray'} stroke="gold" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    );
};

const BookCard = ({book, dictionary}: { book: Book; dictionary: Dictionary }) => {
    const [showModal, setShowModal] = useState(false);

    const blogLink = book.my_review;

    const handleClick = () => {
        const hasBothLinks = book.douban_link && blogLink;
        if (hasBothLinks) {
            setShowModal(true);
        } else {
            const targetLink = book.douban_link || blogLink;
            if (targetLink) {
                window.open(targetLink, '_blank');
            }
        }
    };

    return (
        <>
            <div
                className="relative rounded-2xl border border-white/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-3 cursor-pointer shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                onClick={handleClick}
                title={book.name}
            >
                {blogLink && (
                    <div
                        className="absolute top-1 right-1 w-3 h-3 bg-green-500 text-white rounded-full flex items-center justify-center"
                        title={dictionary.about.reviewAvailable}>
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                        </svg>
                    </div>
                )}
                <h3 className="font-semibold text-sm truncate pr-4">{book.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</p>
                <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < book.score}/>
                    ))}
                </div>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(false);
                    }}
                >
                    <div
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-xs text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">{dictionary.about.chooseLinkTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{dictionary.about.chooseLinkDescription}</p>
                        <div className="flex flex-col space-y-3">
                            {book.douban_link &&
                                <a href={book.douban_link} target="_blank" rel="noopener noreferrer"
                                   className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                                    {dictionary.about.doubanBooks}
                                </a>
                            }
                            {blogLink &&
                                <a href={blogLink} target="_blank" rel="noopener noreferrer"
                                   className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                                    {dictionary.about.myReview}
                                </a>
                            }
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowModal(false);
                            }}
                            className="mt-6 w-full px-4 py-2 bg-transparent text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                            {dictionary.about.cancel}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default function Books({ books }: { books: Book[] }) {
    const { dictionary } = useLocale();
    const groupedBooks = books.reduce((acc: Record<string, Book[]>, book) => {
        const category = book.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(book);
        return acc;
    }, {} as Record<string, Book[]>);

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-gray-100/80 dark:border-gray-800 bg-gradient-to-br from-amber-50/60 via-white/70 to-orange-50/60 dark:from-amber-950/15 dark:via-gray-950/40 dark:to-orange-950/15 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative">
                <h3 className="font-mono font-bold text-2xl pb-6">{dictionary.about.books}</h3>
                <div className="max-h-96 overflow-y-auto pr-2">
                    <div className="space-y-6">
                        {Object.keys(groupedBooks).map(category => (
                            groupedBooks[category] && (
                                <div key={category}>
                                    <h4 className="mb-3 inline-flex rounded-full bg-white/70 dark:bg-gray-900/60 px-3 py-1 text-sm font-semibold shadow-sm border border-gray-100 dark:border-gray-800">{category}</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {groupedBooks[category].map((book, index) => (
                                            <BookCard key={index} book={book} dictionary={dictionary}/>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}