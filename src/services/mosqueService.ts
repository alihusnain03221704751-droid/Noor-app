import { Mosque } from '../types';

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Verified historical & prominent mosques with authentic GPS coordinates
export const VERIFIED_REGISTRY_MOSQUES: Mosque[] = [
  // Islamabad
  {
    id: 'mosque-faisal',
    name: 'Faisal Mosque (فیصل مسجد)',
    nameUrdu: 'فیصل مسجد اسلام آباد',
    address: 'Shah Faisal Avenue, E-8, Islamabad',
    city: 'Islamabad',
    lat: 33.7297,
    lng: 73.0372,
    jamatInfo: 'All 5 prayers with large congregational Friday Salah',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    phone: '+92 51 9260100',
    source: 'verified_registry'
  },
  {
    id: 'mosque-lal-masjid',
    name: 'Lal Masjid (لال مسجد)',
    nameUrdu: 'لال مسجد اسلام آباد',
    address: 'Masjid Road, G-6/2, Islamabad',
    city: 'Islamabad',
    lat: 33.7088,
    lng: 73.0805,
    jamatInfo: 'Regular congregational Salah & Dars-e-Quran',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: true, parking: true, airConditioned: true },
    source: 'verified_registry'
  },
  // Lahore
  {
    id: 'mosque-badshahi',
    name: 'Badshahi Mosque (بادشاہی مسجد)',
    nameUrdu: 'تاریخی بادشاہی مسجد لاہور',
    address: 'Walled City, Near Lahore Fort, Lahore',
    city: 'Lahore',
    lat: 31.5882,
    lng: 74.3094,
    jamatInfo: 'Daily prayers, Jummah congregation & tourist visiting facility',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: false },
    phone: '+92 42 99204000',
    source: 'verified_registry'
  },
  {
    id: 'mosque-grand-jamia-bahria',
    name: 'Grand Jamia Mosque Bahria Town (گرینڈ جامع مسجد)',
    nameUrdu: 'گرینڈ جامع مسجد بحریہ ٹاؤن لاہور',
    address: 'Bahria Town Main Boulevard, Sector C, Lahore',
    city: 'Lahore',
    lat: 31.3676,
    lng: 74.1856,
    jamatInfo: 'Capacity 70,000 worshippers, Islamic Academy & Museum',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    phone: '+92 42 35341201',
    source: 'verified_registry'
  },
  {
    id: 'mosque-data-darbar',
    name: 'Data Darbar Jamia Masjid (جامع مسجد داتا دربار)',
    nameUrdu: 'جامع مسجد داتا دربار لاہور',
    address: 'Data Darbar Road, Bhati Gate, Lahore',
    city: 'Lahore',
    lat: 31.5786,
    lng: 74.3045,
    jamatInfo: 'Round-the-clock prayers, Langar & spiritual gatherings',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: false, airConditioned: true },
    phone: '+92 42 99211388',
    source: 'verified_registry'
  },
  {
    id: 'mosque-wazir-khan',
    name: 'Wazir Khan Mosque (مسجد وزیر خان)',
    nameUrdu: 'تاریخی مسجد وزیر خان لاہور',
    address: 'Shahi Guzargah, Dabbi Bazaar, Walled City, Lahore',
    city: 'Lahore',
    lat: 31.5831,
    lng: 74.3218,
    jamatInfo: 'Traditional 17th-century Mughal tilework mosque with active 5 times Salah',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: false, parking: false, airConditioned: false },
    source: 'verified_registry'
  },
  // Karachi
  {
    id: 'mosque-tooba',
    name: 'Masjid-e-Tooba (Gol Masjid) (مسجد طوبیٰ)',
    nameUrdu: 'مسجد طوبیٰ (گول مسجد) کراچی',
    address: 'Old Korangi Road, DHA Phase 2, Karachi',
    city: 'Karachi',
    lat: 24.8427,
    lng: 67.0592,
    jamatInfo: 'World’s largest single-dome mosque, acoustic sound architecture',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    phone: '+92 21 35889000',
    source: 'verified_registry'
  },
  {
    id: 'mosque-new-challi',
    name: 'Memon Masjid Boulton Market (میمن مسجد)',
    nameUrdu: 'جامع میمن مسجد بولٹن مارکیٹ کراچی',
    address: 'M.A Jinnah Road, Boulton Market, Saddar, Karachi',
    city: 'Karachi',
    lat: 24.8532,
    lng: 66.9998,
    jamatInfo: 'One of the oldest and largest historic mosques in central Karachi',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: true, parking: false, airConditioned: true },
    source: 'verified_registry'
  },
  {
    id: 'mosque-baitul-mukarram',
    name: 'Baitul Mukarram Jamia Masjid (بیت المکرم)',
    nameUrdu: 'جامع مسجد بیت المکرم گلشن اقبال کراچی',
    address: 'University Road, Block 8, Gulshan-e-Iqbal, Karachi',
    city: 'Karachi',
    lat: 24.9126,
    lng: 67.0863,
    jamatInfo: 'Major center for Islamic education, Friday prayers & Eid prayers',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    phone: '+92 21 34971200',
    source: 'verified_registry'
  },
  // Rawalpindi
  {
    id: 'mosque-markazi-jamia-pindi',
    name: 'Markazi Jamia Masjid Rawalpindi (مرکزی جامع مسجد)',
    nameUrdu: 'مرکزی جامع مسجد راولپنڈی',
    address: 'Jamia Masjid Road, Rawalpindi',
    city: 'Rawalpindi',
    lat: 33.6128,
    lng: 73.0585,
    jamatInfo: 'Oldest grand central mosque of Rawalpindi with classic minarets',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: true, parking: false, airConditioned: true },
    source: 'verified_registry'
  },
  // Peshawar
  {
    id: 'mosque-mahabbat-khan',
    name: 'Mahabat Khan Mosque (مسجد مہابت خان)',
    nameUrdu: 'تاریخی مسجد مہابت خان پشاور',
    address: 'Andar Shehr, Near Chowk Yadgar, Peshawar',
    city: 'Peshawar',
    lat: 34.0105,
    lng: 71.5739,
    jamatInfo: '17th-century Mughal architectural landmark with active daily congregation',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: false, parking: false, airConditioned: false },
    source: 'verified_registry'
  },
  // Multan
  {
    id: 'mosque-shahi-eidgah-multan',
    name: 'Shahi Eidgah Mosque (شاہی عیدگاہ مسجد ملتان)',
    nameUrdu: 'شاہی عیدگاہ مسجد ملتان',
    address: 'Khanewal Road, Multan',
    city: 'Multan',
    lat: 30.2078,
    lng: 71.4883,
    jamatInfo: '18th-century grand monument with vast courtyard for prayer',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: false },
    source: 'verified_registry'
  },
  // Faisalabad
  {
    id: 'mosque-clock-tower-faisalabad',
    name: 'Sunheri Jamia Masjid (سنہری جامع مسجد فیصل آباد)',
    nameUrdu: 'سنہری جامع مسجد سرکلر روڈ فیصل آباد',
    address: 'Circular Road, Near Ghanta Ghar, Faisalabad',
    city: 'Faisalabad',
    lat: 31.4172,
    lng: 73.0789,
    jamatInfo: 'Central Friday and 5 times daily prayer congregation',
    facilities: { wudu: true, womenPrayerArea: false, wheelchair: true, parking: true, airConditioned: true },
    source: 'verified_registry'
  },
  // Makkah
  {
    id: 'mosque-masjid-al-haram',
    name: 'Masjid al-Haram (المسجد الحرام)',
    nameUrdu: 'المسجد الحرام خانہ کعبہ مکہ مکرمہ',
    address: 'Al Haram, Makkah 24231, Saudi Arabia',
    city: 'Makkah',
    lat: 21.4225,
    lng: 39.8262,
    jamatInfo: 'The holiest mosque in Islam surrounding the Holy Kaaba',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    source: 'verified_registry'
  },
  // Madinah
  {
    id: 'mosque-masjid-an-nabawi',
    name: 'Al-Masjid an-Nabawi (المسجد النبوي)',
    nameUrdu: 'مسجد نبوی شریف مدینہ منورہ',
    address: 'Al Haram, Medina 42311, Saudi Arabia',
    city: 'Madinah',
    lat: 24.4672,
    lng: 39.6108,
    jamatInfo: 'The Mosque of the Prophet Muhammad ﷺ with rawdah shareef',
    facilities: { wudu: true, womenPrayerArea: true, wheelchair: true, parking: true, airConditioned: true },
    source: 'verified_registry'
  }
];

