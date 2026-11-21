// Dummy garment passport data for ThreadTrail prototype (G001 - G006).
// All garment records are static dummy data; user scan & pickup actions persist in localStorage.

import cottonTeeImage from '../assets/images/garments/cotton-tee.webp';
import denimJacketImage from '../assets/images/garments/denim-jacket.webp';
import sportsTeeImage from '../assets/images/garments/sports-tee.webp';
import woolPulloverImage from '../assets/images/garments/wool-pullover.webp';
import khadiKurtaImage from '../assets/images/garments/khadi-kurta.webp';
import silkSareeImage from '../assets/images/garments/silk-saree.webp';

export const GARMENTS = [
  {
    id: 'G001',
    name: {
      en: 'Everyday Organic Cotton Tee',
      hi: 'दैनिक ऑर्गेनिक कॉटन टी-शर्ट',
    },
    brand: 'Kapas Looms',
    category: { en: 'T-Shirt', hi: 'टी-शर्ट' },
    image: cottonTeeImage,
    colorHex: '#2B3A67',
    accentHex: '#E9A820',
    size: 'M (Chest 38")',
    fabricTag: 'Cotton',
    material: {
      en: '100% Rain-fed Organic Cotton (180 GSM)',
      hi: '100% वर्षा-पोषित ऑर्गेनिक सूती कपड़ा (180 GSM)',
    },
    weightKg: 0.22,
    ecoScore: 'A',
    waterLitres: 950,
    waterDaysDrinking: 316,
    co2Kg: 2.8,
    recycledPercent: 20,
    lifespanYears: 4,
    careTip: {
      en: 'Wash in cold water inside out and line-dry in shade to prevent collar stretch and fading.',
      hi: 'कॉलर को ढीला होने और रंग उड़ने से बचाने के लिए उल्टा करके ठंडे पानी में धोएं और छांव में सुखाएं।',
    },
    care: {
      washTemp: { value: '30°C', en: 'Gentle cold wash at 30°C', hi: '30°C ठंडे पानी में हल्की धुलाई' },
      bleach: { allowed: false, en: 'Do not bleach', hi: 'ब्लीच न करें' },
      iron: { level: 'Medium', en: 'Warm iron inside out', hi: 'उल्टा करके मध्यम आंच पर इस्त्री करें' },
      tumbleDry: { allowed: false, en: 'Line dry in shade; skip dryer', hi: 'छांव में रस्सी पर सुखाएं; ड्रायर से बचें' },
      dryClean: { allowed: false, en: 'No dry clean needed', hi: 'ड्राई क्लीन की आवश्यकता नहीं' },
    },
    story: {
      en: 'Grown without synthetic pesticides in Vidarbha, spun in Tiruppur, and stitched in a solar-powered Noida workshop.',
      hi: 'विदर्भ में बिना रासायनिक कीटनाशक के उगाया गया, तिरुप्पुर में बुना गया और नोएडा की सौर ऊर्जा कार्यशाला में सिला गया।',
    },
    journey: [
      { stage: 'grown', en: 'Organic Cotton · Vidarbha, MH', hi: 'जैविक कपास · विदर्भ, महाराष्ट्र' },
      { stage: 'woven', en: 'Spun & Knitted · Tiruppur, TN', hi: 'कताई और बुनाई · तिरुप्पुर, तमिलनाडु' },
      { stage: 'stitched', en: 'Tailored · Noida Sector 63', hi: 'सिलाई · नोएडा सेक्टर 63' },
      { stage: 'you', en: 'With You · Everyday wear', hi: 'आपके पास · दैनिक उपयोग' },
      { stage: 'next', en: 'Next Life · Compost, mend or recycle', hi: 'अगला जीवन · खाद, मरम्मत या रीसायकल' },
    ],
  },
  {
    id: 'G002',
    name: {
      en: 'Indigo Selvedge Denim Jacket',
      hi: 'इंडिगो सेल्वेज डेनिम जैकेट',
    },
    brand: 'Neel & Co.',
    category: { en: 'Jacket', hi: 'जैकेट' },
    image: denimJacketImage,
    colorHex: '#233056',
    accentHex: '#1F8A87',
    size: 'L (Chest 42")',
    fabricTag: 'Denim',
    material: {
      en: '85% Combed Cotton, 15% Post-Consumer Recycled Denim',
      hi: '85% कॉम्बेड कॉटन, 15% रीसायकल किया गया डेनिम',
    },
    weightKg: 0.78,
    ecoScore: 'B',
    waterLitres: 3200,
    waterDaysDrinking: 1066,
    co2Kg: 11.4,
    recycledPercent: 15,
    lifespanYears: 10,
    careTip: {
      en: 'Air out after wear and spot-clean marks; denim only needs a full wash every 8–10 wears.',
      hi: 'पहनने के बाद हवा लगाएं और दाग साफ करें; डेनिम को हर 8-10 बार पहनने पर ही धोएं।',
    },
    care: {
      washTemp: { value: '30°C', en: 'Cold hand wash separately', hi: 'अलग से ठंडे पानी में हाथ से धोएं' },
      bleach: { allowed: false, en: 'Do not bleach indigo dye', hi: 'इंडिगो डाई पर ब्लीच न करें' },
      iron: { level: 'Low', en: 'Low steam if needed', hi: 'जरूरत हो तो हल्की भाप से इस्त्री करें' },
      tumbleDry: { allowed: false, en: 'Hang dry away from direct sun', hi: 'सीधी धूप से दूर हैंगर पर सुखाएं' },
      dryClean: { allowed: false, en: 'Do not dry clean', hi: 'ड्राई क्लीन न करें' },
    },
    story: {
      en: 'Dyed using closed-loop water recycling in Ahmedabad to recover 82% of dye bath water, finished with brass shank buttons.',
      hi: 'अहमदाबाद में क्लोज्ड-लूप जल प्रणाली से रंगा गया जिससे 82% पानी बचता है, और पीतल के बटन लगाए गए।',
    },
    journey: [
      { stage: 'grown', en: 'Cotton & Recycled Yarn · Gujarat', hi: 'कपास और रीसायकल धागा · गुजरात' },
      { stage: 'woven', en: 'Rope-Dyed Denim · Ahmedabad', hi: 'इंडिगो रंगाई · अहमदाबाद' },
      { stage: 'stitched', en: 'Assembled · Gurugram Atelier', hi: 'सिलाई · गुरुग्राम कार्यशाला' },
      { stage: 'you', en: 'With You · Built for a decade', hi: 'आपके पास · 10 वर्षों तक टिकाऊ' },
      { stage: 'next', en: 'Next Life · Patchwork or fiber shred', hi: 'अगला जीवन · पैचवर्क या फाइबर रीसायकल' },
    ],
  },
  {
    id: 'G003',
    name: {
      en: 'AeroRun Recycled Sports Tee',
      hi: 'एयरोरन रीसायकल स्पोर्ट्स टी',
    },
    brand: 'Gati Active',
    category: { en: 'Activewear', hi: 'स्पोर्ट्सवियर' },
    image: sportsTeeImage,
    colorHex: '#1F8A87',
    accentHex: '#E9A820',
    size: 'M (Regular Fit)',
    fabricTag: 'Polyester',
    material: {
      en: '100% rPET Polyester (spun from 9 plastic bottles)',
      hi: '100% रीसायकल पॉलिएस्टर (9 प्लास्टिक बोतलों से निर्मित)',
    },
    weightKg: 0.16,
    ecoScore: 'C',
    waterLitres: 420,
    waterDaysDrinking: 140,
    co2Kg: 4.9,
    recycledPercent: 100,
    lifespanYears: 3,
    careTip: {
      en: 'Wash in a laundry mesh bag to trap synthetic microfibers and skip fabric softeners.',
      hi: 'माइक्रोफाइबर निकलने से रोकने के लिए मेश बैग में धोएं और फैब्रिक सॉफ्टनर न डालें।',
    },
    care: {
      washTemp: { value: '30°C', en: 'Cold gentle cycle (30°C)', hi: '30°C पर कोमल मशीन धुलाई' },
      bleach: { allowed: false, en: 'Never bleach synthetic knit', hi: 'ब्लीच का प्रयोग न करें' },
      iron: { level: 'None', en: 'Do not iron', hi: 'इस्त्री न करें' },
      tumbleDry: { allowed: false, en: 'Quick air dry in 45 mins', hi: '45 मिनट में हवा में सूख जाता है' },
      dryClean: { allowed: false, en: 'Do not dry clean', hi: 'ड्राई क्लीन न करें' },
    },
    story: {
      en: 'Post-consumer PET bottles collected across Delhi NCR were flaked, melted, and spun into breathable moisture-wicking yarn.',
      hi: 'दिल्ली एनसीआर से एकत्र की गई प्लास्टिक बोतलों को पिघलाकर सांस लेने योग्य स्पोर्ट्स धागे में बदला गया।',
    },
    journey: [
      { stage: 'grown', en: 'PET Bottles Collected · Delhi NCR', hi: 'पीईटी बोतल संग्रह · दिल्ली एनसीआर' },
      { stage: 'woven', en: 'rPET Yarn Extrusion · Surat', hi: 'धागा निर्माण · सूरत' },
      { stage: 'stitched', en: 'Flatlock Stitched · Faridabad', hi: 'फ्लैटलॉक सिलाई · फरीदाबाद' },
      { stage: 'you', en: 'With You · Morning runs', hi: 'आपके पास · सुबह की दौड़' },
      { stage: 'next', en: 'Next Life · Chemical fiber recovery', hi: 'अगला जीवन · फाइबर रीसायकल' },
    ],
  },
  {
    id: 'G004',
    name: {
      en: 'Himalayan Merino Wool Pullover',
      hi: 'हिमालयन मेरिनो ऊनी स्वेटर',
    },
    brand: 'Pahadi Knit',
    category: { en: 'Sweater', hi: 'स्वेटर' },
    image: woolPulloverImage,
    colorHex: '#C65D3B',
    accentHex: '#E9A820',
    size: 'L (Relaxed)',
    fabricTag: 'Wool',
    material: {
      en: '90% Responsible Wool, 10% Recycled Nylon',
      hi: '90% रिस्पॉन्सिबल ऊन, 10% रीसायकल नायलॉन',
    },
    weightKg: 0.48,
    ecoScore: 'B',
    waterLitres: 1450,
    waterDaysDrinking: 483,
    co2Kg: 7.2,
    recycledPercent: 10,
    lifespanYears: 8,
    careTip: {
      en: 'Fold instead of hanging to preserve shoulder shape, and store with dried neem leaves in summer.',
      hi: 'कंधों का आकार बचाने के लिए हैंगर की जगह मोड़कर रखें और गर्मियों में सूखे नीम के पत्तों के साथ सहेजें।',
    },
    care: {
      washTemp: { value: '20°C', en: 'Hand wash cold with mild soap', hi: 'ठंडे पानी में हल्के साबुन से हाथ धोएं' },
      bleach: { allowed: false, en: 'Do not bleach', hi: 'ब्लीच न करें' },
      iron: { level: 'Low', en: 'Steam lightly through damp cloth', hi: 'गीले कपड़े के ऊपर से हल्की भाप दें' },
      tumbleDry: { allowed: false, en: 'Dry flat on a towel', hi: 'तौलिये पर समतल रखकर सुखाएं' },
      dryClean: { allowed: true, en: 'Eco dry clean optional', hi: 'इको ड्राई क्लीन वैकल्पिक' },
    },
    story: {
      en: 'Crafted by women-led knitting collectives in Kullu and Ludhiana using traceable high-altitude fleece.',
      hi: 'कुल्लू और लुधियाना के महिला बुनाई समूहों द्वारा ट्रेस करने योग्य ऊन से तैयार किया गया।',
    },
    journey: [
      { stage: 'grown', en: 'Sheared Wool · Himachal Pastures', hi: 'ऊन संग्रह · हिमाचल चरागाह' },
      { stage: 'woven', en: 'Carded & Spun · Ludhiana', hi: 'कताई और रंगाई · लुधियाना' },
      { stage: 'stitched', en: 'Hand-Linked · Kullu Collective', hi: 'बुनाई · कुल्लू महिला समूह' },
      { stage: 'you', en: 'With You · Winter warmth', hi: 'आपके पास · सर्दियों की गर्माहट' },
      { stage: 'next', en: 'Next Life · Darning or wool re-carding', hi: 'अगला जीवन · रफू या ऊन री-कार्डिंग' },
    ],
  },
  {
    id: 'G005',
    name: {
      en: 'Handspun Khadi Cotton Kurta',
      hi: 'हाथ से काता खादी कॉटन कुर्ता',
    },
    brand: 'Sutra Gram',
    category: { en: 'Kurta', hi: 'कुर्ता' },
    image: khadiKurtaImage,
    colorHex: '#E9A820',
    accentHex: '#2B3A67',
    size: 'M (40)',
    fabricTag: 'Cotton',
    material: {
      en: '100% Handspun, Handwoven Khadi Cotton',
      hi: '100% हाथ से काता और बुना खादी सूती कपड़ा',
    },
    weightKg: 0.28,
    ecoScore: 'A',
    waterLitres: 610,
    waterDaysDrinking: 203,
    co2Kg: 1.5,
    recycledPercent: 0,
    lifespanYears: 6,
    careTip: {
      en: 'First wash in salted cold water sets natural vegetable dyes; gets softer with every wash.',
      hi: 'पहली बार नमक मिले ठंडे पानी में धोने से प्राकृतिक रंग पक्का होता है; हर धुलाई में यह और मुलायम होता है।',
    },
    care: {
      washTemp: { value: '30°C', en: 'Gentle hand wash in cold water', hi: 'ठंडे पानी में कोमल हाथ की धुलाई' },
      bleach: { allowed: false, en: 'Do not bleach natural dye', hi: 'प्राकृतिक रंग पर ब्लीच न करें' },
      iron: { level: 'Medium', en: 'Iron while slightly damp', hi: 'हल्के गीलेपन में इस्त्री करें' },
      tumbleDry: { allowed: false, en: 'Dry flat or on hanger in shade', hi: 'छांव में समतल या हैंगर पर सुखाएं' },
      dryClean: { allowed: false, en: 'Water wash preferred', hi: 'सामान्य जल धुलाई बेहतर' },
    },
    story: {
      en: 'Woven on pit looms in Barabanki without grid electricity and dyed with marigold petals and pomegranate rind.',
      hi: 'बाराबंकी में बिना बिजली के करघे पर बुना गया और गेंदे के फूल व अनार के छिलके से रंगा गया।',
    },
    journey: [
      { stage: 'grown', en: 'Desi Cotton · Central India', hi: 'देसी कपास · मध्य भारत' },
      { stage: 'woven', en: 'Pit-Loom Khadi · Barabanki, UP', hi: 'करघा बुनाई · बाराबंकी, उ.प्र.' },
      { stage: 'stitched', en: 'Master Tailors · Old Delhi', hi: 'सिलाई · पुरानी दिल्ली' },
      { stage: 'you', en: 'With You · Festive & daily comfort', hi: 'आपके पास · त्योहार व दैनिक आराम' },
      { stage: 'next', en: 'Next Life · Donate, mend or quilt', hi: 'अगला जीवन · दान, मरम्मत या गुदड़ी' },
    ],
  },
  {
    id: 'G006',
    name: {
      en: 'Zari Border Silk-Blend Saree',
      hi: 'ज़री बॉर्डर सिल्क-ब्लेंड साड़ी',
    },
    brand: 'Kashi Weaves',
    category: { en: 'Saree', hi: 'साड़ी' },
    image: silkSareeImage,
    colorHex: '#8C3B4A',
    accentHex: '#E9A820',
    size: '5.5m + 0.8m Blouse',
    fabricTag: 'Silk Blend',
    material: {
      en: '65% Mulberry Silk, 35% Modal Tencel',
      hi: '65% शहतूत रेशम, 35% मोडल टेंसेल',
    },
    weightKg: 0.56,
    ecoScore: 'B',
    waterLitres: 2100,
    waterDaysDrinking: 700,
    co2Kg: 6.4,
    recycledPercent: 0,
    lifespanYears: 20,
    careTip: {
      en: 'Refold every 3 months along different creases and wrap in unbleached muslin cloth.',
      hi: 'हर 3 महीने में तह बदलकर रखें और बिना ब्लीच किए मलमल के कपड़े में लपेटें।',
    },
    care: {
      washTemp: { value: 'Dry', en: 'Spot clean or specialist silk wash', hi: 'स्पॉट क्लीन या विशेष रेशम धुलाई' },
      bleach: { allowed: false, en: 'Never bleach silk or zari', hi: 'रेशम या ज़री पर ब्लीच न करें' },
      iron: { level: 'Low', en: 'Low heat on reverse side only', hi: 'केवल उल्टी तरफ से हल्की आंच पर इस्त्री' },
      tumbleDry: { allowed: false, en: 'Air dry indoors away from sun', hi: 'धूप से दूर अंदर हवा में सुखाएं' },
      dryClean: { allowed: true, en: 'Gentle hydrocarbon dry clean', hi: 'कोमल ड्राई क्लीन अनुशंसित' },
    },
    story: {
      en: 'Woven by third-generation weavers in Varanasi combining ahimsa-grade silk warp with wood-pulp modal weft.',
      hi: 'वाराणसी के तीसरी पीढ़ी के बुनकरों द्वारा रेशम और टेंसेल के संगम से बुनी गई।',
    },
    journey: [
      { stage: 'grown', en: 'Silk & Beechwood Pulp · Karnataka', hi: 'रेशम व प्राकृतिक पल्प · कर्नाटक' },
      { stage: 'woven', en: 'Jacquard Loom · Varanasi, UP', hi: 'जैकर्ड करघा · वाराणसी, उ.प्र.' },
      { stage: 'stitched', en: 'Fall & Pico · Noida Boutiques', hi: 'फॉल व पीको · नोएडा' },
      { stage: 'you', en: 'With You · Heirloom occasions', hi: 'आपके पास · पारिवारिक धरोहर' },
      { stage: 'next', en: 'Next Life · Upcycle into cushions or kurtas', hi: 'अगला जीवन · कुशन या कुर्ते में अपसायकल' },
    ],
  },
];

export function getGarmentById(id) {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();
  return GARMENTS.find((g) => g.id === cleanId) || null;
}
