import React from 'react';

interface DeviceApp {
    id: number;
    name: string;
    category: string;
    description?: string;
    icon?: string;
    link?: string;
    sort_order: number;
}

export default function DevicesAndApps({ devicesAndApps }: { devicesAndApps: Record<string, DeviceApp[]> }) {

    return (
        <div>
            <h3 className="font-mono font-bold text-2xl pb-4">📱 Devices & Apps</h3>
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
        </div>
    );
}
