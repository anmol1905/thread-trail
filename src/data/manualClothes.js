export const CLOTH_TYPES = [
  ['tshirt', 'T-shirt', 'टी-शर्ट', 0.2], ['shirt', 'Shirt', 'शर्ट', 0.25],
  ['kurta', 'Kurta', 'कुर्ता', 0.3], ['saree', 'Saree', 'साड़ी', 0.65],
  ['suit', 'Salwar / Suit', 'सलवार / सूट', 0.55], ['trousers', 'Jeans / Trousers', 'जीन्स / पैंट', 0.55],
  ['jacket', 'Jacket', 'जैकेट', 0.75], ['sweater', 'Sweater', 'स्वेटर', 0.5],
  ['dress', 'Dress', 'ड्रेस', 0.45], ['home', 'Bedsheet / Towel', 'चादर / तौलिया', 0.8],
  ['innerwear', 'Innerwear / Socks', 'इनरवियर / मोज़े', 0.12], ['other', 'Other', 'अन्य', 0.3],
].map(([id, en, hi, weight]) => ({ id, label: { en, hi }, weight }));

export const MATERIALS = [
  ['cotton', 'Cotton', 'कॉटन', 'Soft, breathable', 'मुलायम, हवादार'],
  ['polyester', 'Polyester', 'पॉलिएस्टर', "Smooth, doesn't wrinkle", 'चिकना, कम सिकुड़ता'],
  ['wool', 'Wool', 'ऊन', 'Warm, fuzzy', 'गर्म, रोएंदार'],
  ['silk', 'Silk', 'सिल्क', 'Shiny, delicate', 'चमकदार, नाज़ुक'],
  ['denim', 'Denim', 'डेनिम', 'Thick, sturdy twill', 'मोटा, मज़बूत'],
  ['linen', 'Linen', 'लिनेन', 'Crisp, wrinkles easily', 'करारा, जल्दी सिलवट'],
  ['nylon', 'Nylon', 'नायलॉन', 'Light, stretchy', 'हल्का, लचीला'],
  ['blend', 'Blend / Mixed', 'मिश्रित कपड़ा', 'More than one fibre', 'एक से अधिक फाइबर'],
  ['unknown', "I don't know", 'मुझे नहीं पता', 'Use the quick guide', 'आसान गाइड इस्तेमाल करें'],
].map(([id, en, hi, hintEn, hintHi]) => ({ id, label: { en, hi }, hint: { en: hintEn, hi: hintHi } }));

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free'];
export const COLOURS = [
  ['indigo', '#2B3A67'], ['turmeric', '#E9A820'], ['terracotta', '#C65D3B'],
  ['teal', '#1F8A87'], ['black', '#2A2A2A'], ['white', '#FBF6EA'], ['grey', '#8B8B86'],
];

export function getType(id) {
  return CLOTH_TYPES.find((item) => item.id === id) || CLOTH_TYPES[CLOTH_TYPES.length - 1];
}

export function estimateWeight(typeId, quantity = 1) {
  return Math.round(getType(typeId).weight * quantity * 100) / 100;
}

export function materialToPartnerFabric(id) {
  return { cotton: 'Cotton', polyester: 'Polyester', wool: 'Wool', silk: 'Silk Blend', denim: 'Denim', linen: 'Cotton', nylon: 'Polyester' }[id] || null;
}

export function manualToGarment(manual) {
  const type = getType(manual.type);
  const custom = manual.type === 'other' && manual.otherType?.trim();
  return {
    id: manual.id,
    name: custom ? { en: custom, hi: custom } : type.label,
    brand: manual.brand || 'Manually added',
    category: type.label,
    image: manual.photo || '',
    weightKg: Number(manual.weightKg) || estimateWeight(manual.type, manual.quantity),
    waterLitres: 0,
    isManual: true,
  };
}

export function suggestMaterial(answers) {
  if (answers.feel === 'fuzzy') return 'wool';
  if (answers.feel === 'shiny') return answers.stretch === 'yes' ? 'nylon' : 'silk';
  if (answers.wrinkle === 'yes') return 'cotton';
  if (answers.stretch === 'yes') return 'polyester';
  return 'blend';
}
