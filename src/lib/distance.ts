import { Coords } from '@/types/common';

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 * @param coord1 - First coordinate (user location)
 * @param coord2 - Second coordinate (evacuation center)
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coords, coord2: Coords): number => {
  // Validate inputs - ensure numbers
  const lat1 = Number(coord1.lat);
  const lng1 = Number(coord1.lng);
  const lat2 = Number(coord2.lat);
  const lng2 = Number(coord2.lng);

  if (!isFinite(lat1) || !isFinite(lng1) || !isFinite(lat2) || !isFinite(lng2)) return 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Calculate distance in meters between two coordinates
 * Useful when you need higher precision or want to display meters.
 */
export const calculateDistanceMeters = (coord1: Coords, coord2: Coords): number => {
  return calculateDistance(coord1, coord2) * 1000;
};

/**
 * Find the nearest evacuation center to user location
 * @param userLocation - User's current location
 * @param centers - Array of evacuation centers
 * @returns The nearest evacuation center
 */
export const findNearestCenter = (userLocation: Coords, centers: Array<{ location: Coords }>) => {
  if (centers.length === 0) return null;

  let nearest = centers[0];
  let minDistance = calculateDistance(userLocation, centers[0].location);

  for (let i = 1; i < centers.length; i++) {
    const distance = calculateDistance(userLocation, centers[i].location);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = centers[i];
    }
  }

  return { center: nearest, distance: minDistance };
};
