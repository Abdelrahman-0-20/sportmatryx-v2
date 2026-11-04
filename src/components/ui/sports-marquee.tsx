/**
 * SportsMarquee — infinite horizontal strip of the sports the data pipeline
 * covers. Pure CSS animation (pauses on hover); decorative, so both groups
 * are hidden from assistive tech except for the wrapper label.
 */
export function SportsMarquee({ items }: { items: string[] }) {
  const group = (suffix: string) => (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((sport) => (
        <span
          key={`${suffix}-${sport}`}
          className="flex items-center gap-6 whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted"
        >
          {sport}
          <span className="h-1 w-1 rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-label={`Multisport pipeline covering: ${items.join(", ")}`}>
      <div className="marquee-track">
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
