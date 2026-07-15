import { Link, useSearchParams } from "react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-lg px-6 py-12 text-center">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-green-900/30 rounded-3xl p-10 shadow-2xl shadow-green-900/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-slate-400 mb-8">
            Welcome to the Elite Concierge Club. Your payment of $4,900 has been processed successfully. Your account is being upgraded.
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
