import { createContext, useState, useEffect, useCallback } from 'react';
import { GARMENTS } from '../data/garments';
import { PARTNERS } from '../data/partners';
import { DEFAULT_LOCATION } from '../utils/geo';
import { TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEY = 'threadtrail_state';

const SIMULATED_AGENTS = [
  { name: 'Ramesh Kumar', phone: '+91 98114 22019', vehicle: 'EV Cargo #DL-1L-8421' },
  { name: 'Sunita Devi', phone: '+91 97172 55380', vehicle: 'E-Rickshaw #UP-16-4910' },
  { name: 'Vikram Singh', phone: '+91 99108 74122', vehicle: 'EV Van #UP-16-2048' },
];

function createInitialState() {
  // Seeded with one completed sample pickup so a first-time visitor immediately sees
  // circular impact stats and past pickup history on Home, while keeping the bag empty for a fresh scan.
  const seededTime = Date.now() - 120000;
  return {
    language: 'en',
    bagItems: [],
    selectedPartnerId: null,
    userLocation: DEFAULT_LOCATION,
    points: 20,
    pickups: [
      {
        id: 'TT-18420',
        createdAt: seededTime,
        partnerId: 'P01',
        partnerName: 'VastraSetu Foundation',
        items: [
          { garmentId: 'G001', condition: 'good' },
          { garmentId: 'G005', condition: 'good' },
        ],
        totalWeightKg: 0.5,
        pointsEarned: 20,
        customerName: 'Aarav Mehta',
        phone: '9876543210',
        address: 'B-204, Shatabdi Enclave, Sector 62',
        pincode: '201309',
        dateKey: 'tomorrow',
        slotKey: 'morning',
        note: 'Sample seeded pickup',
        agent: SIMULATED_AGENTS[0],
      },
    ],
  };
}

function loadStateFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return createInitialState();
    return {
      ...createInitialState(),
      ...parsed,
      bagItems: Array.isArray(parsed.bagItems) ? parsed.bagItems : [],
      pickups: Array.isArray(parsed.pickups) ? parsed.pickups : [],
      userLocation: parsed.userLocation || DEFAULT_LOCATION,
    };
  } catch {
    return createInitialState();
  }
}

export const ThreadTrailContext = createContext(null);

export function ThreadTrailProvider({ children }) {
  const [state, setState] = useState(() => loadStateFromStorage());

  // Persist every state transition safely to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota or private browsing errors gracefully
    }
  }, [state]);

  const toggleLanguage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en',
    }));
  }, []);

  const setLanguage = useCallback((lang) => {
    setState((prev) => ({
      ...prev,
      language: lang === 'hi' ? 'hi' : 'en',
    }));
  }, []);

  const addToBag = useCallback((garmentId, condition = 'good') => {
    let added = false;
    setState((prev) => {
      const exists = prev.bagItems.some((item) => item.garmentId === garmentId);
      if (exists) {
        return prev;
      }
      added = true;
      return {
        ...prev,
        bagItems: [...prev.bagItems, { garmentId, condition }],
      };
    });
    return added;
  }, []);

  const updateBagItemCondition = useCallback((garmentId, condition) => {
    setState((prev) => ({
      ...prev,
      bagItems: prev.bagItems.map((item) =>
        item.garmentId === garmentId ? { ...item, condition } : item
      ),
    }));
  }, []);

  const removeFromBag = useCallback((garmentId) => {
    setState((prev) => ({
      ...prev,
      bagItems: prev.bagItems.filter((item) => item.garmentId !== garmentId),
    }));
  }, []);

  const selectPartner = useCallback((partnerId) => {
    setState((prev) => ({
      ...prev,
      selectedPartnerId: partnerId,
    }));
  }, []);

  const setUserLocation = useCallback((location) => {
    setState((prev) => ({
      ...prev,
      userLocation: location,
    }));
  }, []);

  const confirmPickup = useCallback((formDetails) => {
    const partner = PARTNERS.find((p) => p.id === state.selectedPartnerId) || PARTNERS[0];
    const itemsCopy = [...state.bagItems];
    if (itemsCopy.length === 0) return null;

    const totalWeightKg =
      Math.round(
        itemsCopy.reduce((sum, item) => {
          const g = GARMENTS.find((x) => x.id === item.garmentId);
          return sum + (g ? g.weightKg : 0.25);
        }, 0) * 100
      ) / 100;

    const pointsEarned = itemsCopy.length * 10;
    const randomNum = Math.floor(10000 + Math.random() * 89999);
    const trackingId = `TT-${randomNum}`;
    const agent = SIMULATED_AGENTS[Math.floor(Math.random() * SIMULATED_AGENTS.length)];

    const newPickup = {
      id: trackingId,
      createdAt: Date.now(),
      partnerId: partner.id,
      partnerName: partner.name,
      items: itemsCopy,
      totalWeightKg,
      pointsEarned,
      customerName: formDetails.name,
      phone: formDetails.phone,
      address: formDetails.address,
      pincode: formDetails.pincode,
      dateKey: formDetails.dateKey,
      slotKey: formDetails.slotKey,
      note: formDetails.note || '',
      agent,
    };

    setState((prev) => ({
      ...prev,
      bagItems: [],
      points: (prev.points || 0) + pointsEarned,
      pickups: [newPickup, ...prev.pickups],
    }));

    return trackingId;
  }, [state.bagItems, state.selectedPartnerId]);

  const resetDemoData = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
  }, []);

  const t = TRANSLATIONS[state.language] || TRANSLATIONS.en;

  const totalItemsDiverted = state.pickups.reduce((sum, p) => sum + (p.items?.length || 0), 0);
  const totalKgDiverted =
    Math.round(state.pickups.reduce((sum, p) => sum + (p.totalWeightKg || 0), 0) * 10) / 10;

  return (
    <ThreadTrailContext.Provider
      value={{
        state,
        t,
        lang: state.language,
        totalItemsDiverted,
        totalKgDiverted,
        toggleLanguage,
        setLanguage,
        addToBag,
        updateBagItemCondition,
        removeFromBag,
        selectPartner,
        setUserLocation,
        confirmPickup,
        resetDemoData,
      }}
    >
      {children}
    </ThreadTrailContext.Provider>
  );
}
