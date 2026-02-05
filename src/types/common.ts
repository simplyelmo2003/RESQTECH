import { LatLngTuple } from 'leaflet';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Coords {
  lat: number;
  lng: number;
}

export type MapCenter = LatLngTuple; // [latitude, longitude]

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // milliseconds
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}