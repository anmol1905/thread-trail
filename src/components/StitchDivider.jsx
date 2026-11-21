export function StitchDivider({ className = '' }) {
  return (
    <div className={`my-5 flex items-center gap-2 ${className}`} aria-hidden="true">
      <hr className="stitch-divider flex-1" />
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path
          d="M1 5C4 1.5 12 8.5 15 5"
          stroke="#E9A820"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <hr className="stitch-divider flex-1" />
    </div>
  );
}
