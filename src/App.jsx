const { useEffect, useMemo, useState } = React;

const DATA = window.AUSTRALIA_QUEST_DATA;
const STATES = DATA.states;

const SECTION_TABS = [
  { id: "explore", label: "Explore Map" },
  { id: "labels", label: "Label Lab" },
  { id: "ranking", label: "Ranking" },
  { id: "higher", label: "Higher or Lower" },
  { id: "quiz", label: "Quiz" },
  { id: "city", label: "New City" },
  { id: "summary", label: "Summary" }
];

const LABEL_TYPES = [
  { id: "name", label: "State and territory names", short: "Name" },
  { id: "capital", label: "Capital cities", short: "Capital" },
  { id: "population", label: "Population figures", short: "Population" }
];

const RANKING_MODES = {
  population: {
    label: "Population",
    prompt: "Highest to lowest population",
    value: (state) => state.population,
    format: (value) => formatNumber(value)
  },
  area: {
    label: "Land area",
    prompt: "Largest to smallest land area",
    value: (state) => state.areaKm2,
    format: (value) => `${formatNumber(value)} km2`
  },
  density: {
    label: "Population density",
    prompt: "Highest to lowest population density",
    value: (state) => densityOf(state),
    format: (value) => `${formatDensity(value)} people/km2`
  }
};

const COMPARISON_MODES = {
  population: {
    label: "More people",
    question: "Which has more people?",
    value: (state) => state.population,
    format: (state) => formatNumber(state.population)
  },
  area: {
    label: "More land",
    question: "Which has more land?",
    value: (state) => state.areaKm2,
    format: (state) => `${formatNumber(state.areaKm2)} km2`
  },
  density: {
    label: "More dense",
    question: "Which is more densely populated?",
    value: (state) => densityOf(state),
    format: (state) => `${formatDensity(densityOf(state))} people/km2`
  }
};

const CITY_SETTINGS = [
  {
    id: "coastal",
    label: "Coastal site",
    note: "Good for ports and tourism, but busy coasts can have less available land.",
    mods: { densityRoom: -1, climate: 0, transport: 0, coastline: 1, capitalAccess: 0, availableLand: -1 }
  },
  {
    id: "inland",
    label: "Inland growth town",
    note: "More space, but distance, heat and water can be harder problems.",
    mods: { densityRoom: 1, climate: -1, transport: -1, coastline: -2, capitalAccess: -1, availableLand: 1 }
  },
  {
    id: "capital-fringe",
    label: "Capital fringe",
    note: "Strong links to services and jobs, but land can be crowded and expensive.",
    mods: { densityRoom: -1, climate: 0, transport: 1, coastline: 0, capitalAccess: 1, availableLand: -1 }
  },
  {
    id: "regional-corridor",
    label: "Regional transport corridor",
    note: "Balances transport, land and distance from major cities.",
    mods: { densityRoom: 0, climate: 0, transport: 1, coastline: 0, capitalAccess: 0, availableLand: 0 }
  }
];

const CITY_FACTOR_LABELS = {
  densityRoom: "Population density",
  climate: "Climate",
  transport: "Transport",
  coastline: "Coastline access",
  capitalAccess: "Distance from capitals",
  availableLand: "Available land"
};

const MAP_REGIONS = {
  wa: {
    fill: "#73b947",
    labelX: 245,
    labelY: 365,
    tokenX: 140,
    tokenY: 392,
    tokenWidth: 230,
    infoX: 140,
    infoY: 282,
    infoWidth: 245,
    d: "M392 156 C374 140 371 125 354 117 C315 101 278 92 250 103 C232 113 230 134 212 141 C191 149 187 171 168 185 C139 206 114 224 91 232 C80 236 74 250 77 263 C61 268 57 292 66 309 C53 332 54 358 68 381 C78 398 78 419 91 437 C103 454 119 468 119 493 C119 510 132 519 148 514 C153 533 176 535 190 549 C213 570 252 560 270 543 C294 521 315 519 344 523 C363 525 377 515 392 507 Z"
  },
  nt: {
    fill: "#f28c18",
    labelX: 495,
    labelY: 220,
    tokenX: 414,
    tokenY: 232,
    tokenWidth: 170,
    infoX: 420,
    infoY: 145,
    infoWidth: 180,
    d: "M392 156 C410 135 416 109 440 96 C453 88 464 105 478 81 C492 51 511 69 525 48 C547 15 596 45 622 78 C638 101 622 122 648 139 C633 153 615 160 598 163 L598 318 L392 318 Z"
  },
  qld: {
    fill: "#2f80d4",
    labelX: 748,
    labelY: 270,
    tokenX: 685,
    tokenY: 295,
    tokenWidth: 195,
    infoX: 660,
    infoY: 202,
    infoWidth: 205,
    d: "M598 163 C622 156 638 145 648 139 C672 119 686 57 706 12 C730 45 733 99 724 128 C751 119 771 139 779 159 C819 172 842 205 854 247 C882 274 886 322 903 354 C919 384 901 417 874 431 C863 438 862 452 845 459 C830 466 812 453 801 468 L642 468 L642 318 L598 318 Z"
  },
  sa: {
    fill: "#f9c43a",
    labelX: 525,
    labelY: 425,
    tokenX: 424,
    tokenY: 444,
    tokenWidth: 205,
    infoX: 430,
    infoY: 362,
    infoWidth: 210,
    d: "M392 318 L642 318 L642 547 C619 558 598 577 582 602 C563 602 544 586 535 562 C523 595 503 603 486 573 C469 540 435 522 392 507 Z"
  },
  nsw: {
    fill: "#735cc7",
    labelX: 740,
    labelY: 505,
    tokenX: 672,
    tokenY: 532,
    tokenWidth: 190,
    infoX: 678,
    infoY: 455,
    infoWidth: 205,
    d: "M642 468 L801 468 C812 453 830 466 845 459 C870 476 874 514 858 546 C846 571 821 598 790 610 C760 621 731 608 708 596 C683 582 659 568 642 547 Z"
  },
  vic: {
    fill: "#0fa3a9",
    labelX: 680,
    labelY: 618,
    tokenX: 600,
    tokenY: 632,
    tokenWidth: 185,
    infoX: 602,
    infoY: 585,
    infoWidth: 220,
    d: "M642 547 C659 568 683 582 708 596 C731 608 760 621 790 610 C779 640 747 656 711 652 C681 649 656 633 636 613 C620 631 596 623 579 602 C594 579 616 560 642 547 Z"
  },
  tas: {
    fill: "#16aeb8",
    labelX: 735,
    labelY: 675,
    tokenX: 672,
    tokenY: 678,
    tokenWidth: 145,
    infoX: 830,
    infoY: 612,
    infoWidth: 150,
    calloutLine: "750,672 795,672 823,641",
    callout: true,
    d: "M676 650 C700 632 740 634 774 650 C792 659 791 680 770 694 C746 710 724 724 704 704 C686 687 666 668 676 650 Z"
  },
  act: {
    fill: "#c75a70",
    labelX: 902,
    labelY: 523,
    tokenX: 835,
    tokenY: 512,
    tokenWidth: 135,
    infoX: 875,
    infoY: 470,
    infoWidth: 158,
    calloutLine: "848,544 878,544 895,520",
    callout: true,
    d: "M835 535 C841 523 859 527 862 541 C865 555 850 563 838 556 C831 552 829 542 835 535 Z"
  }
};

