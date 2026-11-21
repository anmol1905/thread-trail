export function Logo({ compact = false }) {
  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
      <svg
        width={compact ? 26 : 30}
        height={compact ? 26 : 30}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Paisley / thread loop emblem in Indigo & Turmeric */}
        <path
          d="M18 4C11.5 4 6.5 9.2 6.5 15.8C6.5 23.2 13.8 29.8 18 32C22.2 29.8 29.5 23.2 29.5 15.8C29.5 9.2 24.5 4 18 4Z"
          fill="#2B3A67"
        />
        <path
          d="M18 8.5C13.8 8.5 11 11.7 11 15.6C11 20.5 15.8 25.1 18 26.8C20.2 25.1 25 20.5 25 15.6C25 11.7 22.2 8.5 18 8.5Z"
          stroke="#E9A820"
          strokeWidth="1.75"
          strokeDasharray="3 2.5"
        />
        {/* Tilted sewing needle */}
        <path
          d="M13 22L23.5 11.5"
          stroke="#FBF6EA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22.5" cy="12.5" r="1.4" fill="#E9A820" />
      </svg>
      <span className="font-display font-bold text-lg tracking-tight text-[#2B3A67]">
        ThreadTrail
      </span>
    </div>
  );
}
