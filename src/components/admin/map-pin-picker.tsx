'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapPinPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

const MANILA = { lat: 14.5995, lng: 120.9842 };

export function MapPinPicker({ latitude, longitude, onChange }: MapPinPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const placeMarker = useCallback((position: google.maps.LatLngLiteral) => {
    if (!googleMapRef.current) return;

    if (markerRef.current) {
      markerRef.current.position = position;
    } else {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: googleMapRef.current,
        position,
        gmpDraggable: true,
      });

      marker.addListener('dragend', () => {
        const pos = marker.position;
        if (pos) {
          const lat = typeof pos.lat === 'function' ? pos.lat() : (pos.lat as number);
          const lng = typeof pos.lng === 'function' ? pos.lng() : (pos.lng as number);
          onChangeRef.current(lat, lng);
        }
      });

      markerRef.current = marker;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    loader.importLibrary('maps').then(async () => {
      await google.maps.importLibrary('marker');

      if (!mapRef.current) return;

      const hasCoords = latitude !== null && longitude !== null;
      const center = hasCoords ? { lat: latitude!, lng: longitude! } : MANILA;
      const zoom = hasCoords ? 15 : 6;

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: 'massage-ph-map',
      });

      googleMapRef.current = map;

      if (hasCoords) {
        placeMarker(center);
      }

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        placeMarker({ lat, lng });
        onChangeRef.current(lat, lng);
      });
    });

    return () => {
      markerRef.current = null;
      googleMapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-700">Location</h3>
      <p className="text-sm text-slate-500">
        Click on the map to place a pin, or drag it to adjust.
      </p>
      <div ref={mapRef} className="h-72 rounded-lg border border-gray-300" />
      {latitude !== null && longitude !== null && (
        <p className="text-xs text-slate-500">
          Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
