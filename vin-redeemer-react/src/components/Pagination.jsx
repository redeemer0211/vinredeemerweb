import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1 font-mono text-xs uppercase px-3 py-2 rounded border border-lineb text-txd disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan hover:text-gray-100"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="font-mono text-xs text-txd">Page {page} of {totalPages}</span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-1 font-mono text-xs uppercase px-3 py-2 rounded border border-lineb text-txd disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan hover:text-gray-100"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
