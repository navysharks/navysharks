import { X } from "lucide-react";
import { toast } from "sonner";

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  standardQty: number;
  michelinQty: number;
  onSetStandardQty: (qty: number) => void;
  onSetMichelinQty: (qty: number) => void;
  onAddToCart: () => void;
}

export function ClubModal({
  isOpen,
  onClose,
  standardQty,
  michelinQty,
  onSetStandardQty,
  onSetMichelinQty,
  onAddToCart,
}: ClubModalProps) {
  if (!isOpen) return null;

  const total = (standardQty * 499) + (michelinQty * 899);

  const handleAddToCart = () => {
    onAddToCart();
    onClose();
    toast.success("Club Credit added to cart!", {
      description: `Total: $${total.toLocaleString()}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
          <h3 className="font-bold text-xl text-cyan-400">Club/Restaurant Credit</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-2 border border-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            {/* Standard Credit */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                standardQty > 0
                  ? "border-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="accent-cyan-400 w-5 h-5"
                  checked={standardQty > 0}
                  onChange={() => onSetStandardQty(standardQty > 0 ? 0 : 1)}
                />
                <span className="text-base font-semibold">Standard Credit ($499*)</span>
              </div>
              {standardQty > 0 && (
                <div
                  className="flex items-center gap-3 bg-slate-900 rounded-lg border border-slate-600 p-1.5"
                  onClick={(e) => e.preventDefault()}
                >
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetStandardQty(Math.max(1, standardQty - 1)); }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md text-slate-300 transition-colors font-medium"
                  >-</button>
                  <span className="text-base w-6 text-center font-bold text-white">{standardQty}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetStandardQty(standardQty + 1); }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md text-slate-300 transition-colors font-medium"
                  >+</button>
                </div>
              )}
            </label>

            {/* Michelin Hollywood */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                michelinQty > 0
                  ? "border-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="accent-cyan-400 w-5 h-5"
                  checked={michelinQty > 0}
                  onChange={() => onSetMichelinQty(michelinQty > 0 ? 0 : 1)}
                />
                <span className="text-base font-semibold">Michelin Hollywood ($899*)</span>
              </div>
              {michelinQty > 0 && (
                <div
                  className="flex items-center gap-3 bg-slate-900 rounded-lg border border-slate-600 p-1.5"
                  onClick={(e) => e.preventDefault()}
                >
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetMichelinQty(Math.max(1, michelinQty - 1)); }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md text-slate-300 transition-colors font-medium"
                  >-</button>
                  <span className="text-base w-6 text-center font-bold text-white">{michelinQty}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetMichelinQty(michelinQty + 1); }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md text-slate-300 transition-colors font-medium"
                  >+</button>
                </div>
              )}
            </label>
          </div>

          <p className="text-sm text-cyan-300 bg-cyan-900/30 p-3 rounded-xl border border-cyan-500/30 text-center leading-relaxed font-medium">
            All bought credit can be used for all dining &amp; nightlife services
          </p>

          {(standardQty > 0 || michelinQty > 0) && (
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-1"
              >
                <span className="text-lg">Add to cart</span>
                <span className="text-lg">${total.toLocaleString()}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
