import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  QrCode,
  Trash2,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getGarmentById } from '../data/garments';
import { PARTNERS } from '../data/partners';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { GarmentIllustration } from '../components/GarmentIllustration';
import { StitchDivider } from '../components/StitchDivider';

export function BagPage() {
  const navigate = useNavigate();
  const { state, t, lang, removeFromBag, confirmPickup } = useThreadTrail();

  const selectedPartner = PARTNERS.find((p) => p.id === state.selectedPartnerId) || null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('201309');
  const [dateKey, setDateKey] = useState('tomorrow');
  const [slotKey, setSlotKey] = useState('morning');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedId, setConfirmedId] = useState('');

  const bagDetailed = state.bagItems
    .map((item) => {
      const garment = getGarmentById(item.garmentId);
      return garment ? { ...item, garment } : null;
    })
    .filter(Boolean);

  const totalWeightKg =
    Math.round(
      bagDetailed.reduce((sum, item) => sum + item.garment.weightKg, 0) * 100
    ) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartner) {
      setErrorMsg(t.bag.errPartner);
      return;
    }
    if (!name.trim()) {
      setErrorMsg(t.bag.errName);
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setErrorMsg(t.bag.errPhone);
      return;
    }
    if (!address.trim()) {
      setErrorMsg(t.bag.errAddress);
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMsg(t.bag.errPincode);
      return;
    }

    setErrorMsg('');
    const trackingId = confirmPickup({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      dateKey,
      slotKey,
      note: note.trim(),
    });

    if (trackingId) {
      setConfirmedId(trackingId);
      setTimeout(() => {
        navigate(`/track/${trackingId}`);
      }, 950);
    }
  };

  if (confirmedId) {
    return (
      <div className="garment-tag-card p-6 text-center space-y-3 mt-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#1F8A87]/15 text-[#1F8A87] flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{confirmedId}</h1>
        <p className="text-sm text-[#2A2A2A]/80">
          {t.track.steps[0]} · {selectedPartner?.name}
        </p>
      </div>
    );
  }

  if (bagDetailed.length === 0) {
    return (
      <div className="space-y-5">
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.bag.title}</h1>
        <div className="garment-tag-card p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2B3A67]/8 text-[#2B3A67] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[#E9A820]" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-[#2B3A67]">
              {t.bag.emptyTitle}
            </h2>
            <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
              {t.bag.emptyDesc}
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-semibold hover:bg-[#233056]"
          >
            <QrCode className="w-4 h-4 text-[#E9A820]" />
            <span>{t.bag.scanFirst}</span>
          </Link>
        </div>
      </div>
    );
  }

  const remainingForFree = selectedPartner
    ? Math.max(0, selectedPartner.minQty - bagDetailed.length)
    : 0;

  return (
    <div className="bag-page space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.bag.title}</h1>
          <p className="text-xs text-[#2A2A2A]/75 mt-1">{t.bag.subtitle}</p>
        </div>
        <span className="text-xs font-semibold text-[#1F8A87] tabular-nums whitespace-nowrap pt-1">
          {bagDetailed.length} {bagDetailed.length === 1 ? t.common.item : t.common.items} ·{' '}
          {totalWeightKg} {t.common.kg}
        </span>
      </div>

      {/* Selected Partner Card */}
      <section className="garment-tag-card p-4 pr-7 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#2B3A67]/65">
            {t.bag.selectedPartner}
          </span>
          <Link
            to="/partners"
            className="text-xs font-bold text-[#1F8A87] hover:underline min-h-[32px] inline-flex items-center"
          >
            {selectedPartner ? t.common.change : t.bag.choosePartner}
          </Link>
        </div>

        {selectedPartner ? (
          <div className="space-y-1.5">
            <div className="font-display text-base font-bold text-[#2B3A67]">
              {selectedPartner.name}
            </div>
            <div className="text-xs text-[#2A2A2A]/70 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1F8A87] shrink-0" />
              <span>{selectedPartner.area}</span>
            </div>

            {/* Pickup progress hint */}
            <div
              className={`mt-2 rounded-xl px-3 py-2 text-xs font-medium ${
                remainingForFree === 0
                  ? 'bg-[#1F8A87]/12 text-[#1F8A87]'
                  : 'bg-[#E9A820]/18 text-[#7C5000]'
              }`}
            >
              {!selectedPartner.pickupAvailable
                ? t.bag.dropOffNote
                : remainingForFree === 0
                ? `${bagDetailed.length} ${t.common.items}. ${t.bag.hintEnough}`
                : t.bag.hintNeedMore
                    .replace('{count}', String(remainingForFree))
                    .replace('{partner}', selectedPartner.name)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs text-[#C65D3B] font-medium">{t.bag.noPartner}</span>
            <Link
              to="/partners"
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-xs font-semibold inline-flex items-center"
            >
              {t.bag.choosePartner}
            </Link>
          </div>
        )}
      </section>

      {/* Scanned Garments List */}
      <section className="space-y-2.5">
        {bagDetailed.map(({ garment, condition }) => {
          const condInfo = t.passport.conditions[condition] || t.passport.conditions.good;
          return (
            <div
              key={garment.id}
              className="rounded-2xl bg-[#FFFDF8] border border-[#2B3A67]/14 p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <GarmentIllustration garment={garment} size="sm" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#2B3A67] truncate">
                    {garment.name[lang]}
                  </div>
                  <div className="text-[11px] text-[#2A2A2A]/70 tabular-nums">
                    {garment.weightKg} {t.common.kg} ·{' '}
                    <span className="font-semibold text-[#1F8A87]">{condInfo.label}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFromBag(garment.id)}
                aria-label={`${t.common.remove} ${garment.name[lang]}`}
                className="min-w-[40px] min-h-[40px] rounded-xl text-[#C65D3B] hover:bg-[#C65D3B]/10 flex items-center justify-center shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Always-visible Scan another QR button */}
        <Link
          to="/scan"
          className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-dashed border-[#2B3A67]/35 bg-[#FFFDF8] text-[#2B3A67] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#2B3A67]/5 transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#E9A820]" />
          <span>{t.bag.scanAnother}</span>
        </Link>
      </section>

      <StitchDivider />

      {/* Pickup Scheduling Form */}
      <form onSubmit={handleSubmit} className="garment-tag-card p-4 space-y-4">
        <h2 className="font-display text-lg font-bold text-[#2B3A67]">{t.bag.formTitle}</h2>

        <div className="space-y-3">
          <div>
            <label htmlFor="pickup-name" className="block text-xs font-semibold text-[#2B3A67] mb-1">
              {t.bag.nameLabel}
            </label>
            <input
              id="pickup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.bag.namePlaceholder}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#2B3A67]/22 bg-[#FBF6EA] text-sm focus:outline-2 focus:outline-[#2B3A67]"
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <label htmlFor="pickup-phone" className="block text-xs font-semibold text-[#2B3A67] mb-1">
                {t.bag.phoneLabel}
              </label>
              <div className="flex items-center rounded-xl border border-[#2B3A67]/22 bg-[#FBF6EA] overflow-hidden focus-within:outline-2 focus-within:outline-[#2B3A67]">
                <span className="px-2.5 text-xs font-bold text-[#2B3A67]/70 border-r border-[#2B3A67]/15">
                  +91
                </span>
                <input
                  id="pickup-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.bag.phonePlaceholder}
                  className="w-full min-h-[44px] px-2.5 bg-transparent text-sm focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="pickup-pin" className="block text-xs font-semibold text-[#2B3A67] mb-1">
                {t.bag.pincodeLabel}
              </label>
              <input
                id="pickup-pin"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#2B3A67]/22 bg-[#FBF6EA] text-sm tabular-nums focus:outline-2 focus:outline-[#2B3A67]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pickup-address" className="block text-xs font-semibold text-[#2B3A67] mb-1">
              {t.bag.addressLabel}
            </label>
            <input
              id="pickup-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.bag.addressPlaceholder}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#2B3A67]/22 bg-[#FBF6EA] text-sm focus:outline-2 focus:outline-[#2B3A67]"
            />
          </div>

          {/* Tappable Date Chips */}
          <div>
            <div className="text-xs font-semibold text-[#2B3A67] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1F8A87]" />
              <span>{t.bag.dateLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['tomorrow', 'dayAfter', 'weekend'].map((dk) => (
                <button
                  key={dk}
                  type="button"
                  onClick={() => setDateKey(dk)}
                  className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    dateKey === dk
                      ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67]'
                      : 'bg-[#FBF6EA] text-[#2A2A2A] border-[#2B3A67]/20'
                  }`}
                >
                  {t.bag.dates[dk]}
                </button>
              ))}
            </div>
          </div>

          {/* Tappable Time Slot Chips */}
          <div>
            <div className="text-xs font-semibold text-[#2B3A67] mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1F8A87]" />
              <span>{t.bag.slotLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['morning', 'afternoon', 'evening'].map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => setSlotKey(sk)}
                  className={`min-h-[44px] px-1.5 py-1.5 rounded-xl text-[11px] font-semibold border leading-tight transition-colors ${
                    slotKey === sk
                      ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67]'
                      : 'bg-[#FBF6EA] text-[#2A2A2A] border-[#2B3A67]/20'
                  }`}
                >
                  {t.bag.slots[sk]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="pickup-note" className="block text-xs font-semibold text-[#2B3A67] mb-1">
              {t.bag.noteLabel}
            </label>
            <input
              id="pickup-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.bag.notePlaceholder}
              className="w-full min-h-[42px] px-3 rounded-xl border border-[#2B3A67]/22 bg-[#FBF6EA] text-sm focus:outline-2 focus:outline-[#2B3A67]"
            />
          </div>
        </div>

        {/* Summary Card before final confirm */}
        <div className="rounded-xl bg-[#FBF6EA] border border-[#2B3A67]/15 p-3.5 space-y-1.5 text-xs">
          <div className="font-bold text-[#2B3A67] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E9A820]" />
            <span>{t.bag.summaryTitle}</span>
          </div>
          <div className="text-[#2A2A2A]/85 tabular-nums">
            {bagDetailed.length} {bagDetailed.length === 1 ? t.common.item : t.common.items} ·{' '}
            {totalWeightKg} {t.common.kg} · +{bagDetailed.length * 10} {t.common.pts}
          </div>
          <div className="text-[#2A2A2A]/75">
            {t.bag.dates[dateKey]} · {t.bag.slots[slotKey]}
            {selectedPartner ? ` · ${selectedPartner.name}` : ''}
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-[#C65D3B]" role="alert">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="w-full min-h-[50px] px-5 py-3 rounded-xl bg-[#2B3A67] text-[#FBF6EA] font-bold text-base flex items-center justify-center gap-2 shadow-sm hover:bg-[#233056] active:scale-[0.98] transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-[#E9A820]" />
          <span>{t.bag.confirmBtn}</span>
        </button>
      </form>
    </div>
  );
}
