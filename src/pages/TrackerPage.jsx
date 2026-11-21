import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Phone,
  MessageCircle,
  Award,
  Sparkles,
  User,
} from 'lucide-react';
import { getGarmentById } from '../data/garments';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { GarmentIllustration } from '../components/GarmentIllustration';
import { StitchDivider } from '../components/StitchDivider';

function getWeaverLevel(points, t) {
  if (points >= 300) return t.track.levels.green;
  if (points >= 100) return t.track.levels.vastra;
  return t.track.levels.dhaga;
}

export function TrackerPage() {
  const { id } = useParams();
  const { state, t, lang } = useThreadTrail();
  const [now, setNow] = useState(Date.now());
  const [callBanner, setCallBanner] = useState(false);

  const pickup = state.pickups.find((p) => p.id === id);

  // Simulated progress: advances one step every ~5 seconds from pickup.createdAt
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!pickup) {
    return (
      <div className="garment-tag-card p-6 text-center space-y-4 mt-4">
        <h1 className="font-display text-xl font-bold text-[#2B3A67]">{t.track.emptyTitle}</h1>
        <Link
          to="/track"
          className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-semibold"
        >
          {t.home.viewAllPickups}
        </Link>
      </div>
    );
  }

  const elapsedSeconds = Math.max(0, Math.floor((now - pickup.createdAt) / 1000));
  const currentStep = Math.min(5, Math.floor(elapsedSeconds / 5));
  const isCompleted = currentStep === 5;
  const agentAssigned = currentStep >= 2;

  const slotSummary = `${t.bag.dates[pickup.dateKey] || ''} · ${
    t.bag.slots[pickup.slotKey] || ''
  }`;

  const whatsappText = t.track.whatsappUpdates[currentStep]
    .replace('{id}', pickup.id)
    .replace('{count}', String(pickup.items.length))
    .replace('{partner}', pickup.partnerName)
    .replace('{slot}', slotSummary)
    .replace('{agent}', pickup.agent?.name || 'Ramesh Kumar')
    .replace('{pincode}', pickup.pincode || '201309')
    .replace('{weight}', String(pickup.totalWeightKg));

  const garmentsDetailed = pickup.items
    .map((item) => {
      const g = getGarmentById(item.garmentId);
      return g ? { ...item, garment: g } : null;
    })
    .filter(Boolean);

  const totalWaterLitres = garmentsDetailed.reduce(
    (sum, item) => sum + Math.round(item.garment.waterLitres * 0.45),
    0
  );

  const handleSimulatedCall = () => {
    setCallBanner(true);
    setTimeout(() => setCallBanner(false), 3500);
  };

  return (
    <div className="tracker-page space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/track"
          className="inline-flex items-center gap-1.5 min-h-[40px] px-1 text-sm font-semibold text-[#2B3A67] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>
        <span className="text-xs font-bold text-[#1F8A87] tabular-nums">{pickup.id}</span>
      </div>

      {/* Header Summary Card */}
      <section className="garment-tag-card p-4 pr-7 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#2B3A67]/65">
          {t.track.trackingId}: <span className="tabular-nums">{pickup.id}</span>
        </div>
        <h1 className="font-display text-xl font-bold text-[#2B3A67] leading-snug">
          {pickup.partnerName}
        </h1>
        <div className="text-xs text-[#2A2A2A]/75">
          {t.track.scheduledFor}: {slotSummary}
        </div>
      </section>

      {/* WhatsApp-Style Live Status Bubble */}
      <section
        aria-label="Live status message"
        className="rounded-2xl bg-[#E8F4EF] border border-[#1F8A87]/25 p-3.5 space-y-1.5"
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-[#1F8A87]">
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>ThreadTrail Updates</span>
          </span>
          <span className="tabular-nums text-[#1F8A87]/75">
            {t.home.stepProgress} {currentStep + 1}/6
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[#1E3B39] bg-white/85 rounded-xl rounded-tl-none p-3 border border-[#1F8A87]/15">
          {whatsappText}
        </p>
      </section>

      {/* Simulated Agent Card once assigned (step >= 2) */}
      {agentAssigned && pickup.agent && (
        <section className="garment-tag-card p-3.5 pr-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2B3A67] text-[#E9A820] flex items-center justify-center font-display font-bold text-base shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-[#1F8A87]">
                {t.track.agentTitle}
              </div>
              <div className="font-semibold text-sm text-[#2B3A67]">{pickup.agent.name}</div>
              <div className="text-[11px] text-[#2A2A2A]/70">{pickup.agent.vehicle}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulatedCall}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#1F8A87] text-[#FBF6EA] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#197471] shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.track.callAgent}</span>
          </button>
        </section>
      )}

      {callBanner && pickup.agent && (
        <div
          role="status"
          className="rounded-xl bg-[#2B3A67] text-[#FBF6EA] px-4 py-2.5 text-xs font-medium text-center"
        >
          {t.track.callingSim} {pickup.agent.name} ({pickup.agent.phone})
        </div>
      )}

      {/* Completion Thank-You & Impact Card */}
      {isCompleted && (
        <section className="indigo-textile-panel rounded-2xl bg-[#2B3A67] text-[#FBF6EA] overflow-hidden shadow-md">
          <div className="h-2 w-full ajrakh-border" aria-hidden="true" />
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#E9A820] font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{t.track.levelLabel}: {getWeaverLevel(state.points, t)}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-[#FBF6EA]">
              {t.track.thankYouTitle}
            </h2>
            <p className="text-xs text-[#FBF6EA]/85 leading-relaxed">
              {t.track.thankYouDesc}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-xl bg-[#FBF6EA]/10 p-2.5 text-center">
                <div className="text-lg font-bold text-[#E9A820] tabular-nums">
                  {pickup.totalWeightKg} {t.common.kg}
                </div>
                <div className="text-[10px] text-[#FBF6EA]/80 mt-0.5">
                  {t.track.kgDivertedLabel}
                </div>
              </div>
              <div className="rounded-xl bg-[#FBF6EA]/10 p-2.5 text-center">
                <div className="text-lg font-bold text-[#1F8A87] bg-[#FBF6EA] rounded-md px-1 inline-block tabular-nums">
                  +{pickup.pointsEarned}
                </div>
                <div className="text-[10px] text-[#FBF6EA]/80 mt-1">
                  {t.track.pointsAwarded}
                </div>
              </div>
              <div className="rounded-xl bg-[#FBF6EA]/10 p-2.5 text-center">
                <div className="text-lg font-bold text-[#FBF6EA] tabular-nums flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-[#E9A820]" />
                  <span>{state.points}</span>
                </div>
                <div className="text-[10px] text-[#FBF6EA]/80 mt-0.5">
                  {t.track.totalPointsLabel}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#E9A820] pt-1">
              {t.track.relatableImpact.replace('{litres}', totalWaterLitres.toLocaleString())}
            </div>
          </div>
        </section>
      )}

      {/* 6-Step Vertical Timeline */}
      <section className="garment-tag-card p-4 space-y-3">
        <div className="flex items-center justify-between pr-5">
          <h2 className="font-display text-lg font-bold text-[#2B3A67]">
            {t.track.liveTimeline}
          </h2>
        </div>

        <ol className="space-y-3.5 relative pl-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2B3A67]/15">
          {t.track.steps.map((label, idx) => {
            const done = idx < currentStep || (idx === 5 && isCompleted);
            const active = idx === currentStep && !isCompleted;
            return (
              <li key={label} className="relative flex items-center gap-3">
                <span
                  className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    done
                      ? 'bg-[#1F8A87] text-[#FBF6EA]'
                      : active
                      ? 'bg-[#E9A820] text-[#2B3A67] ring-4 ring-[#E9A820]/30 animate-pulse'
                      : 'bg-[#FBF6EA] border-2 border-[#2B3A67]/25 text-[#2B3A67]/45'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
                </span>
                <span
                  className={`text-sm pl-2 ${
                    done
                      ? 'font-semibold text-[#1F8A87]'
                      : active
                      ? 'font-bold text-[#2B3A67]'
                      : 'text-[#2A2A2A]/50'
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="text-[11px] text-[#2A2A2A]/55 pt-1">{t.track.simulatedNote}</p>
      </section>

      <StitchDivider />

      {/* Items in this pickup */}
      <section className="space-y-2.5">
        <h2 className="font-display text-base font-bold text-[#2B3A67]">
          {t.track.garmentsInPickup}
        </h2>
        <div className="space-y-2">
          {garmentsDetailed.map(({ garment, condition }) => (
            <div
              key={garment.id}
              className="rounded-xl bg-[#FFFDF8] border border-[#2B3A67]/12 p-3 flex items-center gap-3"
            >
              <GarmentIllustration garment={garment} size="sm" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#2B3A67] truncate">
                  {garment.name[lang]}
                </div>
                <div className="text-xs text-[#2A2A2A]/70">
                  {garment.brand} · {t.passport.conditions[condition]?.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
