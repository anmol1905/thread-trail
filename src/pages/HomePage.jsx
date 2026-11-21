import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  FileCheck2,
  HeartHandshake,
  Truck,
  ArrowRight,
  Printer,
  RotateCcw,
  ChevronRight,
  PackageCheck,
  Shirt,
} from 'lucide-react';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { StitchDivider } from '../components/StitchDivider';

const STEP_ICONS = [QrCode, FileCheck2, HeartHandshake, Truck];

export function HomePage() {
  const {
    state,
    t,
    totalItemsDiverted,
    totalKgDiverted,
    resetDemoData,
  } = useThreadTrail();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetDemoData();
    setConfirmReset(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <div className="home-page space-y-5">
      {/* Hero Garment Tag Card */}
      <section className="garment-tag-card overflow-hidden">
        <div className="h-2 w-full ajrakh-border" aria-hidden="true" />
        <div className="p-5 space-y-4">
          <h1 className="font-display text-[26px] leading-[1.2] font-bold text-[#2B3A67] text-balance pr-4">
            {t.home.heroHeadline}
          </h1>
          <p className="text-[15px] leading-relaxed text-[#2A2A2A]/85">
            {t.home.heroSub}
          </p>
          <div className="pt-1 flex flex-col gap-2.5">
            <Link
              to="/scan"
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2B3A67] text-[#FBF6EA] font-semibold text-base flex items-center justify-center gap-2.5 shadow-sm hover:bg-[#233056] active:scale-[0.98] transition-all"
            >
              <QrCode className="w-5 h-5 text-[#E9A820]" />
              <span>{t.home.scanCta}</span>
            </Link>
            <Link
              to="/manual-add"
              className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-[#E9A820]/55 bg-[#E9A820]/10 text-[#2B3A67] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Shirt className="w-4 h-4 text-[#1F8A87]" />
              <span>{t.manual.homeButton}</span>
            </Link>
            <Link
              to="/demo-tags"
              className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-[#2B3A67]/20 bg-[#FBF6EA] text-[#2B3A67] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#2B3A67]/5 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#2B3A67]/75" />
              <span>{t.home.printDemoLink}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Strip */}
      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="font-display text-lg font-bold text-[#2B3A67] mb-3">
          {t.home.howTitle}
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {t.home.steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx];
            return (
              <div
                key={step.title}
                className="woven-card rounded-2xl bg-[#FFFDF8] border border-[#2B3A67]/12 p-3.5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#2B3A67]/8 text-[#2B3A67] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-[#2B3A67]/45 tabular-nums">
                    0{idx + 1}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#2B3A67] leading-snug">
                    {step.title}
                  </div>
                  <div className="text-xs text-[#2A2A2A]/70 leading-snug mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <StitchDivider />

      {/* Impact Summary */}
      <section aria-labelledby="impact-heading">
        <h2 id="impact-heading" className="font-display text-lg font-bold text-[#2B3A67] mb-3">
          {t.home.impactTitle}
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="woven-card rounded-2xl bg-[#FFFDF8] border border-[#2B3A67]/12 p-3 text-center">
            <div className="text-2xl font-bold text-[#2B3A67] tabular-nums">
              {totalItemsDiverted}
            </div>
            <div className="text-[11px] font-medium text-[#2A2A2A]/70 leading-tight mt-1">
              {t.home.itemsRecycled}
            </div>
          </div>
          <div className="woven-card rounded-2xl bg-[#FFFDF8] border border-[#1F8A87]/25 p-3 text-center">
            <div className="text-2xl font-bold text-[#1F8A87] tabular-nums">
              {totalKgDiverted}
            </div>
            <div className="text-[11px] font-medium text-[#2A2A2A]/70 leading-tight mt-1">
              {t.home.kgDiverted}
            </div>
          </div>
          <Link
            to="/rewards"
            aria-label={`${state.points} ${t.home.pointsEarned}. ${t.rewards.viewRewards}`}
            className="woven-card rounded-2xl bg-[#FFFDF8] border border-[#E9A820]/40 p-3 text-center block"
          >
            <div className="text-2xl font-bold text-[#B3780A] tabular-nums">
              {state.points}
            </div>
            <div className="text-[11px] font-medium text-[#2A2A2A]/70 leading-tight mt-1">
              {t.home.pointsEarned}
            </div>
            <div className="text-[10px] font-bold text-[#1F8A87] mt-1">{t.rewards.viewRewards} →</div>
          </Link>
        </div>
      </section>

      {/* Festival Nudge Banner (Indigo & Turmeric — no tricolor) */}
      <section className="indigo-textile-panel rounded-2xl bg-[#2B3A67] text-[#FBF6EA] p-4 relative overflow-hidden">
        <div
          className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#E9A820]/18 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-2">
          <h3 className="font-display text-base font-bold text-[#E9A820]">
            {t.home.festivalTitle}
          </h3>
          <p className="text-xs leading-relaxed text-[#FBF6EA]/90">
            {t.home.festivalDesc}
          </p>
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#E9A820] text-[#2B3A67] text-xs font-bold hover:bg-[#f0b438] transition-colors mt-1"
          >
            <span>{t.home.festivalCta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <StitchDivider />

      {/* Past Pickups List */}
      <section aria-labelledby="pickups-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="pickups-heading" className="font-display text-lg font-bold text-[#2B3A67]">
            {t.home.pastPickups}
          </h2>
          <Link
            to="/track"
            className="text-xs font-semibold text-[#1F8A87] hover:underline inline-flex items-center gap-0.5 min-h-[36px] px-1"
          >
            <span>{t.home.viewAllPickups}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {state.pickups.length === 0 ? (
          <div className="rounded-2xl bg-[#FFFDF8] border border-dashed border-[#2B3A67]/25 p-5 text-center text-sm text-[#2A2A2A]/70">
            {t.home.noPickupsYet}
          </div>
        ) : (
          <div className="space-y-2.5">
            {state.pickups.slice(0, 3).map((pickup) => {
              const stepIdx = Math.min(
                5,
                Math.floor((Date.now() - pickup.createdAt) / 5000)
              );
              const stepLabel = t.track.steps[stepIdx];
              const isDone = stepIdx === 5;
              return (
                <Link
                  key={pickup.id}
                  to={`/track/${pickup.id}`}
                  className="garment-tag-card block p-4 pr-8 hover:border-[#2B3A67]/35 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-[#1F8A87]/15 text-[#1F8A87]'
                            : 'bg-[#E9A820]/20 text-[#946200]'
                        }`}
                      >
                        <PackageCheck className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-[#2B3A67] tabular-nums">
                          {pickup.id} · {pickup.partnerName}
                        </div>
                        <div className="text-xs text-[#2A2A2A]/70 mt-0.5 tabular-nums">
                          {pickup.items.reduce((sum, item) => sum + (item.manual?.quantity || 1), 0)}{' '}
                          {pickup.items.reduce((sum, item) => sum + (item.manual?.quantity || 1), 0) === 1 ? t.common.item : t.common.items} ·{' '}
                          {pickup.totalWeightKg} {t.common.kg} · {stepLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiet Footer with hidden presentation reset */}
      <footer className="pt-4 pb-2 border-t border-[#2B3A67]/10 flex items-center justify-between text-xs text-[#2A2A2A]/55">
        <span className="inline-flex items-center gap-2">
          <span>{t.common.demoBadge}</span>
          <span aria-hidden="true">·</span>
          <a
            href="/image-credits.html"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#2B3A67] hover:underline"
          >
            {t.common.imageCredits}
          </a>
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 min-h-[36px] px-2 rounded-lg hover:text-[#C65D3B] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>
            {resetToast
              ? t.common.resetDone
              : confirmReset
              ? t.common.resetConfirm
              : t.common.resetDemo}
          </span>
        </button>
      </footer>
    </div>
  );
}
