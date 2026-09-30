export default function FinderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="finder-left">
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>
        <clipPath id="finder-right">
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#3B99FC" />
      <g clipPath="url(#finder-left)">
        <rect x="2" y="2" width="96" height="96" rx="22" fill="#EAF6FF" />
        <circle cx="34" cy="46" r="5" fill="#3B99FC" />
        <circle cx="66" cy="46" r="5" fill="#3B99FC" />
        <path d="M28 66 Q50 84 72 66" stroke="#3B99FC" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g clipPath="url(#finder-right)">
        <circle cx="34" cy="46" r="5" fill="#EAF6FF" />
        <circle cx="66" cy="46" r="5" fill="#EAF6FF" />
        <path d="M28 66 Q50 84 72 66" stroke="#EAF6FF" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
