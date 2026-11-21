import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, Gift, LockKeyhole, Sparkles, TicketPercent, X } from 'lucide-react';
import { REWARDS } from '../data/rewards';
import { useThreadTrail } from '../hooks/useThreadTrail';

const CATEGORY_KEYS = ['all', 'fashion', 'craft', 'care'];

export function RewardsPage() {
  const { state, t, lang, redeemReward } = useThreadTrail();
  const [category, setCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [copiedId, setCopiedId] = useState('');
  const redeemedIds = new Set((state.redeemedRewards || []).map((item) => item.rewardId));

  const visibleRewards = useMemo(
    () => REWARDS.filter((reward) => category === 'all' || reward.category === category),
    [category]
  );

  const handleRedeem = () => {
    if (!selectedReward || state.points < selectedReward.cost || redeemedIds.has(selectedReward.id)) return;
    redeemReward(selectedReward.id, selectedReward.cost, selectedReward.code);
    setSelectedReward(null);
  };

  const copyCode = async (reward) => {
    try {
      await navigator.clipboard.writeText(reward.code);
      setCopiedId(reward.id);
      window.setTimeout(() => setCopiedId(''), 1800);
    } catch {
      setCopiedId('');
    }
  };

  return (
    <div className="rewards-page space-y-5">
      <section className="indigo-textile-panel rounded-2xl p-5 text-[#FBF6EA] overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full border-[18px] border-[#E9A820]/15" aria-hidden="true" />
        <div className="relative z-10 flex items-start justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E9A820] text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>{t.rewards.eyebrow}</span>
            </div>
            <h1 className="font-display text-2xl font-bold mt-1.5">{t.rewards.title}</h1>
            <p className="text-xs text-[#FBF6EA]/82 mt-1 max-w-xl leading-relaxed">{t.rewards.subtitle}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-[#FBF6EA]/10 border border-[#FBF6EA]/15 px-4 py-3 text-center">
            <div className="text-3xl font-bold text-[#E9A820] tabular-nums">{state.points}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide">{t.rewards.points}</div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pb-1" role="tablist" aria-label={t.rewards.filterLabel}>
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={category === key}
            onClick={() => setCategory(key)}
            className={`min-h-[38px] px-3.5 rounded-xl border text-xs font-semibold whitespace-nowrap ${
              category === key
                ? 'bg-[#2B3A67] border-[#2B3A67] text-[#FBF6EA]'
                : 'bg-[#FFFDF8] border-[#2B3A67]/18 text-[#2B3A67]'
            }`}
          >
            {t.rewards.categories[key]}
          </button>
        ))}
      </div>

      <section aria-labelledby="offers-heading">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 id="offers-heading" className="font-display text-lg font-bold text-[#2B3A67]">{t.rewards.available}</h2>
            <p className="text-[11px] text-[#2A2A2A]/60 mt-0.5">{t.rewards.prototypeNote}</p>
          </div>
          <Link to="/scan" className="inline-flex items-center gap-1 text-xs font-bold text-[#1F8A87] min-h-[36px]">
            <span>{t.rewards.earnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rewards-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRewards.map((reward) => {
            const redeemed = redeemedIds.has(reward.id);
            const eligible = state.points >= reward.cost;
            return (
              <article key={reward.id} className={`reward-card reward-textile reward-textile--${reward.textile} rounded-2xl border border-[#2B3A67]/14 overflow-hidden`}>
                <div className="h-1.5 ajrakh-border" aria-hidden="true" />
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2B3A67] text-[#E9A820] flex items-center justify-center shrink-0">
                      <TicketPercent className="w-5 h-5" />
                    </div>
                    <span className="rounded-full bg-[#E9A820]/16 text-[#7C5000] px-2.5 py-1 text-[11px] font-bold tabular-nums">
                      {reward.cost} {t.common.pts}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F8A87]">{reward.brand}</div>
                    <h3 className="font-display text-lg font-bold text-[#2B3A67] leading-tight mt-0.5">{reward.title[lang]}</h3>
                    <p className="text-xs text-[#2A2A2A]/72 leading-relaxed mt-1.5 min-h-[38px]">{reward.description[lang]}</p>
                  </div>

                  {redeemed ? (
                    <div className="rounded-xl border border-dashed border-[#1F8A87]/45 bg-[#FBF6EA]/85 p-2.5">
                      <div className="text-[10px] font-bold uppercase text-[#1F8A87]">{t.rewards.yourCode}</div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <code className="font-bold text-sm text-[#2B3A67] tracking-wide">{reward.code}</code>
                        <button type="button" onClick={() => copyCode(reward)} className="min-w-[36px] min-h-[36px] rounded-lg text-[#2B3A67] flex items-center justify-center" aria-label={`${t.rewards.copy} ${reward.brand}`}>
                          {copiedId === reward.id ? <Check className="w-4 h-4 text-[#1F8A87]" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => eligible && setSelectedReward(reward)}
                      disabled={!eligible}
                      className={`w-full min-h-[44px] rounded-xl px-3 text-xs font-bold flex items-center justify-center gap-2 ${
                        eligible
                          ? 'bg-[#2B3A67] text-[#FBF6EA]'
                          : 'bg-[#EFE6D2] text-[#2A2A2A]/48 cursor-not-allowed'
                      }`}
                    >
                      {eligible ? <Gift className="w-4 h-4 text-[#E9A820]" /> : <LockKeyhole className="w-4 h-4" />}
                      <span>{eligible ? t.rewards.redeem : t.rewards.needPoints.replace('{count}', String(reward.cost - state.points))}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedReward && (
        <div className="fixed inset-0 z-[80] bg-[#2A2A2A]/45 backdrop-blur-sm p-4 flex items-end sm:items-center justify-center" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedReward(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="redeem-title" className="reward-dialog garment-tag-card w-full max-w-md p-5 pr-7 space-y-4 shadow-2xl">
            <button type="button" onClick={() => setSelectedReward(null)} className="absolute top-3 right-3 w-9 h-9 rounded-lg text-[#2B3A67]/65 flex items-center justify-center" aria-label={t.rewards.cancel}>
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#E9A820]/18 text-[#2B3A67] flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F8A87] uppercase tracking-wide">{selectedReward.brand}</div>
              <h2 id="redeem-title" className="font-display text-xl font-bold text-[#2B3A67] mt-1">{t.rewards.confirmTitle}</h2>
              <p className="text-sm text-[#2A2A2A]/75 mt-2 leading-relaxed">
                {t.rewards.confirmDesc.replace('{cost}', String(selectedReward.cost)).replace('{offer}', selectedReward.title[lang])}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => setSelectedReward(null)} className="min-h-[44px] rounded-xl border border-[#2B3A67]/20 text-[#2B3A67] text-sm font-semibold">{t.rewards.cancel}</button>
              <button type="button" onClick={handleRedeem} className="min-h-[44px] rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-bold">{t.rewards.confirm}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
