// Main app — NextMe workflow visualization

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "cyan",
  "layout": "horizontal",
  "animate": true,
  "showTools": true
}/*EDITMODE-END*/;

const ACCENTS = {
  cyan:   { hue: 195, name: "Cyan" },
  violet: { hue: 270, name: "Violet" },
  mint:   { hue: 160, name: "Mint" },
  amber:  { hue:  35, name: "Amber" },
};

// -------- Stage Card --------
const ActorBadge = ({ actor }) => {
  if (!actor) return null;
  const label = actor === "claudia" ? "CLAUDIA" : actor === "gilles" ? "GILLES" : "BOTH";
  const icon = actor === "claudia" ? (
    <svg viewBox="0 0 10 10" width="8" height="8"><circle cx="5" cy="5" r="4" fill="currentColor"/></svg>
  ) : (
    <svg viewBox="0 0 10 10" width="8" height="8"><rect x="1.5" y="1.5" width="7" height="7" fill="currentColor"/></svg>
  );
  return (
    <span className={`actor-badge actor-${actor}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

const StageCard = ({ stage, idx, total, active, onSelect, layout, animate, showTools }) => {
  const isLast = idx === total - 1;
  return (
    <div className={`stage ${active ? "is-active" : ""} ${stage.isGate ? "is-gate" : ""}`} data-layout={layout} data-actor={stage.actor}>
      <button
        className="stage-card"
        onClick={() => onSelect(stage.id)}
        aria-pressed={active}
      >
        <div className="stage-head">
          <span className="stage-index">{stage.index}</span>
          <ActorBadge actor={stage.actor} />
        </div>
        <div className="stage-glyph">
          <Glyph kind={stage.glyph} size={52} />
        </div>
        <div className="stage-title">{stage.title}</div>
        <div className="stage-sub">{stage.subtitle}</div>
        {showTools && (
          <div className="stage-tools">
            {stage.tools.slice(0, 3).map((t) => (
              <span key={t} className="tool-chip">{t}</span>
            ))}
          </div>
        )}
        <div className="stage-artifact">
          <span className="artifact-dot" />
          <span className="artifact-name">{stage.artifact}</span>
        </div>
      </button>
      {!isLast && (
        <div className="connector" aria-hidden="true">
          <div className="connector-line">
            {animate && <div className="connector-pulse" style={{ animationDelay: `${idx * 0.6}s` }} />}
          </div>
          <div className="connector-arrow">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M2 8 L14 8 M10 4 L14 8 L10 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// -------- Loopback arrow (the "apply → identify" feedback) --------
const LoopBack = ({ layout, animate }) => {
  if (layout !== "horizontal") return null;
  return (
    <svg className="loopback" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="loopArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d="M 960 20 C 960 100, 960 110, 900 110 L 100 110 C 40 110, 40 100, 40 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.45"
        markerEnd="url(#loopArrow)"
        className={animate ? "loopback-path is-animated" : "loopback-path"}
      />
      <text x="500" y="108" textAnchor="middle" className="loopback-label" fill="currentColor">
        new signal · iterate
      </text>
    </svg>
  );
};

// -------- Side panel --------
const DetailPanel = ({ stage, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!stage) return null;
  return (
    <>
      <div className="panel-scrim" onClick={onClose} />
      <aside className="panel" role="dialog" aria-label={`${stage.title} details`}>
        <div className="panel-head">
          <div className="panel-eyebrow">
            <span className="panel-index">{stage.index}</span>
            <span className="panel-sep">/</span>
            <span className="panel-kicker">STAGE</span>
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="panel-title-wrap">
          <div className="panel-glyph"><Glyph kind={stage.glyph} size={64} /></div>
          <div>
            <h2 className="panel-title">{stage.title}</h2>
            <p className="panel-subtitle">{stage.subtitle}</p>
            <div className="panel-actor"><ActorBadge actor={stage.actor} /></div>
          </div>
        </div>

        <p className="panel-desc">{stage.description}</p>

        <div className="panel-grid">
          <section className="panel-section">
            <h3 className="panel-h3">Inputs</h3>
            <ul className="panel-list">
              {stage.inputs.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
          <section className="panel-section">
            <h3 className="panel-h3">Outputs</h3>
            <ul className="panel-list">
              {stage.outputs.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
        </div>

        <section className="panel-section">
          <h3 className="panel-h3">Tools</h3>
          <div className="panel-tools">
            {stage.tools.map((t) => <span key={t} className="tool-chip tool-chip--lg">{t}</span>)}
          </div>
        </section>

        <section className="panel-artifact">
          <div className="artifact-row">
            <span className="artifact-dot artifact-dot--lg" />
            <div>
              <div className="artifact-label">ARTIFACT</div>
              <div className="artifact-file">{stage.artifact}</div>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
};

// -------- Header --------
const Header = ({ progress }) => (
  <header className="site-header">
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
        </svg>
      </div>
      <div className="brand-text">
        <div className="brand-name">NextMe</div>
        <div className="brand-meta">Job-search workflow · v1.0</div>
      </div>
    </div>

    <div className="header-center">
      <div className="kicker">
        <span className="kicker-dot" />
        <span>LIVE PIPELINE</span>
      </div>
      <h1 className="hero">
        From opportunity to application,<br/>
        <span className="hero-dim">a human + AI loop.</span>
      </h1>
    </div>

    <div className="header-right">
      <div className="progress-readout">
        <div className="progress-num">{String(progress).padStart(2, "0")}<span>/06</span></div>
        <div className="progress-label">STAGES</div>
      </div>
    </div>
  </header>
);

// -------- Tweaks --------
const Tweaks = ({ tweaks, set }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection title="Theme">
      <TweakRadio
        value={tweaks.theme}
        onChange={(v) => set("theme", v)}
        options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
      />
    </TweakSection>
    <TweakSection title="Accent">
      <TweakRadio
        value={tweaks.accent}
        onChange={(v) => set("accent", v)}
        options={Object.entries(ACCENTS).map(([k, v]) => ({ value: k, label: v.name }))}
      />
    </TweakSection>
    <TweakSection title="Layout">
      <TweakRadio
        value={tweaks.layout}
        onChange={(v) => set("layout", v)}
        options={[{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]}
      />
    </TweakSection>
    <TweakSection title="Motion">
      <TweakToggle label="Animate flow" value={tweaks.animate} onChange={(v) => set("animate", v)} />
    </TweakSection>
    <TweakSection title="Density">
      <TweakToggle label="Show tool chips on cards" value={tweaks.showTools} onChange={(v) => set("showTools", v)} />
    </TweakSection>
  </TweaksPanel>
);

// -------- App --------
const App = () => {
  const [tweaks, set] = useTweaks(TWEAK_DEFAULTS);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);

  // Count-up through stages on load, for vibe
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= STAGES.length) clearInterval(iv);
    }, 160);
    return () => clearInterval(iv);
  }, []);

  // Apply theme + accent as CSS variables at root
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = tweaks.theme;
    const hue = ACCENTS[tweaks.accent]?.hue ?? 195;
    root.style.setProperty("--accent-hue", hue);
  }, [tweaks.theme, tweaks.accent]);

  const selectedStage = useMemo(() => STAGES.find((s) => s.id === selected), [selected]);

  return (
    <div className="app" data-layout={tweaks.layout}>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <Header progress={progress} />

      <main className="stage-main">
        <div className="pipeline-rail" aria-hidden="true" />
        <div className={`pipeline pipeline--${tweaks.layout}`}>
          {STAGES.map((s, i) => (
            <StageCard
              key={s.id}
              stage={s}
              idx={i}
              total={STAGES.length}
              active={selected === s.id}
              onSelect={setSelected}
              layout={tweaks.layout}
              animate={tweaks.animate}
              showTools={tweaks.showTools}
            />
          ))}
        </div>
        <LoopBack layout={tweaks.layout} animate={tweaks.animate} />
      </main>

      <footer className="site-footer">
        <div className="footer-legend">
          <div className="legend-item"><span className="legend-shape legend-shape--circle" /> Claudia · AI skill</div>
          <div className="legend-item"><span className="legend-shape legend-shape--square" /> Gilles · human</div>
          <div className="legend-item"><span className="legend-shape legend-shape--diamond" /> Decision gate</div>
        </div>
        <div className="footer-hint">Click any stage for details · Esc to close</div>
        <div className="footer-url">gilzh.github.io/NextMe</div>
      </footer>

      <DetailPanel stage={selectedStage} onClose={() => setSelected(null)} />
      <Tweaks tweaks={tweaks} set={set} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
