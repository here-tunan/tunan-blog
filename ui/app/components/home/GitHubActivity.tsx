import React from 'react';

const API_URL = 'https://api.github.com/graphql';

interface ContributionDay {
    contributionCount: number;
    date: string;
    weekday: number;
}

interface Week {
    contributionDays: ContributionDay[];
}

interface ContributionData {
    user: {
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number;
                weeks: Week[];
            };
        };
    };
}

async function getGitHubContributionData(): Promise<ContributionData | null> {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username || !token || token === 'YOUR_GITHUB_TOKEN') {
        console.error('GitHub username or token is not configured for contribution graph.');
        return null;
    }

    const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {userName: username}
            }),
            next: {revalidate: 3600}, // Revalidate every hour
        });

        if (!response.ok) {
            console.error(`GitHub GraphQL API failed: ${response.statusText}`);
            return null;
        }

        const result = await response.json();
        if (result.errors) {
            console.error('GitHub GraphQL API errors:', result.errors);
            return null;
        }
        return result.data;
    } catch (error) {
        console.error('Failed to fetch GitHub contribution data:', error);
        return null;
    }
}

const getColor = (count: number) => {
    if (count === 0) return '#ebedf0'; // bg-gray-200
    if (count < 3) return '#9be9a8';  // bg-green-200
    if (count < 6) return '#40c463';  // bg-green-400
    if (count < 10) return '#30a14e'; // bg-green-600
    return '#216e39';                 // bg-green-800
};

const DAY_SIZE = 12;
const DAY_MARGIN = 2;
const WEEK_WIDTH = DAY_SIZE + DAY_MARGIN;

export default async function GitHubActivity() {
    const data = await getGitHubContributionData();

    if (!data) {
        return null;
    }

    const {weeks} = data.user.contributionsCollection.contributionCalendar;
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <section className="section">
            <h3 className="font-mono font-bold text-2xl pb-4">👨‍💻 GitHub Activity</h3>

            <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 p-4">
                <svg
                    width="100%"
                    viewBox={`0 0 ${weeks.length * WEEK_WIDTH} ${7 * WEEK_WIDTH + 20}`}
                    className="min-w-full"
                >
                    <g transform="translate(0, 20)">
                        {weeks.map((week, weekIndex) => (
                            <g key={weekIndex} transform={`translate(${weekIndex * WEEK_WIDTH}, 0)`}>
                                {week.contributionDays.map(day => (
                                    day && (
                                        <rect
                                            key={day.date}
                                            width={DAY_SIZE}
                                            height={DAY_SIZE}
                                            x={0}
                                            y={day.weekday * WEEK_WIDTH}
                                            fill={getColor(day.contributionCount)}
                                            rx={2}
                                            ry={2}
                                        >
                                            <title>{`${day.contributionCount} contributions on ${day.date}`}</title>
                                        </rect>
                                    )
                                ))}
                            </g>
                        ))}
                    </g>
                    <g transform="translate(0, 20)">
                        {weekDays.map((day, index) => (
                            index % 2 !== 0 && (
                                <text
                                    key={day}
                                    x={-10}
                                    y={index * WEEK_WIDTH + 10}
                                    dy="0.3em"
                                    className="text-xs fill-current text-gray-500 dark:text-gray-400"
                                    style={{textAnchor: 'end'}}
                                >
                                    {day}
                                </text>
                            )
                        ))}
                    </g>
                </svg>
                <div className="flex justify-end items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Less</span>
                    <svg width="80" height="12" className="mx-2">
                        <rect width="12" height="12" x="0" fill="#ebedf0" rx="2" ry="2"></rect>
                        <rect width="12" height="12" x="16" fill="#9be9a8" rx="2" ry="2"></rect>
                        <rect width="12" height="12" x="32" fill="#40c463" rx="2" ry="2"></rect>
                        <rect width="12" height="12" x="48" fill="#30a14e" rx="2" ry="2"></rect>
                        <rect width="12" height="12" x="64" fill="#216e39" rx="2" ry="2"></rect>
                    </svg>
                    <span>More</span>
                </div>
            </div>
        </section>
    );
}
