// Geolocation utilities: Haversine distance and Delhi NCR pincode/city lookup.

export const DEFAULT_LOCATION = {
  lat: 28.6279,
  lng: 77.3649,
  label: 'Sector 62, Noida (201309)',
  isFallback: true,
};

export const NCR_PINCODE_COORDS = {
  '201309': { lat: 28.6279, lng: 77.3649, label: 'Sector 62, Noida' },
  '201301': { lat: 28.5823, lng: 77.3178, label: 'Sector 18, Noida' },
  '201303': { lat: 28.5672, lng: 77.3261, label: 'Sector 29, Noida' },
  '201305': { lat: 28.5355, lng: 77.4126, label: 'Phase II, Noida' },
  '201310': { lat: 28.4744, lng: 77.4848, label: 'Knowledge Park, Greater Noida' },
  '201009': { lat: 28.6061, lng: 77.4288, label: 'Noida Extension / Gaur City' },
  '203207': { lat: 28.5528, lng: 77.5546, label: 'Dadri, Gautam Buddha Nagar' },
  '201014': { lat: 28.6415, lng: 77.3714, label: 'Indirapuram, Ghaziabad' },
  '201002': { lat: 28.6789, lng: 77.4394, label: 'Raj Nagar, Ghaziabad' },
  '110016': { lat: 28.5535, lng: 77.1945, label: 'Hauz Khas, New Delhi' },
  '110020': { lat: 28.5458, lng: 77.2732, label: 'Okhla Phase III, New Delhi' },
  '110092': { lat: 28.6304, lng: 77.2772, label: 'Laxmi Nagar, Delhi' },
};

export function lookupLocationByQuery(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  if (NCR_PINCODE_COORDS[q]) {
    return { ...NCR_PINCODE_COORDS[q], isFallback: false };
  }
  const match = Object.entries(NCR_PINCODE_COORDS).find(
    ([pin, info]) => pin.includes(q) || info.label.toLowerCase().includes(q)
  );
  if (match) {
    return { ...match[1], isFallback: false };
  }
  return null;
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
