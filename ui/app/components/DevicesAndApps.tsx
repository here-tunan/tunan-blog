const devicesAndApps = {
    'Hardware': [
        {name: 'Macbook Pro 2021'},
        {name: 'Windows PC'},
        {name: 'Iphone 13'},
        {name: 'Airpods'},
        {name: 'Sony wh-1000xm5'},
        {name: 'Logi master 3s'},
        {name: 'Logi master 2s'},
        {name: 'Cherry机械键盘'},
        {name: '京东京造K8机械键盘'},
        {name: '尼康Z5相机'},
    ],
    'Software': [
        {name: 'Notion'},
        {name: 'JetBrains 全家桶'},
        {name: '🎧 网易云音乐'},
        {name: '🤖 ChatGPT'},
        {name: 'Discord'},
        {name: 'Folo'},
        {name: 'Google'},
        {name: 'Arc'},
        {name: '🤖 Gemini-CLI'},
        {name: '🤖 Jetbrains Junie'},
        {name: 'ApiFox'},
        {name: 'Netflix'},
        {name: 'BiliBili'},
        {name: 'Youtube'},
        {name: 'Typora'},
        {name: 'Xmind'},
        {name: 'Anki'},
        {name: 'ClashVerge'},
        {name: '🎮 CS2'},
        {name: '🎮 Stardew Valley'},
    ],
};

export default function DevicesAndApps() {
    return (
        <div className="prose dark:prose-invert max-w-none">
            {Object.entries(devicesAndApps).map(([category, items]) => (
                <div key={category} className="mt-6">
                    <h3 className="font-bold text-lg mb-3">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
