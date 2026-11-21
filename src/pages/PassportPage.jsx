import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shirt,
  Leaf,
  Recycle,
  Thermometer,
  Ban,
  Flame,
  Wind,
  Sparkles,
  Droplets,
  Cloud,
  Clock,
  CheckCircle2,
  ShoppingBag,
  QrCode,
} from 'lucide-react';
import { getGarmentById } from '../data/garments';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { GarmentIllustration } from '../components/GarmentIllustration';
import { ConditionHelper } from '../components/ConditionHelper';
import { StitchDivider } from '../components/StitchDivider';

const TAB_ORDER = ['care', 'eco', 'story', 'next'];

const ECO_SCORE_STYLES = {
  A: { percent: 92, color: '#1F8A87', labelEn: 'Excellent', labelHi: 'उत्कृष्ट' },
  B: { percent: 76, color: '#2B3A67', labelEn: 'Good', labelHi: 'अच्छा' },
  C: { percent: 58, color: '#E9A820', labelEn: 'Moderate', labelHi: 'मध्यम' },
  D: { percent: 40, color: '#C65D3B', labelEn: 'Fair', labelHi: 'सामान्य' },
  E: { percent: 24, color: '#8C3418', labelEn: 'High Impact', labelHi: 'उच्च प्रभाव' },
};

