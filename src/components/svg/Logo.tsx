import type { SVGProps } from 'react';

/**
 * Nova Analytics logo — fixed colors so it renders identically in BOTH
 * light and dark themes (the previous version used currentColor which
 * collapsed to white-on-white in dark mode).
 *
 * Lime rounded square + dark ascending bars. Same brand mark as the
 * landing page hero, so visitors see one consistent logo everywhere.
 */
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect x={2} y={2} width={28} height={28} rx={7} fill="#d6ff5c" />
    <path
      d="M8 22V13M14 22V9M20 22V15M26 22V11"
      stroke="#0a0908"
      strokeWidth={2.8}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgLogo;
