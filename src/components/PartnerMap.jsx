import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useThreadTrail } from '../hooks/useThreadTrail';

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 11, { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

function createPinIcon(color, labelText, isSelected = false) {
  return L.divIcon({
    className: 'custom-tt-marker',
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
      <div style="width:${isSelected ? 30 : 24}px;height:${isSelected ? 30 : 24}px;border-radius:9999px;background:${color};border:2.5px solid #FFFDF8;box-shadow:0 3px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#FFFDF8;font-size:11px;font-weight:700;">
        ${labelText}
      </div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${color};margin-top:-1px;"></div>
    </div>`,
    iconSize: [30, 38],
    iconAnchor: [0, 0],
    popupAnchor: [0, -34],
  });
}

const userIcon = L.divIcon({
  className: 'custom-tt-user',
  html: `<div style="width:20px;height:20px;border-radius:9999px;background:#E9A820;border:3px solid #2B3A67;box-shadow:0 0 0 5px rgba(233,168,32,0.3);transform:translate(-50%,-50%);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [0, 0],
});

export function PartnerMap({ partners, userLocation, selectedPartnerId, onSelectPartner }) {
  const { t } = useThreadTrail();

  return (
    <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-[#2B3A67]/20 shadow-sm relative">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={userLocation} />

        {/* User location marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-xs font-semibold text-[#2B3A67]">
              {t.partners.youAreHere}
            </div>
            <div className="text-[11px] text-[#2A2A2A]/75">{userLocation.label}</div>
          </Popup>
        </Marker>

        {/* Partner markers */}
        {partners.map((partner) => {
          const isSelected = partner.id === selectedPartnerId;
          const color = isSelected ? '#1F8A87' : '#2B3A67';
          return (
            <Marker
              key={partner.id}
              position={[partner.lat, partner.lng]}
              icon={createPinIcon(color, isSelected ? '✓' : '•', isSelected)}
            >
              <Popup>
                <div className="min-w-[175px] space-y-1.5">
                  <div className="font-semibold text-sm text-[#2B3A67] leading-tight">
                    {partner.name}
                  </div>
                  <div className="text-[11px] text-[#2A2A2A]/75">
                    {t.partners.types[partner.type] || partner.type} · {partner.distanceKm} {t.common.kmAway}
                  </div>
                  <div className="text-[11px] text-[#2A2A2A]/80">{partner.area}</div>
                  <button
                    type="button"
                    onClick={() => onSelectPartner(partner.id)}
                    className={`w-full mt-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#1F8A87] text-[#FBF6EA]'
                        : 'bg-[#2B3A67] text-[#FBF6EA]'
                    }`}
                  >
                    {isSelected ? t.partners.selectedBtn : t.partners.selectBtn}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
