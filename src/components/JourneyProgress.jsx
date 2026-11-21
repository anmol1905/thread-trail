import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useThreadTrail } from '../hooks/useThreadTrail';

function getCurrentStep(pathname) {
  if (pathname.startsWith('/garment/')) return 1;
  if (pathname.startsWith('/partners')) return 2;
  if (pathname.startsWith('/bag')) return 3;
  if (pathname.startsWith('/track')) return 4;
  return 0;
}

export function JourneyProgress() {
  const { pathname } = useLocation();
  const { t } = useThreadTrail();

  if (pathname === '/' || pathname.startsWith('/demo-tags') || pathname.startsWith('/rewards')) return null;

  const currentStep = getCurrentStep(pathname);
  const completedThrough = currentStep - 1;

  return (
    <section className="journey-progress" aria-label={t.common.journeyTitle}>
      <div className="journey-summary">
        <span>{t.common.journeyTitle}</span>
        <strong>
          {t.common.currentStep
            .replace('{current}', String(currentStep + 1))
            .replace('{total}', String(t.common.journeySteps.length))}
          {' · '}{t.common.journeySteps[currentStep]}
        </strong>
      </div>

      <ol>
        {t.common.journeySteps.map((label, index) => {
          const complete = index <= completedThrough;
          const active = index === currentStep;
          return (
            <li key={label} className={active ? 'is-active' : complete ? 'is-complete' : ''}>
              <span className="journey-node" aria-hidden="true">
                {complete ? <Check /> : index + 1}
              </span>
              <span className="journey-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
