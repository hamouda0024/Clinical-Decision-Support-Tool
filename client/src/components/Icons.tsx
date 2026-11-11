import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: 'false',
    ...props,
    className: props.className ?? 'h-5 w-5',
  };
}

export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <rect width="48" height="48" rx="12" fill="currentColor" />
      <path
        d="M12 25.5h6.2l2.6-6.4 4.4 12.6 3-8.2 2.2 2h5.6"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const AlertTriangle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4" />
    <path d="M12 16.5h.01" />
  </svg>
);

export const InfoCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
);

export const HeartPulse = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19.5 12.6 12 20l-7.5-7.4a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.5.5.5-.5a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7z" />
    <path d="M4 12h3l1.6-3.2L11 15l2-6 1.4 3H20" />
  </svg>
);

export const Activity = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12h4l2.5-7 4 14 2.5-7h5" />
  </svg>
);

export const Flask = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3h6" />
    <path d="M10 3v6.2L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.2V3" />
    <path d="M7.5 15h9" />
  </svg>
);

export const Scan = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8" />
    <path d="M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8" />
    <path d="M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16" />
    <path d="M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
    <path d="M7 12h10" />
  </svg>
);

export const Bolt = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
  </svg>
);

export const Pill = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);

export const ShieldAlert = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5 7.5-9.5V6L12 3z" />
    <path d="M12 8.5v4" />
    <path d="M12 15.5h.01" />
  </svg>
);

export const Stethoscope = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 3v5a4 4 0 0 0 8 0V3" />
    <path d="M3 3h4" />
    <path d="M11 3h4" />
    <path d="M9 12v3a5 5 0 0 0 10 0v-2" />
    <circle cx="19" cy="10" r="2" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Search = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const X = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const Printer = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M6 17h12v4H6z" />
  </svg>
);

export const RotateCcw = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

export const User = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const ClipboardList = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1" />
    <path d="M9 10h6M9 14h6M9 18h4" />
  </svg>
);

export const Sparkles = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m6.5 6.5 2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
  </svg>
);
