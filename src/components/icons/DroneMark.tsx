/**
 * Drone glyph used on the activity cards. Uses `currentColor` so it inherits
 * the brand tint (and the neon shift in dark mode) from its container.
 */
export function DroneMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 18 L26 26 M48 18 L38 26 M16 46 L26 38 M48 46 L38 38" />
      <ellipse cx="14" cy="16" rx="9" ry="3.5" />
      <ellipse cx="50" cy="16" rx="9" ry="3.5" />
      <ellipse cx="14" cy="48" rx="9" ry="3.5" />
      <ellipse cx="50" cy="48" rx="9" ry="3.5" />
      <rect x="25" y="26" width="14" height="12" rx="4" fill="currentColor" stroke="none" />
      <circle cx="32" cy="32" r="2.5" className="text-surface" stroke="none" fill="currentColor" />
    </svg>
  )
}