export function PassportPage() {
  const { id } = useParams();
  const garment = getGarmentById(id);
  const { state, t, lang, addToBag, updateBagItemCondition } = useThreadTrail();

  const existingBagItem = garment
    ? state.bagItems.find((item) => item.garmentId === garment.id)
    : null;

  const [activeTab, setActiveTab] = useState('care');
  const [condition, setCondition] = useState(existingBagItem?.condition || 'good');
  const [justAdded, setJustAdded] = useState(false);
  const [updatedMsg, setUpdatedMsg] = useState(false);

  const touchStartX = useRef(null);
  const tabsRef = useRef(null);

  if (!garment) {
    return (
      <div className="garment-tag-card p-6 text-center space-y-4 mt-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C65D3B]/15 text-[#C65D3B] flex items-center justify-center">
          <QrCode className="w-7 h-7" />
        </div>
        <h1 className="font-display text-xl font-bold text-[#2B3A67]">
          {t.passport.notFoundTitle}
        </h1>
        <p className="text-sm text-[#2A2A2A]/75">{t.passport.notFoundDesc}</p>
        <Link
          to="/scan"
          className="inline-flex items-center justify-center min-h-[46px] px-5 py-2.5 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-semibold"
        >
          {t.passport.backToScan}
        </Link>
      </div>
    );
  }

  const jumpToTab = (tabKey) => {
    setActiveTab(tabKey);
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 55) return;
    const currentIdx = TAB_ORDER.indexOf(activeTab);
    if (diff < 0 && currentIdx < TAB_ORDER.length - 1) {
      setActiveTab(TAB_ORDER[currentIdx + 1]);
    } else if (diff > 0 && currentIdx > 0) {
      setActiveTab(TAB_ORDER[currentIdx - 1]);
    }
  };

  const handleAddOrUpdate = () => {
    if (existingBagItem) {
      updateBagItemCondition(garment.id, condition);
      setUpdatedMsg(true);
      setTimeout(() => setUpdatedMsg(false), 2500);
      return;
    }
    const added = addToBag(garment.id, condition);
    if (added) {
      setJustAdded(true);
    }
  };

  const ecoMeta = ECO_SCORE_STYLES[garment.ecoScore] || ECO_SCORE_STYLES.B;
  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - ecoMeta.percent / 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/scan"
          className="inline-flex items-center gap-1.5 min-h-[40px] px-1 text-sm font-semibold text-[#2B3A67] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>
        <span className="text-xs font-semibold text-[#2B3A67]/65 tabular-nums">
          {garment.id} · {garment.size}
        </span>
      </div>

      {/* Garment Identity Tag Card */}
      <section className="garment-tag-card p-4 pr-7 flex items-center gap-3.5">
        <GarmentIllustration garment={garment} size="lg" />
        <div className="min-w-0 space-y-1">
          <div className="text-xs font-medium text-[#2A2A2A]/65">
            {garment.brand} · {garment.category[lang]}
          </div>
          <h1 className="font-display text-xl font-bold text-[#2B3A67] leading-tight">
            {garment.name[lang]}
          </h1>
          <div className="text-xs text-[#1F8A87] font-medium leading-snug">
            {garment.material[lang]}
          </div>
        </div>
      </section>

      {/* Three Large Choice Cards */}
      <section aria-label={t.passport.choicePrompt} className="space-y-2">
        <div className="text-xs font-semibold text-[#2B3A67]/75">
          {t.passport.choicePrompt}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => jumpToTab('care')}
            className={`min-h-[84px] p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              activeTab === 'care'
                ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67] shadow-sm'
                : 'bg-[#FFFDF8] text-[#2B3A67] border-[#2B3A67]/18 hover:border-[#2B3A67]/45'
            }`}
          >
            <Shirt
              className={`w-5 h-5 ${activeTab === 'care' ? 'text-[#E9A820]' : 'text-[#2B3A67]'}`}
            />
            <span className="text-xs font-semibold leading-tight mt-2">
              {t.passport.choices.care}
            </span>
          </button>

          <button
            type="button"
            onClick={() => jumpToTab('eco')}
            className={`min-h-[84px] p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              activeTab === 'eco'
                ? 'bg-[#1F8A87] text-[#FBF6EA] border-[#1F8A87] shadow-sm'
                : 'bg-[#FFFDF8] text-[#2B3A67] border-[#2B3A67]/18 hover:border-[#1F8A87]/50'
            }`}
          >
            <Leaf
              className={`w-5 h-5 ${activeTab === 'eco' ? 'text-[#E9A820]' : 'text-[#1F8A87]'}`}
            />
            <span className="text-xs font-semibold leading-tight mt-2">
              {t.passport.choices.eco}
            </span>
          </button>

          <button
            type="button"
            onClick={() => jumpToTab('next')}
            className={`min-h-[84px] p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              activeTab === 'next'
                ? 'bg-[#C65D3B] text-[#FBF6EA] border-[#C65D3B] shadow-sm'
                : 'bg-[#FFFDF8] text-[#2B3A67] border-[#2B3A67]/18 hover:border-[#C65D3B]/50'
            }`}
          >
            <Recycle
              className={`w-5 h-5 ${activeTab === 'next' ? 'text-[#FBF6EA]' : 'text-[#C65D3B]'}`}
            />
            <span className="text-xs font-semibold leading-tight mt-2">
              {t.passport.choices.done}
            </span>
          </button>
        </div>
      </section>

      {/* Passport Tabs: Care | Eco | Story | Next Life */}
      <div ref={tabsRef} className="scroll-mt-16">
        <div
          role="tablist"
          aria-label="Garment passport sections"
          className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#EFE6D2] border border-[#2B3A67]/12"
        >
          {TAB_ORDER.map((tabKey) => {
            const active = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tabKey)}
                className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#FFFDF8] text-[#2B3A67] shadow-sm'
                    : 'text-[#2A2A2A]/70 hover:text-[#2B3A67]'
                }`}
              >
                {t.passport.tabs[tabKey]}
              </button>
            );
          })}
        </div>

        {/* Swipeable Tab Panel */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="mt-3 garment-tag-card p-4 space-y-4"
        >
          {/* CARE TAB */}
          {activeTab === 'care' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    icon: Thermometer,
                    label: t.passport.careLabels.washTemp,
                    value: garment.care.washTemp[lang],
                  },
                  {
                    icon: Ban,
                    label: t.passport.careLabels.bleach,
                    value: garment.care.bleach[lang],
                  },
                  {
                    icon: Flame,
                    label: t.passport.careLabels.iron,
                    value: garment.care.iron[lang],
                  },
                  {
                    icon: Wind,
                    label: t.passport.careLabels.tumbleDry,
                    value: garment.care.tumbleDry[lang],
                  },
                  {
                    icon: Sparkles,
                    label: t.passport.careLabels.dryClean,
                    value: garment.care.dryClean[lang],
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl bg-[#FBF6EA] border border-[#2B3A67]/12 p-3 space-y-1.5 last:col-span-2"
                    >
                      <div className="flex items-center gap-2 text-[#2B3A67]">
                        <Icon className="w-4 h-4 text-[#1F8A87] shrink-0" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <p className="text-xs text-[#2A2A2A]/85 leading-snug">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-[#E9A820]/15 border border-[#E9A820]/35 p-3.5 space-y-1">
                <div className="text-xs font-bold text-[#2B3A67]">
                  {t.passport.careTipHeading}
                </div>
                <p className="text-xs leading-relaxed text-[#2A2A2A]/90">
                  {garment.careTip[lang]}
                </p>
              </div>
            </div>
          )}

          {/* ECO TAB */}
          {activeTab === 'eco' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Eco Score SVG Ring */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 84 84" aria-hidden="true">
                    <circle
                      cx="42"
                      cy="42"
                      r={ringRadius}
                      fill="none"
                      stroke="#EFE6D2"
                      strokeWidth="8"
                    />
                    <circle
                      cx="42"
                      cy="42"
                      r={ringRadius}
                      fill="none"
                      stroke={ecoMeta.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-2xl font-display font-bold leading-none"
                      style={{ color: ecoMeta.color }}
                    >
                      {garment.ecoScore}
                    </span>
                    <span className="text-[10px] font-semibold text-[#2A2A2A]/70 mt-0.5">
                      {lang === 'hi' ? ecoMeta.labelHi : ecoMeta.labelEn}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#2B3A67]/70">
                    {t.passport.ecoScoreLabel}
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#2B3A67]">
                    {t.passport.ecoHeading}
                  </h2>
                  <p className="text-xs text-[#2A2A2A]/75 leading-snug">
                    {t.passport.recycledContent}:{' '}
                    <strong className="text-[#1F8A87] tabular-nums">
                      {garment.recycledPercent}%
                    </strong>{' '}
                    · {t.passport.expectedLifespan}:{' '}
                    <strong className="tabular-nums">
                      {garment.lifespanYears} {t.passport.years}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="rounded-xl bg-[#FBF6EA] border border-[#2B3A67]/12 p-3 flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-[#1F8A87] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#2B3A67]">
                      {t.passport.waterUsed}:{' '}
                      <span className="tabular-nums">
                        {garment.waterLitres.toLocaleString()} L
                      </span>
                    </div>
                    <div className="text-xs text-[#2A2A2A]/75 mt-0.5 tabular-nums">
                      ≈ {garment.waterDaysDrinking} {t.passport.waterDrinking}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FBF6EA] border border-[#2B3A67]/12 p-3 flex items-start gap-3">
                  <Cloud className="w-5 h-5 text-[#2B3A67] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#2B3A67]">
                      {t.passport.co2Label}:{' '}
                      <span className="tabular-nums">{garment.co2Kg} kg CO₂e</span>
                    </div>
                    <div className="text-xs text-[#2A2A2A]/75 mt-0.5 tabular-nums">
                      {t.passport.co2Relatable} ~{Math.round(garment.co2Kg * 5.2)} km
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#E9A820]/14 border border-[#E9A820]/30 p-3 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#946200] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#2B3A67]">
                      {t.passport.careTipHeading}
                    </div>
                    <div className="text-xs text-[#2A2A2A]/85 mt-0.5">
                      {garment.careTip[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STORY TAB */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-[#2B3A67]">
                {t.passport.storyHeading}
              </h2>
              <p className="text-sm text-[#2A2A2A]/85 leading-relaxed bg-[#FBF6EA] p-3.5 rounded-xl border border-[#2B3A67]/12">
                {garment.story[lang]}
              </p>
              <ol className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#2B3A67]/25">
                {garment.journey.map((step, i) => (
                  <li key={step.stage} className="relative flex items-start gap-3">
                    <span
                      className={`absolute -left-5 top-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        i === 4
                          ? 'bg-[#1F8A87] text-[#FBF6EA]'
                          : i === 3
                          ? 'bg-[#E9A820] text-[#2B3A67]'
                          : 'bg-[#2B3A67] text-[#FBF6EA]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="text-sm font-medium text-[#2A2A2A] pl-2">
                      {step[lang]}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* NEXT LIFE TAB */}
          {activeTab === 'next' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#2B3A67]">
                  {t.passport.nextLifeHeading}
                </h2>
                <p className="text-xs text-[#2A2A2A]/75 mt-0.5">
                  {t.passport.nextLifeSub}
                </p>
              </div>

              <ConditionHelper value={condition} onChange={setCondition} />

              <StitchDivider className="my-3" />

              {!justAdded ? (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleAddOrUpdate}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#2B3A67] text-[#FBF6EA] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#233056] active:scale-[0.98] transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E9A820]" />
                    <span>
                      {existingBagItem
                        ? existingBagItem.condition !== condition
                          ? t.passport.updateCondition
                          : t.passport.alreadyInBag
                        : t.passport.addToBag}
                    </span>
                  </button>

                  {updatedMsg && (
                    <div className="text-xs font-semibold text-[#1F8A87] text-center">
                      {t.passport.addedToast}
                    </div>
                  )}

                  {existingBagItem && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/scan"
                        className="min-h-[44px] px-3 py-2 rounded-xl border border-[#2B3A67]/25 bg-[#FBF6EA] text-[#2B3A67] text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{t.passport.scanAnother}</span>
                      </Link>
                      <Link
                        to="/bag"
                        className="min-h-[44px] px-3 py-2 rounded-xl bg-[#1F8A87] text-[#FBF6EA] text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t.passport.goToBag}</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  role="status"
                  className="rounded-2xl bg-[#1F8A87]/12 border border-[#1F8A87]/35 p-4 space-y-3 animate-[fadeIn_200ms_ease-out]"
                >
                  <div className="flex items-center gap-2 text-[#1F8A87] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{t.passport.addedToast}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to="/scan"
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#2B3A67]/25 bg-[#FFFDF8] text-[#2B3A67] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FBF6EA]"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{t.passport.scanAnother}</span>
                    </Link>
                    <Link
                      to="/bag"
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#233056]"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#E9A820]" />
                      <span>{t.passport.goToBag}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
