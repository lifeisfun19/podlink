export function generateMeetLink() {
    const random = Math.random().toString(36).substring(2, 7);
    return `https://meet.google.com/${random}`;
}
