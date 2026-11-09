// Placeholder redraw of the Mercato mark. Swap for the official SVG.
export function MercatoMark({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  const [top, left, right] = inverted ? ["#FFFFFF", "#D6DDF2", "#EEF2FD"] : ["#1F2E63", "#0E1A3C", "#17255A"];
  return (
    <svg viewBox="0 0 40 44" aria-hidden="true" className={className}>
      <polygon points="20,2 38,12 20,22 2,12" fill={top} />
      <polygon points="2,12 20,22 20,42 2,32" fill={left} />
      <polygon points="20,22 38,12 38,32 20,42" fill={right} />
      <polygon points="25,24.5 33,20.1 33,34.7 25,39.2" fill="#4565E6" />
      {!inverted && <polygon points="25,24.5 27.2,23.3 27.2,38 25,39.2" fill="#FFFFFF" />}
    </svg>
  );
}
