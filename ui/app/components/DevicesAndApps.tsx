'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';

interface DeviceApp {
    id: number;
    name: string;
    category: string;
    description?: string;
    icon?: string;
    link?: string;
    sort_order: number;
}

export default function DevicesAndApps() {
    const [devicesAndApps, setDevicesAndApps] = useState<Record<string, DeviceApp[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeviceApps();
    }, []);

    const fetchDeviceApps = async () => {
        try {
            const response = await fetch(`${API_URL}/device-app/grouped`);
            if (!response.ok) {
                throw new Error('Failed to fetch device apps');
            }
            const data = await response.json();
            setDevicesAndApps(data);
        } catch (error) {
            console.error('Error fetching device apps:', error);
            // Fallback to default data if fetch fails
            setDevicesAndApps({
                'Hardware': [
                    {id: 1, name: 'Macbook Pro 2021', category: 'Hardware', sort_order: 0},
                    {id: 2, name: 'Windows PC', category: 'Hardware', sort_order: 1},
                    {id: 3, name: 'Iphone 13', category: 'Hardware', sort_order: 2},
                    {id: 4, name: 'Airpods', category: 'Hardware', sort_order: 3},
                    {id: 5, name: 'Sony wh-1000xm5', category: 'Hardware', sort_order: 4},
                ],
                'Software': [
                    {id: 6, name: 'Notion', category: 'Software', sort_order: 0},
                    {id: 7, name: 'JetBrains 全家桶', category: 'Software', sort_order: 1},
                    {id: 8, name: '🎧 网易云音乐', category: 'Software', sort_order: 2},
                    {id: 9, name: '🤖 ChatGPT', category: 'Software', sort_order: 3},
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading devices & apps...</div>;
    }

    return (
        <div className="max-w-none">
            {Object.entries(devicesAndApps).map(([category, items]) => (
                <div key={category} className="mt-4">
                    <h4 className="font-semibold text-base mb-2 text-gray-700 dark:text-gray-300">{category}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                        {items.map((item) => (
                            <div key={item.id} className="p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:shadow-sm transition-shadow">
                                {item.link ? (
                                    <a 
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 no-underline hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                                    >
                                        {item.icon && <span className="text-sm">{item.icon}</span>}
                                        <span className="truncate">{item.name}</span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-1 text-sm">
                                        {item.icon && <span className="text-sm">{item.icon}</span>}
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                )}
                                {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
