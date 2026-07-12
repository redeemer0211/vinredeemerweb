import { useEffect, useState } from "react";
import { Lock, X, ArrowLeft } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import { checkCredentials, setSession } from "../lib/auth.js";

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("User ID and password are both required.");
      return;
    }
    setLoading(true);
    const ok = await checkCredentials(email, password);
    setTimeout(() => {
      setLoading(false);
      if (ok) {
        setSession();
        onSuccess();
      } else {
        setDenied(true);
      }
    }, 400);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="scanlines" />
      <div className="relative w-full max-w-[420px] rounded-lg overflow-hidden bg-panel border border-lineb shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs text-txd bg-raised border-b border-line">
          <span className="w-2.5 h-2.5 rounded-full bg-mag" />
          <span className="w-2.5 h-2.5 rounded-full bg-gold" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
          <span className="ml-auto">access_control.exe</span>
          <button onClick={onClose} aria-label="Close" className="text-txd hover:text-gray-100">
            <X size={14} />
          </button>
        </div>

        {denied ? (
          <div className="p-8 text-center">
            <div className="font-display text-mag mb-4 text-[clamp(2.4rem,8vw,3.4rem)] drop-shadow-[0_0_14px_rgba(255,61,127,0.5)]">
              404
            </div>
            <p className="font-mono text-sm mb-7 text-txd">
              Nothing lives at this address. Wrong link, or the credentials
              that got you here didn't check out — either way, there's
              nothing more to see.
            </p>
            <Btn variant="primary" onClick={() => setDenied(false)}>
              <ArrowLeft size={14} /> Try again
            </Btn>
          </div>
        ) : (
          <div className="p-8">
            <div className="font-display text-center text-base mb-2">
              VIN<span className="text-mag">_</span>REDEEMER
            </div>
            <div className="blink-cursor font-mono text-center text-xs mb-7 tracking-widest text-txd">
              RESTRICTED ACCESS
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <Field label="User ID">
                <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus />
              </Field>
              <Field label="Password">
                <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </Field>
              {error && <p className="font-mono text-xs mb-2 text-mag">{error}</p>}
              <Btn variant="primary" type="submit" className="w-full justify-center mt-2">
                <Lock size={14} /> {loading ? "Authenticating…" : "Authenticate"}
              </Btn>
            </form>

            <p className="font-mono text-[11px] text-center mt-6 leading-relaxed text-txf">
              Single-operator system. Unrecognized credentials are routed
              away — no further detail is given on what didn't match.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
