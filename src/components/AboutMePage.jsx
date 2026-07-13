export default function AboutMePage({ aboutMe }) {
  const { hobbies = [], games = [], freeTime = "" } = aboutMe || {};

  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <h1 className="font-display text-lg mb-2">About Me</h1>
        <p className="font-mono text-sm text-txd">The stuff that doesn't fit in a bio line.</p>
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          <div className="rounded-lg p-6 bg-panel border border-line h-full">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">Hobbies</div>
            {hobbies.length === 0 ? (
              <p className="font-mono text-xs text-txf">Nothing listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <span key={h} className="font-mono text-xs px-3 py-1.5 rounded-full border border-cyan-dim text-cyan">{h}</span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg p-6 bg-panel border border-line h-full">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">Games I play</div>
            {games.length === 0 ? (
              <p className="font-mono text-xs text-txf">Nothing listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {games.map((g) => (
                  <span key={g} className="font-mono text-xs px-3 py-1.5 rounded-full border border-mag-dim text-mag">{g}</span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg p-6 bg-panel border border-line h-full">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">Free time</div>
            <p className="text-sm text-txd whitespace-pre-wrap">
              {freeTime || "Nothing written yet."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