// OpenStreetMap Overpass query helper to fetch real live mosques around a location
export async function fetchLiveMosquesFromOSM(
  lat: number,
  lng: number,
  radiusKm = 8
): Promise<Mosque[]> {
  const radiusMeters = Math.min(30000, Math.max(1000, radiusKm * 1000));
  const query = `[out:json][timeout:12];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lng});
);
out center 40;`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSM status ${response.status}`);
    }

    const data = await response.json();
    const elements: Array<{
      id: number;
      type: string;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }> = data.elements || [];

    const parsedMosques: Mosque[] = [];
    for (const el of elements) {
      const mLat = el.lat ?? el.center?.lat;
      const mLng = el.lon ?? el.center?.lon;
      if (!mLat || !mLng) continue;

      const tags = el.tags || {};
      const rawName = tags.name || tags['name:en'] || tags['name:ur'] || tags['name:ar'] || 'Jamia Masjid';
      const urduName = tags['name:ur'] || tags.name || undefined;
      const street = tags['addr:street'] || '';
      const suburb = tags['addr:suburb'] || tags['addr:district'] || '';
      const city = tags['addr:city'] || '';
      const address = [street, suburb, city].filter(Boolean).join(', ') || tags.address || 'Local Mosque Area';

      const distance = calculateDistanceKm(lat, lng, mLat, mLng);

      parsedMosques.push({
        id: `osm-${el.id}`,
        name: rawName,
        nameUrdu: urduName,
        address: address,
        city: city || undefined,
        lat: mLat,
        lng: mLng,
        distanceKm: distance,
        facilities: {
          wudu: tags.wudu === 'yes' || true,
          womenPrayerArea: tags['female'] === 'yes' || tags['women'] === 'yes',
          wheelchair: tags.wheelchair === 'yes',
          parking: tags.parking === 'yes',
          airConditioned: tags.air_conditioning === 'yes'
        },
        phone: tags.phone || tags['contact:phone'] || undefined,
        source: 'osm'
      });
    }

    return parsedMosques;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Live OSM Overpass query failed or timed out:', err);
    return [];
  }
}

// Geocode query using OpenStreetMap Nominatim
export async function geocodeLocationNominatim(queryText: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (!queryText.trim()) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      queryText.trim()
    )}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en,ur'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
  } catch (e) {
    console.warn('Nominatim geocode failed:', e);
  }
  return null;
}