function formatNumber(value) {
  return Number(value).toLocaleString("en-AU");
}

function formatDensity(value) {
  if (value < 1) return value.toFixed(2);
  if (value < 10) return value.toFixed(1);
  return value.toFixed(1);
}

function densityOf(state) {
  return state.population / state.areaKm2;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function stateById(id) {
  return STATES.find((state) => state.id === id);
}

function sortedStateIdsBy(mode) {
  const metric = RANKING_MODES[mode].value;
  return [...STATES].sort((a, b) => metric(b) - metric(a)).map((state) => state.id);
}

function App() {
  const [started, setStarted] = useState(false);
  const [section, setSection] = useState("explore");
  const [selectedId, setSelectedId] = useState("nsw");
  const [visitedIds, setVisitedIds] = useState(["nsw"]);
  const [labelStats, setLabelStats] = useState({ correct: 0, attempts: 0 });
  const [rankingCompleted, setRankingCompleted] = useState({});
  const [higherStats, setHigherStats] = useState({ score: 0, streak: 0, bestStreak: 0, rounds: 0 });
  const [quizScore, setQuizScore] = useState(0);
  const [cityScore, setCityScore] = useState(0);

  const selectedState = stateById(selectedId);
  const completedRankingCount = Object.keys(rankingCompleted).length;
  const questPoints =
    labelStats.correct +
    completedRankingCount * 8 +
    higherStats.score * 2 +
    quizScore * 3 +
    cityScore;

  function chooseState(id) {
    setSelectedId(id);
    setVisitedIds((previous) => (previous.includes(id) ? previous : [...previous, id]));
  }

  function markRankingComplete(mode) {
    setRankingCompleted((previous) => ({ ...previous, [mode]: true }));
  }

  function recordHigherLowerResult(correct) {
    setHigherStats((previous) => {
      const nextStreak = correct ? previous.streak + 1 : 0;
      return {
        score: previous.score + (correct ? 1 : 0),
        streak: nextStreak,
        bestStreak: Math.max(previous.bestStreak, nextStreak),
        rounds: previous.rounds + 1
      };
    });
  }

  if (!started) {
    return <OpeningScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-reef">Geography investigation</p>
              <h1 className="text-3xl font-black text-ink sm:text-4xl">{DATA.meta.title}</h1>
              <p className="mt-1 text-base text-ink/70">{DATA.meta.subtitle}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
              <ScoreTile label="Quest points" value={questPoints} />
              <ScoreTile label="Places visited" value={`${visitedIds.length}/${STATES.length}`} />
              <ScoreTile label="Best streak" value={higherStats.bestStreak} />
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Quest sections">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold transition ${
                  section === tab.id
                    ? "border-ocean bg-ocean text-white shadow-sm"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/50 hover:bg-sky-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {section === "explore" && (
          <ExploreMap selectedState={selectedState} onSelect={chooseState} visitedIds={visitedIds} />
        )}
        {section === "labels" && (
          <LabelChallenge onStatsChange={setLabelStats} onSelectState={chooseState} />
        )}
        {section === "ranking" && (
          <RankingGame completed={rankingCompleted} onComplete={markRankingComplete} />
        )}
        {section === "higher" && (
          <HigherLowerGame stats={higherStats} onResult={recordHigherLowerResult} />
        )}
        {section === "quiz" && <QuizMode onScoreChange={setQuizScore} />}
        {section === "city" && <CitySimulation onScoreChange={setCityScore} onSelectState={chooseState} />}
        {section === "summary" && (
          <StudentSummary
            selectedId={selectedId}
            visitedIds={visitedIds}
            labelStats={labelStats}
            rankingCompleted={rankingCompleted}
            higherStats={higherStats}
            quizScore={quizScore}
            cityScore={cityScore}
            questPoints={questPoints}
          />
        )}
      </main>
    </div>
  );
}

function OpeningScreen({ onStart }) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="py-8">
          <p className="mb-3 inline-flex rounded-lg bg-gum px-3 py-1 text-sm font-bold uppercase tracking-normal text-white">
            Classroom geography game
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight text-ink sm:text-6xl lg:text-7xl">
            Australia Population Quest
          </h1>
          <p className="mt-3 text-2xl font-bold text-ocean">Explore where Australians live</p>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/78">
            Australia is huge, but people are not spread evenly. Follow the clues, compare the
            numbers, build a new city, and explain the patterns like a geographer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-ocean px-7 py-4 text-xl font-black text-white shadow-classroom transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-ocean/30"
            >
              Start Quest
            </button>
            <DataBadge />
          </div>
        </div>

        <div className="quest-card p-4 sm:p-5">
          <AustraliaMap selectedId="nsw" onSelect={() => {}} compact />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniFact value={formatNumber(DATA.meta.nationalPopulation)} label="Australia population" />
            <MiniFact value={DATA.meta.populationReferenceDate} label="ABS reference date" />
          </div>
        </div>
      </section>
    </main>
  );
}

