export function RingDivider() {
  return (
    <div
      className="mx-auto my-2 flex w-full max-w-6xl items-center justify-center px-4"
      aria-hidden="true"
    >
      <svg width="120" height="24" viewBox="0 0 120 24" className="text-border">
        <circle
          cx="60"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="12"
          r="6"
          fill="none"
          className="text-secondary"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="0"
          y1="12"
          x2="42"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="78"
          y1="12"
          x2="120"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
