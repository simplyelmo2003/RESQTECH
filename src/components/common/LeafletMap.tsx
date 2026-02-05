import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Coords } from '@/types/common';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useGeolocation } from '@/hooks/useGeolocation';

// Extend L.Icon.Default with default marker images
// This is a common fix for broken marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker for user's current location (blue circle)
const userLocationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Use CircleMarker for evacuation centers instead of Icon
const evacCenterMarkerConfig = {
  radius: 8,
  fillColor: '#ef4444',
  color: '#dc2626',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8
};

interface LeafletMapProps {
  center?: Coords;
  zoom?: number;
  markers?: { id: string; position: Coords; popupContent: React.ReactNode; icon?: Icon }[];
  onMapClick?: (coords: Coords) => void;
  showUserLocation?: boolean;
  showRouting?: boolean;
  destination?: Coords | null;
  mapHeight?: string;
  panToUserLocation?: boolean; // If true, map will pan to user location once found
}

// Component to handle routing
const RoutingMachine: React.FC<{ map: L.Map; userLocation: Coords; destination: Coords }> = ({ map, userLocation, destination }) => {
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (userLocation && destination) {
      const waypoints = [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ];

      try {
      routingControlRef.current = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          showAlternatives: false,
          addWaypoints: false,
          position: 'topright',
          collapsible: true,
          fitSelectedRoutes: true,
          showAdvancedOptions: false,
          show: false, // Hide the instruction summary panel
          lineOptions: {
              styles: [{ color: '#06B6D4', weight: 4, opacity: 0.8 }]
          } as any,
          altLineOptions: {
              styles: [{ color: 'gray', weight: 2, opacity: 0.5 }]
          } as any,
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
          }),
          createMarker: function(_i: any, waypoint: any, _n: any) {
            return L.marker(waypoint.latLng, { icon: userLocationIcon });
          }
        } as any).addTo(map);

        // Fit map to route bounds
        if (routingControlRef.current) {
          routingControlRef.current.on('routesfound', function(e: any) {
            try {
              const routes = e.routes;
              if (routes.length > 0) {
                const bbox = (L as any).Routing.overview(routes[0].coordinates);
                map.fitBounds(bbox, { padding: [100, 100] });
              }
            } catch (err) {
              console.error('Error fitting bounds:', err);
            }
          });

          routingControlRef.current.on('routingerror', function(e: any) {
            console.error('Routing error:', e);
          });
        }
      } catch (err) {
        console.error('Error creating routing control:', err);
      }
    }

    return () => {
      if (routingControlRef.current && map) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (err) {
          console.error('Error removing control:', err);
        }
      }
    };

  }, [map, userLocation, destination]);

  return null;
};


// Component for handling map click events
const MapClickListener: React.FC<{ onMapClick?: (coords: Coords) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};


const LeafletMap: React.FC<LeafletMapProps> = ({
  center = { lat: 12.8797, lng: 121.7740 }, // Default to Philippines
  zoom = 6,
  markers = [],
  onMapClick,
  showUserLocation = false,
  showRouting = false,
  destination = null,
  mapHeight = '400px',
  panToUserLocation = false,
}) => {
  const { location: userGeoLocation, loading: geoLoading, error: geoError, getLocation } = useGeolocation();
  const [firstLocationFound, setFirstLocationFound] = useState(false);

  useEffect(() => {
    // Attempt to get user location on mount if requested
    if (showUserLocation && !userGeoLocation && !geoError) {
      getLocation();
    }
  }, [showUserLocation, userGeoLocation, geoError, getLocation]);

  const memoizedMarkers = useMemo(() => {
    let allMarkers = [...markers];
    console.log('🗺️ LeafletMap: memoizedMarkers - received', markers.length, 'markers');
    if (showUserLocation && userGeoLocation) {
        allMarkers.push({
            id: 'user-location',
            position: userGeoLocation,
            popupContent: (
                <div>
                    <h3 className="font-semibold">Your Current Location</h3>
                    <p>Latitude: {userGeoLocation.lat.toFixed(4)}</p>
                    <p>Longitude: {userGeoLocation.lng.toFixed(4)}</p>
                </div>
            ),
            icon: userLocationIcon,
        });
    }
    console.log('🗺️ LeafletMap: memoizedMarkers - total', allMarkers.length, 'markers after adding user location');
    return allMarkers;
}, [markers, showUserLocation, userGeoLocation]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      className="rounded-lg"
      style={{ height: mapHeight, width: '100%', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        minZoom={2}
        crossOrigin={true}
        errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      />

      <MapContentHandler 
        memoizedMarkers={memoizedMarkers}
        onMapClick={onMapClick}
        showRouting={showRouting}
        userGeoLocation={userGeoLocation}
        destination={destination}
        panToUserLocation={panToUserLocation}
        firstLocationFound={firstLocationFound}
        setFirstLocationFound={setFirstLocationFound}
        showUserLocation={showUserLocation}
        geoLoading={geoLoading}
        geoError={geoError}
        center={center}
        zoom={zoom}
      />
    </MapContainer>
  );
};

// Separate component for content inside MapContainer (can use useMap)
const MapContentHandler: React.FC<{
  memoizedMarkers: any[];
  onMapClick?: (coords: Coords) => void;
  showRouting: boolean;
  userGeoLocation: Coords | null;
  destination: Coords | null;
  panToUserLocation: boolean;
  firstLocationFound: boolean;
  setFirstLocationFound: (value: boolean) => void;
  showUserLocation: boolean;
  geoLoading: boolean;
  geoError: string | null;
  center: Coords;
  zoom: number;
}> = ({
  memoizedMarkers,
  onMapClick,
  showRouting,
  userGeoLocation,
  destination,
  panToUserLocation,
  firstLocationFound,
  setFirstLocationFound,
  showUserLocation,
  geoLoading,
  geoError,
  center,
  zoom,
}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (userGeoLocation && panToUserLocation && !firstLocationFound && map) {
      map.flyTo([userGeoLocation.lat, userGeoLocation.lng], 12); // Fly to user location with a higher zoom
      setFirstLocationFound(true);
    }
  }, [userGeoLocation, panToUserLocation, firstLocationFound, map, setFirstLocationFound]);

  return (
    <>
      {memoizedMarkers.map((marker) => {
        console.log(`🗺️ Rendering CircleMarker [${marker.id}] at [${marker.position.lat}, ${marker.position.lng}]`);
        return (
        // Use CircleMarker for evacuation centers (visual indicator instead of icon)
        <CircleMarker
          key={marker.id}
          center={[marker.position.lat, marker.position.lng]}
          {...evacCenterMarkerConfig}
        >
          <Popup>
            {marker.popupContent}
          </Popup>
        </CircleMarker>
        );
      })}
      {memoizedMarkers.length > 0 && console.log(`🗺️ Rendered ${memoizedMarkers.length} markers total`)}

      {onMapClick && <MapClickListener onMapClick={onMapClick} />}

      {showRouting && userGeoLocation && destination && (
        <RoutingMachine map={map} userLocation={userGeoLocation} destination={destination} />
      )}

      {showUserLocation && geoLoading && (
        <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-md z-[900]">
          <LoadingSpinner size='sm' className="inline-block mr-2" />
          <span className="text-sm">Getting your location...</span>
        </div>
      )}
      {showUserLocation && geoError && (
        <div className="absolute top-2 left-2 bg-danger text-white p-2 rounded-md shadow-md z-[900] text-sm">
          Error getting location: {geoError}
        </div>
      )}
    </>
  );
};

export default LeafletMap;