function DataBadge() {
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink/75 shadow-sm">
      <span className="font-black text-ink">ABS ERP:</span> {formatNumber(DATA.meta.nationalPopulation)} people at{" "}
      {DATA.meta.populationReferenceDate}
    </div>
  );
}

function ScoreTile({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-normal text-ink/55">{label}</p>
      <p className="text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function MiniFact({ value, label }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-3">
      <p className="text-xl font-black text-ink">{value}</p>
      <p className="text-sm font-semibold text-ink/65">{label}</p>
    </div>
  );
}

function ProgressBar({ value, max, label }) {
  const width = `${clamp((value / max) * 100, 0, 100)}%`;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-bold text-ink/70">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-lg bg-white ring-1 ring-ink/10">
        <div className="progress-fill h-full rounded-lg bg-reef" style={{ width }} />
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, children }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-black uppercase tracking-normal text-reef">{kicker}</p>
      <h2 className="mt-1 text-3xl font-black text-ink sm:text-4xl">{title}</h2>
      {children && <p className="mt-2 max-w-4xl text-lg leading-relaxed text-ink/74">{children}</p>}
    </div>
  );
}

function ExploreMap({ selectedState, onSelect, visitedIds }) {
  const maxPopulation = Math.max(...STATES.map((state) => state.population));
  const maxArea = Math.max(...STATES.map((state) => state.areaKm2));
  const maxDensity = Math.max(...STATES.map((state) => densityOf(state)));

  return (
    <section>
      <SectionHeader kicker="Step 1" title="Explore the population map">
        Click a state or territory to collect evidence about population, capital cities, land area and density.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="quest-card p-3 sm:p-4">
          <AustraliaMap selectedId={selectedState.id} onSelect={onSelect} />
        </div>

        <aside className="quest-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-lg bg-ocean px-3 py-1 text-sm font-black text-white">
                {selectedState.short}
              </span>
              <h3 className="mt-3 text-3xl font-black text-ink">{selectedState.name}</h3>
              <p className="text-base font-semibold text-ink/65">Capital city: {selectedState.capital}</p>
            </div>
            <div className="rounded-lg bg-sand px-3 py-2 text-sm font-black text-ink">
              {selectedState.type}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MetricCard label="Population" value={formatNumber(selectedState.population)} />
            <MetricCard label="Land area" value={`${formatNumber(selectedState.areaKm2)} km2`} />
            <MetricCard
              label="Density"
              value={`${formatDensity(densityOf(selectedState))} people/km2`}
            />
            <MetricCard label="Capital" value={selectedState.capital} />
          </div>

          <div className="mt-5 space-y-3">
            <ComparisonBar
              label="Population compared with the largest"
              value={selectedState.population}
              max={maxPopulation}
              colour="bg-ocean"
            />
            <ComparisonBar
              label="Land area compared with the largest"
              value={selectedState.areaKm2}
              max={maxArea}
              colour="bg-gum"
            />
            <ComparisonBar
              label="Density compared with the highest"
              value={densityOf(selectedState)}
              max={maxDensity}
              colour="bg-amber-600"
            />
          </div>

          <div className="mt-5 rounded-lg border border-reef/20 bg-teal-50 p-4">
            <p className="font-black text-reef">Interesting fact</p>
            <p className="mt-1 text-ink/78">{selectedState.interestingFact}</p>
          </div>

          <div className="mt-5 grid gap-3">
            <EvidenceLine label="Coastline" text={selectedState.coastline} />
            <EvidenceLine label="Climate" text={selectedState.climate} />
            <EvidenceLine label="Pattern clue" text={selectedState.patternHint} />
          </div>

          <div className="mt-5">
            <ProgressBar value={visitedIds.length} max={STATES.length} label="Places investigated" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4">
      <p className="text-sm font-black uppercase tracking-normal text-ink/55">{label}</p>
      <p className="mt-1 break-words text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function ComparisonBar({ label, value, max, colour }) {
  const width = `${clamp((value / max) * 100, 4, 100)}%`;
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-sm font-bold text-ink/70">
        <span>{label}</span>
        <span>{Math.round((value / max) * 100)}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-lg bg-white ring-1 ring-ink/10">
        <div className={`h-full rounded-lg ${colour}`} style={{ width }} />
      </div>
    </div>
  );
}

