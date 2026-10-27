/** Small logo SVG used in the header and empty state. */
export default function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 16h10M19 12l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
