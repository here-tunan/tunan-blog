import React from "react";
import DevicesAndApps from "@/app/components/DevicesAndApps";
import { API_URL } from "@/lib/config";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

interface DeviceApp {
    id: number;
    name: string;
    category: string;
    description?: string;
    icon?: string;
    link?: string;
    sort_order: number;
}

async function getDevicesAndApps(): Promise<Record<string, DeviceApp[]>> {
    try {
        const response = await fetch(`${API_URL}/device-app/grouped`, {
            next: { revalidate: 3600 },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching device apps:', error);
        return {};
    }
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);
    return { title: `${dictionary.usesPage.title} · Tunan` };
}

export default async function UsesPage({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);
    const deviceApps = await getDevicesAndApps();

    return (
        <main>
            <div className="container">
                <header className="mb-10">
                    <h1 className="font-display text-3xl text-foreground md:text-4xl">
                        {dictionary.usesPage.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {dictionary.usesPage.description}
                    </p>
                    <div className="mt-5 h-px w-12 bg-border" />
                </header>

                <DevicesAndApps devicesAndApps={deviceApps} />
            </div>
        </main>
    );
}