function EvidenceLine({ label, text }) {
  return (
    <div className="flex gap-3 rounded-lg border border-ink/10 bg-white p-3">
      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-reef" />
      <div>
        <p className="font-black text-ink">{label}</p>
        <p className="text-ink/72">{text}</p>
      </div>
    </div>
  );
}

function MapInfoLabel({ state, callout = false }) {
  return (
    <div className={`map-info-label ${callout ? "callout" : ""}`}>
      <div className="map-code">{state.short}</div>
      <div className="map-name">{state.name}</div>
      <div className="map-stat">
        <span className="map-stat-label">Pop</span>
        <span>{formatNumber(state.population)}</span>
      </div>
      <div className="map-stat">
        <span className="map-stat-label">Area</span>
        <span>{formatNumber(state.areaKm2)} km2</span>
      </div>
      <div className="map-stat">
        <span className="map-stat-label">Capital</span>
        <span>{state.capital}</span>
      </div>
    </div>
  );
}

function MapCompactLabel({ state, callout = false }) {
  return (
    <div className={`map-compact-label ${callout ? "callout" : ""}`}>
      <div className="map-code">{state.short}</div>
    </div>
  );
}

function AustraliaMap({
  selectedId,
  onSelect,
  compact = false,
  placedByState = {},
  onDropState,
  challenge = false
}) {
  return (
    <div
      className={`australia-map-shell ${compact ? "compact" : ""}`}
      aria-label="Australia state and territory map"
    >
      <svg className="australia-map" viewBox="0 0 1000 720" role="img" aria-label="Clickable map of Australia">
        <defs>
          <pattern id="oceanDots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(11, 116, 184, 0.22)" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="1000" height="720" fill="url(#oceanDots)" opacity="0.38" />
        <text x="82" y="190" fill="rgba(27, 43, 52, 0.35)" fontSize="18" fontWeight="800">
          Indian Ocean
        </text>
        <text x="835" y="205" fill="rgba(27, 43, 52, 0.35)" fontSize="18" fontWeight="800">
          Coral Sea
        </text>
        <text x="790" y="612" fill="rgba(27, 43, 52, 0.35)" fontSize="18" fontWeight="800">
          Tasman Sea
        </text>
        <path
          d="M392 156 C410 135 416 109 440 96 C453 88 464 105 478 81 C492 51 511 69 525 48 C547 15 596 45 622 78 C638 101 622 122 648 139 C672 119 686 57 706 12 C730 45 733 99 724 128 C751 119 771 139 779 159 C819 172 842 205 854 247 C882 274 886 322 903 354 C919 384 901 417 874 431 C863 438 862 452 845 459 C870 476 874 514 858 546 C846 571 821 598 790 610 C779 640 747 656 711 652 C681 649 656 633 636 613 C620 631 596 623 579 602 C594 579 616 560 642 547 C619 558 598 577 582 602 C563 602 544 586 535 562 C523 595 503 603 486 573 C469 540 435 522 392 507 C377 515 363 525 344 523 C315 519 294 521 270 543 C252 560 213 570 190 549 C176 535 153 533 148 514 C132 519 119 510 119 493 C119 468 103 454 91 437 C78 419 78 398 68 381 C54 358 53 332 66 309 C57 292 61 268 77 263 C74 250 80 236 91 232 C114 224 139 206 168 185 C187 171 191 149 212 141 C230 134 232 113 250 103 C278 92 315 101 354 117 C371 125 374 140 392 156 Z"
          fill="rgba(255, 253, 247, 0.46)"
          stroke="rgba(27, 43, 52, 0.1)"
          strokeWidth="18"
          strokeLinejoin="round"
        />

        {STATES.map((state, index) => {
          const region = MAP_REGIONS[state.id];
          const placedTokens = placedByState[state.id] || [];
          const isSelected = !challenge && selectedId === state.id;
          const ariaLabel = challenge
            ? `Unlabelled map region ${index + 1}`
            : `${state.name}, ${state.type}, capital ${state.capital}`;

          return (
            <g
              key={state.id}
              data-state-id={state.id}
              role="button"
              tabIndex="0"
              aria-label={ariaLabel}
              className={`map-region ${isSelected ? "selected" : ""}`}
              style={{ "--region-fill": region.fill }}
              onClick={() => onSelect(state.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(state.id);
                }
              }}
              onDragOver={(event) => {
                if (onDropState) event.preventDefault();
              }}
              onDrop={(event) => {
                if (onDropState) {
                  event.preventDefault();
                  onDropState(state.id, event);
                }
              }}
            >
              <title>{challenge ? `Unlabelled map region ${index + 1}` : state.name}</title>
              <path d={region.d} />
              {!challenge && region.callout && (
                <polyline
                  className="map-callout-line"
                  points={region.calloutLine}
                  style={{ "--region-fill": region.fill }}
                />
              )}
              {!challenge && (
                <foreignObject
                  x={region.labelX - 58}
                  y={region.labelY - 34}
                  width="116"
                  height="76"
                  pointerEvents="none"
                >
                  <MapCompactLabel state={state} callout={region.callout} />
                </foreignObject>
              )}
              {challenge && placedTokens.length > 0 && (
                <foreignObject
                  x={region.tokenX}
                  y={region.tokenY}
                  width={region.tokenWidth}
                  height="92"
                  pointerEvents="none"
                >
                  <div className="map-token-stack">
                    {placedTokens.map((token) => (
                      <span key={token.id} className="animate-pop">
                        {token.text}
                      </span>
                    ))}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        <g aria-hidden="true" transform="translate(922 42)">
          <circle cx="24" cy="24" r="23" fill="rgba(255, 253, 247, 0.82)" stroke="rgba(27, 43, 52, 0.16)" />
          <path d="M24 6 L31 24 L24 42 L17 24 Z" fill="#0b74b8" opacity="0.86" />
          <text x="24" y="14" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1b2b34">
            N
          </text>
        </g>
      </svg>
    </div>
  );
}

function LabelChallenge({ onStatsChange, onSelectState }) {
  const tokens = useMemo(
    () =>
      STATES.flatMap((state) => [
        { id: `${state.id}-name`, type: "name", stateId: state.id, text: state.name },
        { id: `${state.id}-capital`, type: "capital", stateId: state.id, text: state.capital },
        { id: `${state.id}-population`, type: "population", stateId: state.id, text: formatNumber(state.population) }
      ]),
    []
  );
  const [activeType, setActiveType] = useState("name");
  const [placements, setPlacements] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [feedback, setFeedback] = useState("Drag a label, or tap a label and then tap its place on the map.");

  const placedCount = Object.keys(placements).length;
  const selectedToken = tokens.find((token) => token.id === selectedTokenId);
  const visibleTokens = tokens.filter((token) => token.type === activeType && !placements[token.id]);

  const placedByState = useMemo(() => {
    return STATES.reduce((map, state) => {
      map[state.id] = tokens.filter((token) => placements[token.id] === state.id);
      return map;
    }, {});
  }, [placements, tokens]);

  useEffect(() => {
    onStatsChange({ correct: placedCount, attempts });
  }, [placedCount, attempts, onStatsChange]);

  function tryPlace(token, stateId) {
    if (!token || placements[token.id]) return;
    setAttempts((previous) => previous + 1);
    const target = stateById(stateId);
    if (token.stateId === stateId) {
      setPlacements((previous) => ({ ...previous, [token.id]: stateId }));
      setSelectedTokenId(null);
      onSelectState(stateId);
      setFeedback(`${token.text} belongs with ${target.name}. Evidence matched.`);
      return;
    }
    setFeedback(`${token.text} does not match ${target.name}. Try another place.`);
  }

  function handleDrop(stateId, event) {
    const tokenId = event.dataTransfer.getData("text/plain");
    const token = tokens.find((item) => item.id === tokenId);
    tryPlace(token, stateId);
  }

  function handleMapClick(stateId) {
    if (selectedToken) {
      tryPlace(selectedToken, stateId);
    } else {
      onSelectState(stateId);
    }
  }

  return (
    <section>
      <SectionHeader kicker="Step 2" title="Map labelling challenge">
        Match names, capital cities and ABS population figures to the correct state or territory.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="quest-card p-4">
          <div className="flex flex-wrap gap-2">
            {LABEL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setActiveType(type.id);
                  setSelectedTokenId(null);
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                  activeType === type.id
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/40"
                }`}
              >
                {type.short}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <ProgressBar value={placedCount} max={tokens.length} label="Correct labels placed" />
          </div>

          <div className="mt-4 rounded-lg border border-ink/10 bg-sand/70 p-3 text-sm font-bold text-ink/75">
            {feedback}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", token.id);
                  setSelectedTokenId(token.id);
                }}
                onClick={() => setSelectedTokenId(token.id)}
                className={`drag-token rounded-lg border px-3 py-2 text-left text-sm font-black shadow-sm transition ${
                  selectedTokenId === token.id
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-reef/50 hover:bg-teal-50"
                }`}
              >
                {token.text}
              </button>
            ))}
          </div>

          {visibleTokens.length === 0 && (
            <div className="mt-4 rounded-lg border border-gum/20 bg-green-50 p-4 font-bold text-gum">
              This label set is complete.
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setPlacements({});
              setAttempts(0);
              setSelectedTokenId(null);
              setFeedback("Challenge reset. Start a fresh investigation.");
            }}
            className="mt-5 rounded-lg border border-ink/15 bg-white px-4 py-2 font-black text-ink transition hover:bg-slate-50"
          >
            Reset labels
          </button>
        </div>

        <div className="quest-card p-3 sm:p-4">
          <AustraliaMap
            selectedId={undefined}
            onSelect={handleMapClick}
            onDropState={handleDrop}
            placedByState={placedByState}
            challenge
          />
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ direction }) {
  const path =
    direction === "up"
      ? "M12 3 L4.5 11 H8.5 V21 H15.5 V11 H19.5 Z"
      : "M12 21 L4.5 13 H8.5 V3 H15.5 V13 H19.5 Z";

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-5 w-5" role="img">
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function RankingGame({ completed, onComplete }) {
  const initialOrders = useMemo(
    () => ({
      population: shuffle(STATES.map((state) => state.id)),
      area: shuffle(STATES.map((state) => state.id)),
      density: shuffle(STATES.map((state) => state.id))
    }),
    []
  );
  const [mode, setMode] = useState("population");
  const [orders, setOrders] = useState(initialOrders);

  const correctOrder = sortedStateIdsBy(mode);
  const currentOrder = orders[mode];
  const correctCount = currentOrder.filter((id, index) => id === correctOrder[index]).length;
  const modeComplete = correctCount === STATES.length;

  useEffect(() => {
    if (modeComplete && !completed[mode]) onComplete(mode);
  }, [modeComplete, mode, completed, onComplete]);

  function moveItem(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= currentOrder.length) return;
    setOrders((previous) => {
      const nextOrder = [...previous[mode]];
      [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
      return { ...previous, [mode]: nextOrder };
    });
  }

  function shuffleMode() {
    setOrders((previous) => ({ ...previous, [mode]: shuffle(STATES.map((state) => state.id)) }));
  }

  return (
    <section>
      <SectionHeader kicker="Step 3" title="Population ranking game">
        Rearrange the list until the evidence is in the right order.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="quest-card p-4">
          <div className="grid gap-2">
            {Object.entries(RANKING_MODES).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-lg border px-4 py-3 text-left font-black transition ${
                  mode === key
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/40"
                }`}
              >
                <span>{item.label}</span>
                {completed[key] && <span className="ml-2 rounded-lg bg-white/25 px-2 py-1 text-xs">Complete</span>}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ProgressBar value={correctCount} max={STATES.length} label="Correct positions" />
          </div>
          <button
            type="button"
            onClick={shuffleMode}
            className="mt-5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 font-black text-ink transition hover:bg-slate-50"
          >
            Shuffle this list
          </button>
        </aside>

        <div className="quest-card p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-reef">Current mission</p>
              <h3 className="text-2xl font-black text-ink">{RANKING_MODES[mode].prompt}</h3>
            </div>
            {modeComplete && (
              <span className="rounded-lg bg-green-100 px-3 py-2 font-black text-gum">
                Correct order found
              </span>
            )}
          </div>

          <div className="grid gap-2">
            {currentOrder.map((id, index) => {
              const state = stateById(id);
              const correctIndex = correctOrder.indexOf(id);
              const isCorrect = correctIndex === index;
              const hint = correctIndex < index ? "Move higher" : "Move lower";
              const value = RANKING_MODES[mode].format(RANKING_MODES[mode].value(state));

              return (
                <div
                  key={id}
                  className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg border p-3 ${
                    isCorrect ? "border-gum/30 bg-green-50" : "border-ink/10 bg-white"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sand text-lg font-black text-ink">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-black text-ink">{state.name}</p>
                    <p className="text-sm font-bold text-ink/65">{value}</p>
                    {!isCorrect && <p className="text-xs font-black uppercase tracking-normal text-ocean">{hint}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink transition hover:bg-sky-50 disabled:opacity-35"
                      aria-label={`Move ${state.name} higher`}
                    >
                      <ArrowIcon direction="up" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === currentOrder.length - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink transition hover:bg-sky-50 disabled:opacity-35"
                      aria-label={`Move ${state.name} lower`}
                    >
                      <ArrowIcon direction="down" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HigherLowerGame({ stats, onResult }) {
  const [mode, setMode] = useState("population");
  const [pair, setPair] = useState(() => makePair());
  const [answer, setAnswer] = useState(null);

  function makePair() {
    const shuffled = shuffle(STATES);
    return [shuffled[0], shuffled[1]];
  }

  function nextRound(nextMode = mode) {
    setMode(nextMode);
    setPair(makePair());
    setAnswer(null);
  }

  function choose(id) {
    if (answer) return;
    const [left, right] = pair;
    const metric = COMPARISON_MODES[mode].value;
    const correctId = metric(left) > metric(right) ? left.id : right.id;
    const correct = id === correctId;
    setAnswer({ chosenId: id, correctId, correct });
    onResult(correct);
  }

  const [left, right] = pair;
  const question = COMPARISON_MODES[mode];

  return (
    <section>
      <SectionHeader kicker="Step 4" title="Higher or Lower classroom game">
        Compare two places quickly, then check the evidence.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="quest-card p-4">
          <div className="grid grid-cols-3 gap-2">
            <ScoreTile label="Score" value={stats.score} />
            <ScoreTile label="Streak" value={stats.streak} />
            <ScoreTile label="Rounds" value={stats.rounds} />
          </div>

          <div className="mt-5 grid gap-2">
            {Object.entries(COMPARISON_MODES).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => nextRound(key)}
                className={`rounded-lg border px-3 py-3 text-left font-black transition ${
                  mode === key
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="quest-card p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-3xl font-black text-ink">{question.question}</h3>
            <button
              type="button"
              onClick={() => nextRound()}
              className="rounded-lg bg-reef px-4 py-3 font-black text-white transition hover:bg-teal-700"
            >
              New round
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[left, right].map((state) => {
              const chosen = answer?.chosenId === state.id;
              const correct = answer?.correctId === state.id;
              return (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => choose(state.id)}
                  className={`rounded-lg border p-5 text-left shadow-sm transition hover:-translate-y-1 ${
                    answer
                      ? correct
                        ? "border-gum bg-green-50"
                        : chosen
                        ? "border-red-300 bg-red-50"
                        : "border-ink/10 bg-white"
                      : "border-ink/10 bg-white hover:border-ocean/50"
                  }`}
                >
                  <span className={`rounded-lg px-3 py-1 text-sm font-black text-white ${state.colour}`}>
                    {state.short}
                  </span>
                  <h4 className="mt-4 text-3xl font-black text-ink">{state.name}</h4>
                  <p className="mt-3 text-lg font-bold text-ink/70">
                    {answer ? question.format(state) : "Choose this place"}
                  </p>
                </button>
              );
            })}
          </div>

          {answer && (
            <div className={`mt-4 rounded-lg p-4 font-black ${answer.correct ? "bg-green-100 text-gum" : "bg-red-100 text-red-700"}`}>
              {answer.correct ? "Correct." : "Not this time."} {stateById(answer.correctId).name} has the higher value for this question.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QuizMode({ onScoreChange }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = DATA.quiz[current];
  const answered = answers[current];
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;

  useEffect(() => {
    onScoreChange(correctCount);
  }, [correctCount, onScoreChange]);

  function choose(option) {
    if (answered) return;
    setAnswers((previous) => ({
      ...previous,
      [current]: { choice: option, correct: option === question.answer }
    }));
  }

  return (
    <section>
      <SectionHeader kicker="Step 5" title="Quiz mode">
        Use your map evidence to answer population, area, city and density questions.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="quest-card p-4">
          <ProgressBar value={Object.keys(answers).length} max={DATA.quiz.length} label="Questions answered" />
          <div className="mt-4 rounded-lg bg-white p-4 ring-1 ring-ink/10">
            <p className="text-sm font-black uppercase tracking-normal text-ink/55">Quiz score</p>
            <p className="text-4xl font-black text-ink">
              {correctCount}/{DATA.quiz.length}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {DATA.quiz.map((item, index) => (
              <button
                key={item.question}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-10 rounded-lg border text-sm font-black ${
                  current === index
                    ? "border-ocean bg-ocean text-white"
                    : answers[index]?.correct
                    ? "border-gum/30 bg-green-50 text-gum"
                    : answers[index]
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-ink/10 bg-white text-ink"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>

        <div className="quest-card p-5">
          <p className="text-sm font-black uppercase tracking-normal text-reef">
            Question {current + 1} of {DATA.quiz.length}
          </p>
          <h3 className="mt-2 text-3xl font-black leading-snug text-ink">{question.question}</h3>

          <div className="mt-5 grid gap-3">
            {question.options.map((option) => {
              const isChoice = answered?.choice === option;
              const isAnswer = question.answer === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  className={`rounded-lg border p-4 text-left text-lg font-bold transition ${
                    answered
                      ? isAnswer
                        ? "border-gum bg-green-50 text-gum"
                        : isChoice
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-ink/10 bg-white text-ink/55"
                      : "border-ink/10 bg-white text-ink hover:border-ocean/40 hover:bg-sky-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-5 rounded-lg border border-reef/20 bg-teal-50 p-4">
              <p className="font-black text-reef">{answered.correct ? "Correct" : "Check the evidence"}</p>
              <p className="mt-1 text-ink/76">{question.explanation}</p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrent((previous) => Math.max(0, previous - 1))}
              disabled={current === 0}
              className="rounded-lg border border-ink/10 bg-white px-4 py-3 font-black text-ink disabled:opacity-35"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrent((previous) => Math.min(DATA.quiz.length - 1, previous + 1))}
              disabled={current === DATA.quiz.length - 1}
              className="rounded-lg bg-ocean px-4 py-3 font-black text-white disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CitySimulation({ onScoreChange, onSelectState }) {
  const [stateId, setStateId] = useState("qld");
  const [settingId, setSettingId] = useState("regional-corridor");
  const chosenState = stateById(stateId);
  const setting = CITY_SETTINGS.find((item) => item.id === settingId);
  const factors = getCityFactors(chosenState, setting);
  const total = Object.values(factors).reduce((sum, value) => sum + value, 0);
  const scoreOutOfTen = Math.round((total / 30) * 10);
  const evaluation = getCityEvaluation(chosenState, setting, factors, total);

  useEffect(() => {
    onScoreChange(scoreOutOfTen);
    onSelectState(stateId);
  }, [scoreOutOfTen, onScoreChange, onSelectState, stateId]);

  return (
    <section>
      <SectionHeader kicker="Step 6" title="Build a New City">
        Choose a location, weigh the evidence, then test whether your new city plan makes geographic sense.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="quest-card p-4">
          <p className="text-sm font-black uppercase tracking-normal text-reef">Choose a state or territory</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {STATES.map((state) => (
              <button
                key={state.id}
                type="button"
                onClick={() => setStateId(state.id)}
                className={`rounded-lg border px-3 py-2 text-left font-black transition ${
                  stateId === state.id
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/40"
                }`}
              >
                {state.short}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-normal text-reef">Choose the location type</p>
          <div className="mt-3 grid gap-2">
            {CITY_SETTINGS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSettingId(item.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  settingId === item.id
                    ? "border-ocean bg-ocean text-white"
                    : "border-ink/10 bg-white text-ink hover:border-ocean/40"
                }`}
              >
                <span className="font-black">{item.label}</span>
                <span className={`mt-1 block text-sm ${settingId === item.id ? "text-white/80" : "text-ink/65"}`}>
                  {item.note}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="quest-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className={`rounded-lg px-3 py-1 text-sm font-black text-white ${chosenState.colour}`}>
                {chosenState.short}
              </span>
              <h3 className="mt-3 text-3xl font-black text-ink">
                {setting.label} in {chosenState.name}
              </h3>
              <p className="mt-1 text-ink/70">{chosenState.transport}</p>
            </div>
            <div className="rounded-lg bg-sand p-4 text-center">
              <p className="text-xs font-black uppercase tracking-normal text-ink/60">City plan score</p>
              <p className="text-4xl font-black text-ink">{scoreOutOfTen}/10</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {Object.entries(factors).map(([key, value]) => (
              <CityFactor key={key} label={CITY_FACTOR_LABELS[key]} value={value} />
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-reef/20 bg-teal-50 p-4">
            <p className="text-lg font-black text-reef">Evaluation</p>
            <p className="mt-2 leading-relaxed text-ink/78">{evaluation}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <EvidenceLine label="Climate evidence" text={chosenState.climate} />
            <EvidenceLine label="Available land evidence" text={chosenState.availableLand} />
          </div>
        </div>
      </div>
    </section>
  );
}

function getCityFactors(state, setting) {
  return Object.entries(state.cityScores).reduce((scores, [key, baseValue]) => {
    scores[key] = clamp(baseValue + (setting.mods[key] || 0), 1, 5);
    return scores;
  }, {});
}

function getCityEvaluation(state, setting, factors, total) {
  const sorted = Object.entries(factors).sort((a, b) => b[1] - a[1]);
  const strengths = sorted.slice(0, 2).map(([key]) => CITY_FACTOR_LABELS[key].toLowerCase());
  const risks = sorted.slice(-2).map(([key]) => CITY_FACTOR_LABELS[key].toLowerCase());
  const rating =
    total >= 23
      ? "This is a strong site for a planned city."
      : total >= 17
      ? "This site could work with careful planning."
      : "This site has some serious planning challenges.";
  return `${rating} A ${setting.label.toLowerCase()} in ${state.name} is strongest for ${strengths.join(
    " and "
  )}. The main questions are ${risks.join(" and ")}. A good plan would explain jobs, water, transport links and how the new city would avoid pressure on nearby environments.`;
}

function CityFactor({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-3">
      <div className="mb-2 flex justify-between gap-3 text-sm font-black text-ink">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="h-3 overflow-hidden rounded-lg bg-sand">
        <div className="h-full rounded-lg bg-reef" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}

function StudentSummary({
  selectedId,
  visitedIds,
  labelStats,
  rankingCompleted,
  higherStats,
  quizScore,
  cityScore,
  questPoints
}) {
  const [learnedId, setLearnedId] = useState(selectedId);
  const [pattern, setPattern] = useState(DATA.summaryPatterns[0]);
  const [why, setWhy] = useState(
    "Most Australians live near the coast and in capital cities because those places often have jobs, ports, transport links, services, water access and milder climates."
  );
  const [copyStatus, setCopyStatus] = useState("");
  const learnedState = stateById(learnedId);
  const strongestSkill = getStrongestSkill({ labelStats, rankingCompleted, higherStats, quizScore, cityScore, visitedIds });

  const summary = `Australia Population Quest summary

Score: ${questPoints} quest points
Strongest skill: ${strongestSkill}
One state or territory I learned about: ${learnedState.name}
One population pattern I noticed: ${pattern}

Where do most Australians live, and why?
${why}

Data source: ABS Estimated Resident Population, ${DATA.meta.populationReferenceDate}.`;

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Copied.");
    } catch (error) {
      setCopyStatus("Copy from the text box.");
    }
  }

  return (
    <section>
      <SectionHeader kicker="Final step" title="Student summary">
        Turn your evidence into a short geography explanation.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="quest-card p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <ScoreTile label="Quest points" value={questPoints} />
            <ScoreTile label="Strongest skill" value={strongestSkill} />
            <ScoreTile label="Quiz score" value={`${quizScore}/${DATA.quiz.length}`} />
            <ScoreTile label="City score" value={`${cityScore}/10`} />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-black uppercase tracking-normal text-reef">Place I learned about</span>
            <select
              value={learnedId}
              onChange={(event) => setLearnedId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-white px-3 py-3 font-bold text-ink"
            >
              {STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-black uppercase tracking-normal text-reef">Pattern noticed</span>
            <select
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-white px-3 py-3 font-bold text-ink"
            >
              {DATA.summaryPatterns.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-black uppercase tracking-normal text-reef">Where do most Australians live, and why?</span>
            <textarea
              value={why}
              onChange={(event) => setWhy(event.target.value)}
              rows="5"
              className="mt-2 w-full rounded-lg border border-ink/10 bg-white px-3 py-3 font-bold leading-relaxed text-ink"
            />
          </label>
        </aside>

        <div className="quest-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2xl font-black text-ink">Copyable summary</h3>
            <button
              type="button"
              onClick={copySummary}
              className="rounded-lg bg-ocean px-4 py-3 font-black text-white transition hover:bg-blue-700"
            >
              Copy summary
            </button>
          </div>
          {copyStatus && <p className="mt-3 rounded-lg bg-green-50 p-3 font-black text-gum">{copyStatus}</p>}
          <textarea
            readOnly
            value={summary}
            rows="17"
            className="mt-4 w-full rounded-lg border border-ink/10 bg-white p-4 font-mono text-sm leading-relaxed text-ink"
          />
          <div className="mt-4 rounded-lg border border-ink/10 bg-sand/60 p-4 text-sm font-bold text-ink/72">
            Source note: {DATA.meta.populationSource}. Land areas: {DATA.meta.landAreaSource}.
          </div>
        </div>
      </div>
    </section>
  );
}

function getStrongestSkill({ labelStats, rankingCompleted, higherStats, quizScore, cityScore, visitedIds }) {
  const rankingScore = Object.keys(rankingCompleted).length / 3;
  const skillScores = [
    { label: "map investigation", value: visitedIds.length / STATES.length },
    { label: "label accuracy", value: labelStats.correct / (STATES.length * 3) },
    { label: "data ranking", value: rankingScore },
    { label: "quick comparisons", value: Math.min(higherStats.score / 6, 1) },
    { label: "quiz knowledge", value: quizScore / DATA.quiz.length },
    { label: "city planning", value: cityScore / 10 }
  ];
  return skillScores.sort((a, b) => b.value - a.value)[0].label;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
