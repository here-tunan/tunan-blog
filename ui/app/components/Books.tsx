'use client';

import React, {useState} from 'react';

interface Book {
    blog_link: string | null; // 允许 null
    douban_link?: string | null; // 允许 null
    name: string;
    category: string;
    rating: number;
}

const books = [
    // 技术与编程
    {
        name: '代码大全',
        category: '技术与编程',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/1477390/',
        blog_link: null
    },
    {
        name: '重构',
        category: '技术与编程',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/30468597/',
        blog_link: null
    },
    {
        name: '软技能：代码之外的生存指南',
        category: '技术与编程',
        rating: 3,
        douban_link: 'https://book.douban.com/subject/26835090/',
        blog_link: null
    },

    // 思维与认知
    {
        name: '思考，快与慢',
        category: '思维与认知',
        rating: 4,
        douban_link: 'https://book.douban.com/subject/10785583/',
        blog_link: 'https://www.tunan.fun/blog/book-review-thinking-fast-and-slow'
    },
    {
        name: '情商',
        category: '思维与认知',
        rating: 4,
        douban_link: 'https://book.douban.com/subject/30181152/',
        blog_link: null
    },
    {
        name: '习惯的力量',
        category: '思维与认知',
        rating: 4,
        douban_link: 'https://book.douban.com/subject/27045616/',
        blog_link: null
    },

    // 社科与历史
    {
        name: '人类简史',
        category: '社科与历史',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/25985021/',
        blog_link: null
    },
    {
        name: '智人之上',
        category: '社科与历史',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/36924549/',
        blog_link: null
    },
    {
        name: '社会性动物',
        category: '社科与历史',
        rating: 4,
        douban_link: 'https://book.douban.com/subject/26754816/',
        blog_link: null
    },
    {
        name: '大衰退时代',
        category: '社科与历史',
        rating: 4,
        douban_link: 'https://book.douban.com/subject/33451663/',
        blog_link: null
    },

    // 个人成长
    {
        name: '亲密关系',
        category: '个人成长',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/26378692/',
        blog_link: null
    },
    {
        name: '高效能人士的七个习惯',
        category: '个人成长',
        rating: 5,
        douban_link: 'https://book.douban.com/subject/35241421/',
        blog_link: null
    },
    {
        name: '穷爸爸富爸爸',
        category: '个人成长',
        rating: 3,
        douban_link: 'https://book.douban.com/subject/3291111/',
        blog_link: null
    },
    {
        name: '活法',
        category: '个人成长',
        rating: 1,
        douban_link: 'https://book.douban.com/subject/1798929/',
        blog_link: null
    },
    {
        name: '下班后开启新的一天',
        category: '个人成长',
        rating: 2,
        douban_link: 'https://book.douban.com/subject/36021556/',
        blog_link: 'https://www.tunan.fun/blog/book-review-new-day-after-work'
    },

    // 文学与小说
    {
        name: '基督山伯爵',
        category: '文学与小说',
        rating: 3,
        douban_link: 'https://book.douban.com/subject/1046205/',
        blog_link: null
    },
    {
        name: '杀死一只知更鸟（英文版）',
        category: '文学与小说',
        rating: 3,
        douban_link: 'https://book.douban.com/subject/26879778/',
        blog_link: null
    },
];

const Star = ({filled}: { filled: boolean }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'gold' : 'gray'} stroke="gold" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    );
};

const Book = ({book}: { book: Book }) => {
    const [showModal, setShowModal] = useState(false);

    const isDev = process.env.NODE_ENV === 'development';
    const blogLink = book.blog_link && isDev
        ? book.blog_link.replace('https://www.tunan.fun', 'http://localhost:3000')
        : book.blog_link;

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
                className="relative p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                onClick={handleClick}
                title={book.name}
            >
                {blogLink && (
                    <div
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center"
                        title="有书评">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                        </svg>
                    </div>
                )}
                <h3 className="font-bold text-base truncate pr-5">{book.name}</h3>
                <div className="flex items-center mt-1.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < book.rating}/>
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
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">跳转到...</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">选择您想访问的链接：</p>
                        <div className="flex flex-col space-y-3">
                            {book.douban_link &&
                                <a href={book.douban_link} target="_blank" rel="noopener noreferrer"
                                   className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                                    豆瓣读书
                                </a>
                            }
                            {blogLink &&
                                <a href={blogLink} target="_blank" rel="noopener noreferrer"
                                   className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                                    我的书评
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
                            取消
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default function Books() {
    const groupedBooks = books.reduce((acc: Record<string, Book[]>, book) => {
        const category = book.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(book);
        return acc;
    }, {} as Record<string, Book[]>);

    const categoryOrder = [
        '技术与编程',
        '思维与认知',
        '社科与历史',
        '个人成长',
        '文学与小说',
    ];

    return (
        <div className="prose dark:prose-invert max-w-none">
            <div className="max-h-96 overflow-y-auto pr-4">
                <div className="space-y-8">
                    {categoryOrder.map(category => (
                        groupedBooks[category] && (
                            <div key={category}>
                                <h4 className="font-mono font-bold text-xl pt-4 pb-1 mb-3 border-b border-gray-200 dark:border-gray-700">{category}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {groupedBooks[category].map((book, index) => (
                                        <Book key={index} book={book}/>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}