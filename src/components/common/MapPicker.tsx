import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@/components/ui/Button';
import { Coords } from '@/types/common';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DraggableMarker: React.FC<{ position: Coords; onChange: (c: Coords) => void }> = ({ position, onChange }) => {
  const [pos, setPos] = useState(position);
  const markerRef = React.useRef<any>(null);

  useMapEvents({
    click(e) {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPos(p);
      onChange(p);
    }
  });

  const eventHandlers = React.useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        const p = { lat: latlng.lat, lng: latlng.lng };
        setPos(p);
        onChange(p);
      }
    }
  }), [onChange]);

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={[pos.lat, pos.lng]}
      ref={markerRef}
    >
      <Popup>Drag me to set the exact location or click on the map.</Popup>
    </Marker>
  );
};

const MapPicker: React.FC<{ initial: Coords; onConfirm: (c: Coords) => void; onCancel: () => void; height?: string }> = ({ initial, onConfirm, onCancel, height = '400px' }) => {
  const [pos, setPos] = useState<Coords>(initial);

  return (
    <div className="p-4">
      <div style={{ height }} className="rounded-md overflow-hidden mb-3">
        <MapContainer center={[initial.lat, initial.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <DraggableMarker position={initial} onChange={(c) => setPos(c)} />
        </MapContainer>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onConfirm(pos)}>Use this location</Button>
      </div>
    </div>
  );
};

export default MapPicker;
