// lib/gamification.js

export function calculateBadge(points) {
    if (points >= 100) {
        return {
            name: 'Gold Star',
            icon: '/badges/gold.png',
            description: 'Awarded for earning 100+ points',
            level: 'gold',
        };
    }
    if (points >= 50) {
        return {
            name: 'Silver Brain',
            icon: '/badges/silver.png',
            description: 'Awarded for earning 50+ points',
            level: 'silver',
        };
    }
    if (points >= 20) {
        return {
            name: 'Bronze Book',
            icon: '/badges/bronze.png',
            description: 'Awarded for earning 20+ points',
            level: 'bronze',
        };
    }
    return null;
}
