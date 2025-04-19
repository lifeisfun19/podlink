// File: lib/utils/badges.js

export const allBadges = [
    {
        id: 'first-match',
        name: 'First Match!',
        description: 'Successfully matched with your first study partner.',
        icon: '/assets/badges/first-match.png'
    },
    {
        id: 'offline-search',
        name: 'Offline Explorer',
        description: 'Used offline map to find a study buddy.',
        icon: '/assets/badges/offline-search.png'
    }
];

export function getBadgeMeta(badgeId) {
    return allBadges.find(b => b.id === badgeId);
}
