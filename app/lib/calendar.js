// lib/calendar.js
export async function createGoogleMeetEvent(accessToken, { summary, description, startTime, endTime }) {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            summary,
            description,
            start: { dateTime: startTime },
            end: { dateTime: endTime },
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(7),
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to create event');
    }

    const data = await res.json();
    return data.hangoutLink;
}
