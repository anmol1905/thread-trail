import { HeartHandshake, Wrench, Recycle, Check } from 'lucide-react';
import { useThreadTrail } from '../hooks/useThreadTrail';

const CONDITION_ITEMS = [
  { key: 'good', icon: HeartHandshake, color: '#1F8A87' },
  { key: 'fix', icon: Wrench, color: '#E9A820' },
  { key: 'worn', icon: Recycle, color: '#C65D3B' },
];

export function ConditionHelper({ value, onChange, includeAll = false, compact = false }) {
  const { t } = useThreadTrail();

  return (
    <div className="space-y-2">
      {includeAll && (
        <button
          type="button"
          onClick={() => onChange('all')}
          className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-left text-sm font-medium flex items-center justify-between transition-colors ${
            value === 'all'
              ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67]'
              : 'bg-[#FFFDF8] text-[#2A2A2A] border-[#2B3A67]/20 hover:border-[#2B3A67]/45'
          }`}
        >
          <span>{t.common.all}</span>
          {value === 'all' && <Check className="w-4 h-4 shrink-0" />}
        </button>
      )}
      <div className={compact ? 'grid grid-cols-3 gap-2' : 'space-y-2.5'}>
        {CONDITION_ITEMS.map(({ key, icon: Icon, color }) => {
          const info = t.passport.conditions[key];
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-pressed={active}
              className={`w-full min-h-[48px] rounded-xl border transition-all text-left flex items-center ${
                compact ? 'flex-col justify-center text-center p-2.5 gap-1' : 'justify-between px-3.5 py-3 gap-3'
              } ${
                active
                  ? 'bg-[#2B3A67] text-[#FBF6EA] border-[#2B3A67] shadow-sm'
                  : 'bg-[#FFFDF8] text-[#2A2A2A] border-[#2B3A67]/18 hover:border-[#2B3A67]/45'
              }`}
            >
              <div className={`flex items-center ${compact ? 'flex-col gap-1' : 'gap-3'}`}>
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: active ? 'rgba(251, 246, 234, 0.14)' : `${color}1A`,
                    color: active ? '#E9A820' : color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <div className={`font-semibold leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>
                    {info.label}
                  </div>
                  {!compact && (
                    <div
                      className={`text-xs mt-0.5 ${
                        active ? 'text-[#FBF6EA]/80' : 'text-[#2A2A2A]/65'
                      }`}
                    >
                      {info.action}
                    </div>
                  )}
                </div>
              </div>
              {!compact && (
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? 'border-[#E9A820] bg-[#E9A820] text-[#2B3A67]' : 'border-[#2B3A67]/25'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
