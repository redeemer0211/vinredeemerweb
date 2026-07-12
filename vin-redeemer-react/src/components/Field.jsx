export const inputClass =
  "w-full bg-void border border-lineb text-gray-100 rounded px-3 py-2.5 font-sans text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

export default function Field({ label, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-xs uppercase tracking-wide text-txd mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="font-mono text-[11px] text-txf mt-1">{hint}</p>}
    </div>
  );
}
