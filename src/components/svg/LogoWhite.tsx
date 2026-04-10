import type { SVGProps } from 'react';

/**
 * Nova Analytics logo — same fixed colors as the regular Logo so the
 * brand mark stays consistent everywhere it appears, regardless of the
 * surrounding theme.
 */
const SvgLogoWhite = (props: SVGProps<SVGSVGElement>) => (
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
export default SvgLogoWhite;
