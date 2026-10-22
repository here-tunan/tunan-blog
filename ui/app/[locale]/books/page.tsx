import React from "react";
import Bookshelf from "@/app/components/Bookshelf";
import { API_URL } from "@/lib/config";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

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

async function getBooks(): Promise<Book[]> {
    try {
        const response = await fetch(`${API_URL}/book/list`, {
            method: 'GET',
            next: { revalidate: 3600 },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);
    return { title: `${dictionary.booksPage.title} · Tunan` };
}

export default async function BooksPage({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);
    const books = await getBooks();

    return (
        <main>
            <div className="container">
                <header className="mb-10">
                    <h1 className="font-display text-3xl text-foreground md:text-4xl">
                        {dictionary.booksPage.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {dictionary.booksPage.description}
                    </p>
                    <div className="mt-5 h-px w-12 bg-border" />
                </header>

                <Bookshelf books={books} />
            </div>
        </main>
    );
}
