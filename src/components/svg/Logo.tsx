import type { SVGProps } from 'react';

/**
 * Nova Analytics logo — a rounded square containing four ascending bars,
 * representing analytics. Uses currentColor so it inherits from the
 * surrounding text color (works in both light and dark themes).
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
    <rect x={2} y={2} width={28} height={28} rx={7} fill="currentColor" />
    <path
      d="M8 22V13M14 22V9M20 22V15M26 22V11"
      stroke="white"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgLogo;
