import type { SVGProps } from 'react';

/**
 * Nova Analytics logo (white variant) — used on dark backgrounds where
 * the regular Logo's currentColor would be hard to read.
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
    <rect x={2} y={2} width={28} height={28} rx={7} fill="#fff" />
    <path
      d="M8 22V13M14 22V9M20 22V15M26 22V11"
      stroke="#0a0a0a"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgLogoWhite;
