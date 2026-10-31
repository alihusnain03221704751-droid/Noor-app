import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Mosque } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MosqueInteractiveMapProps {
  userLocation: { lat: number; lng: number } | null;
  mosques: Mosque[];
  selectedMosque: Mosque | null;
  onSelectMosque: (mosque: Mosque) => void;
  centerLocation: { lat: number; lng: number };
}

export const MosqueInteractiveMap: React.FC<MosqueInteractiveMapProps> = ({
  userLocation,
  mosques,
  selectedMosque,
  onSelectMosque,
  centerLocation
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLocation.lat, centerLocation.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when centerLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && centerLocation) {
      mapInstanceRef.current.setView([centerLocation.lat, centerLocation.lng], 14, {
        animate: true
      });
    }
  }, [centerLocation.lat, centerLocation.lng]);

  // Update markers when mosques or userLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. User current location pin
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-pin-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(
        `<div style="font-family: inherit; font-size: 13px; font-weight: bold; color: #1e3a8a; text-align: center;">
          ${language === 'en' ? '📍 Your Current Location' : '📍 آپ کا موجودہ مقام'}
        </div>`
      );
      markersLayer.addLayer(userMarker);
    }

    // 2. Mosque markers
    mosques.forEach((m) => {
      const isSelected = selectedMosque?.id === m.id;

      const mosqueIcon = L.divIcon({
        className: 'mosque-pin-marker',
        html: `
          <div style="
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            border-radius: 50%;
            background: ${isSelected ? '#15803d' : '#1e392c'};
            border: 2px solid ${isSelected ? '#fbbf24' : '#6ee7b7'};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="font-size: ${isSelected ? '18px' : '14px'}; line-height: 1;">🕌</span>
          </div>
        `,
        iconSize: isSelected ? [38, 38] : [30, 30],
        iconAnchor: isSelected ? [19, 19] : [15, 15]
      });

      const marker = L.marker([m.lat, m.lng], { icon: mosqueIcon });

      const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

      const popupContent = `
        <div style="min-width: 200px; max-width: 260px; font-family: inherit; padding: 2px;">
          <div style="font-weight: bold; font-size: 14px; color: #1c1917; margin-bottom: 2px;">${m.name}</div>
          ${m.nameUrdu ? `<div style="font-size: 12px; color: #15803d; font-family: 'Noto Nastaliq Urdu', serif; margin-bottom: 4px;">${m.nameUrdu}</div>` : ''}
          <div style="font-size: 11px; color: #78716c; margin-bottom: 6px;">${m.address}</div>
          ${m.distanceKm !== undefined ? `<div style="font-size: 11px; font-weight: 600; color: #047857; margin-bottom: 8px;">📏 ${m.distanceKm} km ${language === 'en' ? 'away' : 'فاصلہ'}</div>` : ''}
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a
              href="${googleMapsDirUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                flex: 1;
                display: inline-block;
                text-align: center;
                background: #15803d;
                color: #ffffff;
                text-decoration: none;
                font-size: 11px;
                font-weight: bold;
                padding: 6px 10px;
                border-radius: 8px;
              "
            >
              ${language === 'en' ? '🗺️ Directions' : '🗺️ راستہ دیکھیں'}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onSelectMosque(m);
      });

      markersLayer.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [mosques, userLocation, selectedMosque?.id, language]);

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#d9c5a5] shadow-md">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-[11px] flex items-center gap-3 text-stone-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span>{language === 'en' ? 'You' : 'آپ'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span>
          <span>{language === 'en' ? 'Mosque' : 'مسجد'}</span>
        </div>
      </div>
    </div>
  );
};
