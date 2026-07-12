const VARIANTS = {
  primary: "bg-gradient-to-br from-cyan-dim to-cyan border-cyan text-[#04211f] hover:shadow-glow-cyan",
  watch: "bg-gradient-to-br from-mag-dim to-mag border-mag text-[#2a0714] hover:shadow-glow-mag",
  ghost: "bg-transparent border-lineb text-gray-100 hover:border-cyan hover:shadow-glow-cyan",
};

export default function Btn({ children, variant = "ghost", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-mono font-semibold text-xs uppercase tracking-wide px-4 py-3 rounded border transition-transform hover:-translate-y-0.5 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
