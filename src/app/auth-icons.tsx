/**
 * Inline SVG icons used by the login + signup pages.
 * Kept as simple stroke paths so they inherit color via currentColor and
 * scale crisply at any size. No external icon dependency.
 */

export function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

export function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 4.24A10 10 0 0 1 12 4c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.06 4.06" />
      <path d="M6.6 6.6A17.6 17.6 0 0 0 2 11s3.5 7 10 7a10 10 0 0 0 5.4-1.6" />
      <path d="m9.5 9.5 5 5" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
