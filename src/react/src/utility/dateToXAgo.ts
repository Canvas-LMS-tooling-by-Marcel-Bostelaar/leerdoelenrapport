export function DateToTimeAgo(date: Date): string {
    if (date <= new Date(0)) {
        return "Never";
    }
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000); 
    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    }
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} minutes ago`;
    }
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
    }
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo} days ago`;
    }
    if (daysAgo < 30) {
        const weeksAgo = Math.floor(daysAgo / 7);
        return `${weeksAgo} weeks ago`;
    }
    if (daysAgo < 365) {
        const monthsAgo = Math.floor(daysAgo / 30);
        return `${monthsAgo} months ago`;
    }
    
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} years ago`;
}