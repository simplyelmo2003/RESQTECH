import React, { useState, useEffect } from 'react';
import LeafletMap from '@/components/common/LeafletMap';
import { EvacuationCenter, EvacCenterStatus, EvacCenterService } from '@/types/guest';
import { getEvacuationCenters } from '@/api/guest';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

import { useGeolocation } from '@/hooks/useGeolocation';
import { findNearestCenter } from '@/lib/distance';
import L from 'leaflet'; // Import L for Leaflet objects

// Custom marker for evacuation centers
const evacCenterIcon = new L.Icon({
  iconUrl: '/icons/evac-center-marker.png',
  iconRetinaUrl: '/icons/evac-center-marker.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -25],
});

const EvacuationCenterLocator: React.FC = () => {
    const [centers, setCenters] = useState<EvacuationCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCenter, setSelectedCenter] = useState<EvacuationCenter | null>(null);
    const [showRouting, setShowRouting] = useState<boolean>(false);
    const [filteredCenters, setFilteredCenters] = useState<EvacuationCenter[]>([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'' | EvacCenterStatus>('');
    const [serviceFilter, setServiceFilter] = useState<'' | EvacCenterService>('');

    const { location: userLocation, loading: userLocationLoading, error: userLocationError, getLocation } = useGeolocation();

    const fetchCenters = async () => {
        try {
            setLoading(true);
            const data = await getEvacuationCenters();
            console.log('📍 EvacuationCenterLocator received centers:', data.length);
            data.forEach((c, i) => {
                console.log(`  [${i+1}] ${c.id} - ${c.name} - Status: ${c.status} - Coords: ${c.location.lat}, ${c.location.lng}`);
            });
            setCenters(data);
            setFilteredCenters(data);
        } catch (err) {
            console.error("Failed to fetch evacuation centers:", err);
            setError("Failed to load evacuation centers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenters();
        getLocation(); // Get user location on component mount

        // Listen for storage changes (when admin/barangay creates/updates centers in another tab or component)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'SHARED_EVAC_CENTERS_V1') {
                console.log('🔄 Detected storage change in evacuation centers, refetching...');
                fetchCenters();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [getLocation]);

    useEffect(() => {
        let updatedCenters = centers;

        if (searchQuery) {
            updatedCenters = updatedCenters.filter(center =>
                center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                center.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            updatedCenters = updatedCenters.filter(center => center.status === statusFilter);
        }

        if (serviceFilter) {
            updatedCenters = updatedCenters.filter(center => center.services.includes(serviceFilter));
        }

        setFilteredCenters(updatedCenters);
    }, [searchQuery, statusFilter, serviceFilter, centers]);


    const handleGoDirection = (center: EvacuationCenter) => {
        setSelectedCenter(center);
        setShowRouting(true);
        if (!userLocation) {
          getLocation(); // Try to get location if not already available
        }
    };

    const handleClearDirection = () => {
        setSelectedCenter(null);
        setShowRouting(false);
    }

    const availableStatuses = [
        { value: 'Open', label: 'Open' },
        { value: 'Full', label: 'Full' },
        { value: 'Closed', label: 'Closed', disabled: true }, // Guest view doesn't show closed, but might be good for filter
    ];

    const availableServices = [
        { value: 'Water', label: 'Water' },
        { value: 'Medical', label: 'Medical' },
        { value: 'Food', label: 'Food' },
        { value: 'Power', label: 'Power' },
    ];


    const mapMarkers = filteredCenters.map(center => {
        console.log(`📍 Marker for ${center.name}: lat=${center.location.lat}, lng=${center.location.lng}`);
        return {
            id: center.id,
            position: center.location,
            popupContent: (
                <div>
                <h3 className="text-md font-semibold">{center.name}</h3>
                <p className="text-sm">{center.address}</p>
                <p className="text-xs">Capacity: {center.currentOccupancy}/{center.capacity}</p>
                <p className="text-xs">Status: <span className={`font-medium ${center.status === 'Open' ? 'text-accent' : center.status === 'Full' ? 'text-danger' : 'text-gray-500'}`}>{center.status}</span></p>
                <p className="text-xs">Contact: {center.contact}</p>
                <p className="text-xs">Services: {center.services.length > 0 ? center.services.join(', ') : 'None'}</p>
                <Button size="sm" variant="primary" className="mt-2 w-full" onClick={() => handleGoDirection(center)}>
                    Go Direction
                </Button>
                </div>
            ),
            icon: evacCenterIcon,
        };
    });


    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-danger h-96 flex items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }


    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
                <Input
                    id="search"
                    placeholder="Search by name or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-0"
                />
                <Select
                    id="statusFilter"
                    options={availableStatuses}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as EvacCenterStatus | '')}
                    placeholder="Filter by status"
                    className="mb-0"
                />
                <Select
                    id="serviceFilter"
                    options={availableServices}
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value as EvacCenterService | '')}
                    placeholder="Filter by service"
                    className="mb-0"
                />
                <Button
                    variant="primary"
                    onClick={() => {
                        if (userLocation) {
                            const nearest = findNearestCenter(userLocation, filteredCenters);
                            if (nearest) {
                                handleGoDirection(nearest.center as EvacuationCenter);
                            }
                        } else {
                            getLocation();
                        }
                    }}
                    disabled={filteredCenters.length === 0 || userLocationLoading}
                    className="mb-0"
                >
                    {userLocationLoading ? 'Getting Location...' : '📍 Find Nearest'}
                </Button>
            </div>

            {showRouting && selectedCenter && userLocationError && (
              <div className="bg-danger text-white p-3 rounded-md mb-4 text-sm">
                Error getting your location for directions: {userLocationError}. Please enable location services or try again.
                <Button variant="ghost" onClick={handleClearDirection} className="ml-4 text-white hover:text-gray-200">Clear Directions</Button>
              </div>
            )}

            <div className="relative rounded-lg shadow-md">
                <LeafletMap
                    center={selectedCenter?.location || userLocation || { lat: 9.7785, lng: 125.4944 }} // Default to Surigao City
                    zoom={selectedCenter || userLocation ? 14 : 11}
                    markers={mapMarkers}
                    showUserLocation={true}
                    showRouting={showRouting && !!selectedCenter && !!userLocation}
                    destination={showRouting && selectedCenter ? selectedCenter.location : null}
                    mapHeight="600px" // Increased map height for better visibility
                    panToUserLocation={true}
                />
                {showRouting && selectedCenter && (
                    <div className="absolute top-4 left-4 z-[900] bg-white p-4 rounded-lg shadow-lg">
                        <h4 className="font-bold text-md mb-2">Directions To:</h4>
                        <p className="text-sm font-semibold">{selectedCenter.name}</p>
                        <p className="text-xs text-gray-600">{selectedCenter.address}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full"
                            onClick={handleClearDirection}
                        >
                            Clear Directions
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-dark mb-4">Available Evacuation Centers ({filteredCenters.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters.map(center => {
                        const isBarangayCreated = center.id.startsWith('ec-');
                        return (
                        <Card key={center.id} className="p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-dark">{center.name}</h4>
                                {isBarangayCreated && (
                                    <span className="bg-brand-navy-light/10 text-brand-navy text-xs font-semibold px-2 py-1 rounded-full border border-brand-navy-light/40">
                                        🏛️ Barangay
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{center.address}</p>
                            <p className="text-xs text-gray-500">Contact: {center.contact}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    center.status === 'Open' ? 'bg-accent text-white' :
                                    center.status === 'Full' ? 'bg-danger text-white' :
                                    'bg-gray-300 text-dark'
                                }`}>
                                    {center.status}
                                </span>
                                <span className="text-sm font-medium text-dark">
                                    {center.currentOccupancy}/{center.capacity}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                                Services: {center.services.length > 0 ? center.services.join(', ') : 'N/A'}
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="mt-4 w-full"
                                onClick={() => handleGoDirection(center)}
                                disabled={userLocationLoading}
                                isLoading={userLocationLoading && !userLocation && showRouting && selectedCenter?.id === center.id}
                            >
                                {userLocationLoading && showRouting && selectedCenter?.id === center.id ? 'Getting Location...' : '🗺️ Get Directions'}
                            </Button>
                        </Card>
                        );
                    })}
                </div>
                {filteredCenters.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">No evacuation centers match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default EvacuationCenterLocator;