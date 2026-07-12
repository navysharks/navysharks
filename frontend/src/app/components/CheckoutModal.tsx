import { useState } from "react";
import { X, User, Mail, Phone, Camera, CreditCard, CheckCircle2, ScanFace, Upload } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  selectedDate: Date | null;
  bundleName: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onComplete,
  selectedDate,
  bundleName,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"details" | "verification">("details");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "scanning" | "success">("pending");

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("verification");
  };

  const simulateStripeIdentity = () => {
    setVerificationStatus("scanning");
    setTimeout(() => {
      setVerificationStatus("success");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 pb-10">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white">Complete Your Booking</h2>
            <p className="text-sm text-cyan-400 mt-1">
              {bundleName} • {selectedDate?.toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Progress Sidebar */}
          <div className="hidden md:block w-1/3 bg-slate-800/30 p-6 border-r border-slate-800">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'details' ? 'bg-cyan-500 text-slate-950' : 'bg-green-500 text-white'}`}>
                  {step === 'details' ? '1' : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className={`font-semibold ${step === 'details' ? 'text-white' : 'text-slate-400'}`}>Guest Details</div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'verification' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  2
                </div>
                <div className={`font-semibold ${step === 'verification' ? 'text-white' : 'text-slate-400'}`}>ID Verification</div>
              </div>
              <div className="relative flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center shrink-0 z-10">
                  3
                </div>
                <div className="font-semibold text-slate-400">Payment</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-6">
            {step === "details" && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Phone / WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      required
                      type="tel"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Continue to Verification
                </button>
              </form>
            )}

            {step === "verification" && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>To ensure a safe and premium experience, we require all guests to complete a quick ID verification using <strong>Stripe Identity</strong>.</span>
                  </p>
                </div>

                <div className="space-y-4">
                  {/* ID Upload */}
                  <div className={`p-5 rounded-xl border-2 transition-all ${verificationStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${verificationStatus === 'success' ? 'bg-green-500' : 'bg-slate-700'}`}>
                        {verificationStatus === 'success' ? <CheckCircle2 className="w-6 h-6 text-slate-950" /> : <CreditCard className="w-6 h-6 text-slate-300" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Government ID</h4>
                        <p className="text-sm text-slate-400">Upload Passport or Driver's License</p>
                      </div>
                      <div className="ml-auto">
                        {verificationStatus === 'pending' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                            <Upload className="w-4 h-4" /> Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Face Scan */}
                  <div className={`p-5 rounded-xl border-2 transition-all ${verificationStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : verificationStatus === 'scanning' ? 'border-cyan-500 animate-pulse bg-cyan-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${verificationStatus === 'success' ? 'bg-green-500' : verificationStatus === 'scanning' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700'}`}>
                        {verificationStatus === 'success' ? <CheckCircle2 className="w-6 h-6 text-slate-950" /> : <ScanFace className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Face Scan</h4>
                        <p className="text-sm text-slate-400">
                          {verificationStatus === 'scanning' ? 'Scanning face... Please hold still.' : 'Verify your identity securely'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {verificationStatus === 'pending' && (
                          <button 
                            onClick={simulateStripeIdentity}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-sm font-bold transition-colors">
                            <Camera className="w-4 h-4" /> Start Scan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={verificationStatus !== 'success'}
                  onClick={onComplete}
                  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] ${
                    verificationStatus === 'success' 
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  Continue to Payment (Stripe Checkout)
                </button>
                <p className="text-xs text-center text-slate-500">
                  Secured by Stripe Identity. Your data is encrypted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
