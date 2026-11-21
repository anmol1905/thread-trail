import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  List,
  Map as MapIcon,
  Search,
  Truck,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { PARTNERS, PARTNER_TYPES } from '../data/partners';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { haversineKm, lookupLocationByQuery, DEFAULT_LOCATION } from '../utils/geo';
import { ConditionHelper } from '../components/ConditionHelper';
import { PartnerMap } from '../components/PartnerMap';

export function PartnersPage() {
  const { state, t, lang, selectPartner, setUserLocation } = useThreadTrail();

  // Default condition filter from first bag item if available
  const initialCond = state.bagItems[0]?.condition || 'all';
  const [conditionFilter, setConditionFilter] = useState(initialCond);
  const [typeFilter, setTypeFilter] = useState('All');
  const [maxDistKm, setMaxDistKm] = useState(50);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    const matched = lookupLocationByQuery(searchQuery);
    if (matched) {
      setUserLocation(matched);
      setLocationNotice(`${t.partners.locationCustom}: ${matched.label}`);
    } else {
      setUserLocation(DEFAULT_LOCATION);
      setLocationNotice(t.partners.locationFallback);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      setLocationNotice(t.partners.locationFallback);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`,
          isFallback: false,
        };
        setUserLocation(coords);
        setLocationNotice(`${t.partners.locationCustom}: ${coords.label}`);
      },
      () => {
        setLocating(false);
        setUserLocation(DEFAULT_LOCATION);
        setLocationNotice(t.partners.locationFallback);
      },
      { timeout: 6000 }
    );
  };

  const filteredPartners = useMemo(() => {
    return PARTNERS.map((p) => ({
      ...p,
      distanceKm: haversineKm(state.userLocation.lat, state.userLocation.lng, p.lat, p.lng),
    }))
      .filter((p) => {
        if (typeFilter !== 'All' && p.type !== typeFilter) return false;
        if (pickupOnly && !p.pickupAvailable) return false;
        if (conditionFilter !== 'all' && !p.acceptedConditions.includes(conditionFilter)) {
          return false;
        }
        if (p.distanceKm > maxDistKm) return false;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [state.userLocation, typeFilter, pickupOnly, conditionFilter, maxDistKm]);

  const clearAllFilters = () => {
    setConditionFilter('all');
    setTypeFilter('All');
    setMaxDistKm(50);
    setPickupOnly(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.partners.title}</h1>
        <p className="text-xs text-[#2A2A2A]/75 mt-1">{t.partners.subtitle}</p>
      </div>

      {/* Location Search & GPS Bar */}
      <section className="garment-tag-card p-3.5 space-y-2.5">
        <form onSubmit={handleLocationSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#2B3A67]/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.partners.pincodePlaceholder}
              aria-label={t.partners.pincodePlaceholder}
              className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border border-[#2B3A67]/20 bg-[#FBF6EA] text-xs text-[#2A2A2A] focus:outline-2 focus:outline-[#2B3A67]"
            />
          </div>
          <button
            type="submit"
            aria-label="Search pincode"
            className="min-h-[42px] px-3.5 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-xs font-semibold whitespace-nowrap"
          >
            Go
          </button>
        </form>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#1F8A87]/12 text-[#1F8A87] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#1F8A87]/20 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{locating ? t.partners.locating : t.partners.useLocation}</span>
          </button>

          <span className="text-[11px] text-[#2A2A2A]/70 truncate">
            {locationNotice || state.userLocation.label}
          </span>
        </div>
      </section>

      {/* View Toggle (List vs Map) + Filters Expand */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex p-1 rounded-xl bg-[#EFE6D2] border border-[#2B3A67]/12">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-[#FFFDF8] text-[#2B3A67] shadow-sm'
                : 'text-[#2A2A2A]/70'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{t.partners.listView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-[#FFFDF8] text-[#2B3A67] shadow-sm'
                : 'text-[#2A2A2A]/70'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{t.partners.mapView}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
            showFilters || conditionFilter !== 'all' || typeFilter !== 'All' || pickupOnly
              ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67]'
              : 'bg-[#FFFDF8] text-[#2B3A67] border-[#2B3A67]/20'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Collapsible Filter Drawer */}
      {showFilters && (
        <section className="garment-tag-card p-4 space-y-3.5">
          <div>
            <div className="text-xs font-bold text-[#2B3A67] mb-2">
              {t.partners.conditionFilterLabel}
            </div>
            <ConditionHelper
              value={conditionFilter}
              onChange={setConditionFilter}
              includeAll
              compact
            />
          </div>

          <div>
            <div className="text-xs font-bold text-[#2B3A67] mb-1.5">
              {t.partners.typeFilterLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PARTNER_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    typeFilter === type
                      ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67]'
                      : 'bg-[#FBF6EA] text-[#2A2A2A] border-[#2B3A67]/18'
                  }`}
                >
                  {t.partners.types[type] || type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <label className="text-xs font-semibold text-[#2B3A67] flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(e) => setPickupOnly(e.target.checked)}
                className="w-4 h-4 accent-[#2B3A67] rounded"
              />
              <span>{t.partners.pickupOnly}</span>
            </label>

            <select
              aria-label={t.partners.distanceFilterLabel}
              value={maxDistKm}
              onChange={(e) => setMaxDistKm(Number(e.target.value))}
              className="min-h-[36px] px-2.5 rounded-lg border border-[#2B3A67]/20 bg-[#FBF6EA] text-xs font-medium text-[#2B3A67]"
            >
              <option value={50}>{t.common.all} (&le; 50 km)</option>
              <option value={10}>&le; 10 km</option>
              <option value={20}>&le; 20 km</option>
              <option value={30}>&le; 30 km</option>
            </select>
          </div>
        </section>
      )}

      {/* Selected Partner Prompt Banner when items are in bag */}
      {state.selectedPartnerId && state.bagItems.length > 0 && (
        <Link
          to="/bag"
          className="rounded-xl bg-[#1F8A87] text-[#FBF6EA] px-4 py-3 flex items-center justify-between gap-2 shadow-sm hover:bg-[#197471] transition-colors"
        >
          <span className="text-xs font-semibold">
            {PARTNERS.find((p) => p.id === state.selectedPartnerId)?.name} ·{' '}
            {state.bagItems.length} {t.common.items}
          </span>
          <span className="text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap">
            <span>{t.passport.goToBag}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      )}

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <PartnerMap
          partners={filteredPartners}
          userLocation={state.userLocation}
          selectedPartnerId={state.selectedPartnerId}
          onSelectPartner={selectPartner}
        />
      ) : filteredPartners.length === 0 ? (
        <div className="garment-tag-card p-6 text-center space-y-3">
          <MapPin className="w-8 h-8 text-[#C65D3B] mx-auto" />
          <p className="text-sm font-medium text-[#2A2A2A]/80">{t.partners.noPartners}</p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-xs font-semibold"
          >
            {t.common.clearFilters}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPartners.map((partner) => {
            const isSelected = state.selectedPartnerId === partner.id;
            return (
              <article
                key={partner.id}
                className={`garment-tag-card p-4 pr-7 space-y-2.5 transition-all ${
                  isSelected ? 'ring-2 ring-[#1F8A87] border-[#1F8A87]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-[#1F8A87] uppercase tracking-wide">
                      {t.partners.types[partner.type] || partner.type} ·{' '}
                      <span className="tabular-nums">
                        {partner.distanceKm} {t.common.kmAway}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#2B3A67] leading-snug mt-0.5">
                      {partner.name}
                    </h2>
                    <div className="text-xs text-[#2A2A2A]/70">
                      {partner.area} · {partner.pincode}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#2A2A2A]/80 leading-relaxed">
                  {partner.blurb[lang]}
                </p>

                <div className="text-[11px] text-[#2A2A2A]/75 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 border-t border-[#2B3A67]/10">
                  <span>
                    <strong className="text-[#2B3A67]">{t.partners.acceptedFabrics}:</strong>{' '}
                    {partner.acceptedFabrics.join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-[#2A2A2A]/80">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#2B3A67]" />
                    <span>
                      {partner.pickupAvailable ? t.partners.pickupYes : t.partners.pickupNo}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {t.partners.minQty} {partner.minQty} {t.common.items}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => selectPartner(partner.id)}
                  className={`w-full min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#1F8A87] text-[#FBF6EA]'
                      : 'bg-[#2B3A67] text-[#FBF6EA] hover:bg-[#233056]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  <span>{isSelected ? t.partners.selectedBtn : t.partners.selectBtn}</span>
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
