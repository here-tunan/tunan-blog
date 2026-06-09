export function formatHistoryTitle(title: string): string {
  return title
    .replace(/^博客折腾#\d+[-—–\s]*/i, '')
    .replace(/^Tinker#\d+[-—–\s]*/i, '')
    .replace(/^Blog\s*Tinker#\d+[-—–\s]*/i, '')
    .trim();
}

export function getEventIcon(title: string, eventId: number): string {
  // Extract all emojis from the title
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = title.match(emojiRegex);
  
  // If there are emojis, return the last one
  if (emojis && emojis.length > 0) {
    return emojis[emojis.length - 1];
  }
  
  // If no emoji found, use a set of random emojis based on event ID for consistency
  const fallbackEmojis = [
    '📝', '🚀', '✨', '🔧', '🎨', '📦', '🔄', '💡', 
    '🌟', '⚡', '🔥', '💎', '🎯', '🏆', '📚', '🌱',
    '🔮', '🎪', '🌈', '⭐', '🎭', '🎨', '🎪', '🎨'
  ];
  
  // Use event ID to get consistent random emoji for same event
  return fallbackEmojis[eventId % fallbackEmojis.length];
}