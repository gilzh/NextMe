// Workflow stage data — NextMe job-application workflow
// Actors: "claudia" = AI skill agent, "gilles" = human, "both" = handoff/collab

const STAGES = [
  {
    id: "identify",
    index: "01",
    title: "Identify",
    subtitle: "Scan & source opportunities",
    actor: "gilles",
    description:
      "Surface roles worth pursuing from job boards, networks, and inbound intros. Filter aggressively — signal over volume. Output goes into the monthly Jobs folder as the trigger for the pipeline.",
    inputs: ["LinkedIn saved searches", "Referrals & warm intros", "Company watchlist", "Newsletters & Slack groups"],
    outputs: ["Job URL or pasted JD", "Monthly folder entry"],
    tools: ["LinkedIn", "Web", "Network"],
    artifact: "{Codename}_{Role}/",
    glyph: "scan",
  },
  {
    id: "enrich",
    index: "02",
    title: "Enrich JD",
    subtitle: "Company intel, fit assessment, comp range",
    actor: "claudia",
    description:
      "Claudia reads the posting, researches the company (HQ, distance, size, values, due-diligence signals), benchmarks compensation, and builds an honest 8–12 row fit assessment against the profile files. Output is a markdown draft — no PDF yet.",
    inputs: ["Job URL / pasted JD", "Why.md · ExecSummary.md · Experience.md", "Skills.md · competency-pool.md"],
    outputs: ["Role metadata", "Company intelligence", "Fit assessment (✅ / ⚠️ / ❌)", "Market comp range"],
    tools: ["WebFetch", "WebSearch", "Profile files"],
    artifact: "{Codename}_{Role}_JD.md",
    glyph: "layers",
  },
  {
    id: "gate",
    index: "03",
    title: "Go / No-Go",
    subtitle: "Gilles reads the enriched JD and decides",
    actor: "gilles",
    isGate: true,
    description:
      "The human gate. Gilles reviews the enriched JD markdown — fit assessment, comp range, company signals — and decides whether to proceed. If no-go, stop here and log the reason. If go, Claudia is cleared to generate the PDF + CV + CL package.",
    inputs: ["Enriched JD markdown", "Fit assessment", "Comp range", "Gut check"],
    outputs: ["GO → proceed to storyline + drafts", "NO-GO → archive with reason"],
    tools: ["Judgment", "Calendar", "Energy budget"],
    artifact: "decision · go / no-go",
    glyph: "gate",
  },
  {
    id: "storyline",
    index: "04",
    title: "Storyline + Drafts",
    subtitle: "Claudia proposes angle, generates CL + CV",
    actor: "claudia",
    description:
      "On GO, Claudia proposes a narrative storyline — the single thread running through CL and CV — then generates the first drafts: Cover Letter (with proposed storyline up top), tailored CV with company colour palette, and the final JD PDF with red stamp. All saved into the monthly folder.",
    inputs: ["Approved enriched JD", "Profile files", "cl-examples.md · Why.md", "Company brand colours"],
    outputs: ["Cover Letter v0 + storyline", "Tailored CV v0", "JD PDF (stamped)"],
    tools: ["docx-js", "ReportLab", "Python + Node"],
    artifact: "CL.md · CV.docx · JD.pdf",
    glyph: "compose",
  },
  {
    id: "edit",
    index: "05",
    title: "Edit CL & CV",
    subtitle: "Gilles makes it sound like him",
    actor: "gilles",
    description:
      "Manual pass on both documents. Kill template phrasing in the CL, restore voice, verify every metric, tune the storyline. Adjust CV emphasis. Claudia re-exports and re-stamps on each iteration — the timestamp is always current.",
    inputs: ["CL v0 + storyline", "CV v0", "Source evidence / receipts"],
    outputs: ["CL final (docx + pdf + md)", "CV final (docx + pdf)", "Re-stamped PDFs"],
    tools: ["Google Docs", "Track changes", "Re-export loop"],
    artifact: "*_CL.pdf · *_CV.pdf",
    glyph: "refine",
  },
  {
    id: "apply",
    index: "06",
    title: "Apply",
    subtitle: "Submit, track, follow up",
    actor: "gilles",
    description:
      "Submit via the best channel available — warm intro > referral > portal. Log it in the tracker, schedule follow-ups, and feed any new signal (interviewer names, recruiter notes) back into Identify for the next loop.",
    inputs: ["Final CV + CL (pdf)", "Application channel", "Referral contact"],
    outputs: ["Submitted application", "Tracker entry", "Follow-up cadence"],
    tools: ["Email", "ATS portals", "Tracker"],
    artifact: "tracker.csv",
    glyph: "send",
  },
];

window.STAGES = STAGES;
