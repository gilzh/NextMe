// Abstract geometric glyphs for each stage — no illustration, just schematic marks

const Glyph = ({ kind, size = 56, color = "currentColor" }) => {
  const s = size;
  const stroke = { stroke: color, strokeWidth: 1.2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const dot = { fill: color };

  switch (kind) {
    case "scan":
      // concentric arcs + target dot — "identify"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="22" {...stroke} opacity="0.25" />
          <circle cx="28" cy="28" r="14" {...stroke} opacity="0.5" />
          <circle cx="28" cy="28" r="6" {...stroke} />
          <circle cx="28" cy="28" r="1.8" {...dot} />
          <line x1="28" y1="2" x2="28" y2="10" {...stroke} />
          <line x1="28" y1="46" x2="28" y2="54" {...stroke} />
          <line x1="2" y1="28" x2="10" y2="28" {...stroke} />
          <line x1="46" y1="28" x2="54" y2="28" {...stroke} />
        </svg>
      );
    case "layers":
      // stacked parallelograms — "enrich / layer context"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <path d="M10 20 L28 12 L46 20 L28 28 Z" {...stroke} opacity="0.4" />
          <path d="M10 28 L28 20 L46 28 L28 36 Z" {...stroke} opacity="0.7" />
          <path d="M10 36 L28 28 L46 36 L28 44 Z" {...stroke} />
        </svg>
      );
    case "compose":
      // document with generated-line grid — "tailor"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <rect x="12" y="8" width="28" height="38" rx="2" {...stroke} />
          <line x1="17" y1="17" x2="35" y2="17" {...stroke} opacity="0.9" />
          <line x1="17" y1="23" x2="32" y2="23" {...stroke} opacity="0.6" />
          <line x1="17" y1="29" x2="34" y2="29" {...stroke} opacity="0.6" />
          <line x1="17" y1="35" x2="28" y2="35" {...stroke} opacity="0.6" />
          <circle cx="42" cy="14" r="3" {...dot} />
        </svg>
      );
    case "refine":
      // triangle + reticle — "edit / precision"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <path d="M28 10 L46 42 L10 42 Z" {...stroke} />
          <circle cx="28" cy="32" r="5" {...stroke} />
          <line x1="28" y1="25" x2="28" y2="29" {...stroke} />
          <line x1="28" y1="35" x2="28" y2="39" {...stroke} />
          <line x1="21" y1="32" x2="25" y2="32" {...stroke} />
          <line x1="31" y1="32" x2="35" y2="32" {...stroke} />
        </svg>
      );
    case "gate":
      // diamond with central pivot — "decision gate"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <path d="M28 6 L50 28 L28 50 L6 28 Z" {...stroke} />
          <path d="M28 14 L42 28 L28 42 L14 28 Z" {...stroke} opacity="0.4" />
          <circle cx="28" cy="28" r="2.4" {...dot} />
          <line x1="28" y1="6" x2="28" y2="14" {...stroke} opacity="0.6" />
          <line x1="6" y1="28" x2="14" y2="28" {...stroke} opacity="0.6" />
          <line x1="42" y1="28" x2="50" y2="28" {...stroke} opacity="0.6" />
        </svg>
      );
    case "send":
      // arrow exiting a frame — "apply / submit"
      return (
        <svg width={s} height={s} viewBox="0 0 56 56" aria-hidden="true">
          <rect x="8" y="14" width="28" height="28" rx="2" {...stroke} opacity="0.5" />
          <line x1="22" y1="28" x2="50" y2="28" {...stroke} />
          <path d="M42 20 L50 28 L42 36" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
};

window.Glyph = Glyph;
