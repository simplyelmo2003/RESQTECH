import { useState, useCallback } from 'react';
import { Coords } from '@/types/common';

interface GeolocationState {
  location: Coords | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: null, loading: false, error: 'Geolocation is not supported by your browser.' });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'An unknown error occurred.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Geolocation permission denied. Please enable location services.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
      }
      setState({ location: null, loading: false, error: errorMessage });
    };

    // Options for geolocation
    const options: PositionOptions = {
      enableHighAccuracy: true, // Request the best possible results
      timeout: 10000,           // Maximum time in milliseconds to wait for a location
      maximumAge: 0             // Don't use a cached position
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  return { ...state, getLocation };
};