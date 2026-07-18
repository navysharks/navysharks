import { Link, useSearchParams } from "react-router";
import { CheckCircle2, ArrowRight, Crown, Calendar } from "lucide-react";

export function Success() {
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get("type"); // "bundle" or null (elite membership)
  const isBundle = paymentType === "bundle";

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg px-6 py-12 text-center">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-green-900/30 rounded-3xl p-10 shadow-2xl shadow-green-900/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            {isBundle
              ? <Calendar className="w-10 h-10 text-green-400" />
              : <Crown className="w-10 h-10 text-green-400" />
            }
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            {isBundle ? "Booking Confirmed!" : "Payment Successful!"}
          </h1>
          <p className="text-slate-400 mb-2">
            {isBundle
              ? "Your experience has been booked. Our concierge team will contact you via WhatsApp to finalize the details."
              : "Welcome to the Elite Concierge Club. Your membership is now active and your account has been upgraded."
            }
          </p>
          <p className="text-slate-500 text-sm mb-8">
            A confirmation email will be sent to your registered address shortly.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-medium transition-all shadow-lg shadow-cyan-900/20"
          >
            Go to Member Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

