import { useState } from "react";
import { X, User, Mail, Phone, Camera, CreditCard, CheckCircle2, ScanFace, Upload, MessageCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface EliteMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function EliteMembershipModal({
  isOpen,
  onClose,
  onComplete,
}: EliteMembershipModalProps) {
  const [step, setStep] = useState<"details" | "verification">("details");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "scanning" | "success">("pending");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("verification");
  };

  const simulateStripeIdentity = async () => {
    if (!user) {
      toast.error("You must be logged in to verify identity.");
      navigate("/login");
      return;
    }

    setVerificationStatus("scanning");
    toast.loading("Preparing secure verification...", { id: "identity" });

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://us-central1-navysharks.cloudfunctions.net/api'}/api/identity/create-verification-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();
      if (data.url) {
        toast.dismiss("identity");
        window.location.href = data.url; // Redirect to Stripe Identity
      } else {
        throw new Error(data.error || "Failed to create verification session");
      }
    } catch (error: any) {
      let title = "Verification Failed";
      let description = error.message;

      // Handle the specific Stripe Identity not activated error gracefully
      if (error.message && error.message.includes("not set up to use Identity")) {
        title = "Stripe Identity Not Activated";
        description = "This feature requires manual activation in your live Stripe Dashboard. Please visit Stripe > Settings > Identity to enable live verifications.";
      }

      toast.error(title, { 
        id: "identity", 
        description: description,
        duration: 8000
      });
      setVerificationStatus("pending");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 pb-10">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-yellow-500/30 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h2 className="text-xl font-bold text-yellow-500">Elite Membership Registration</h2>
            <p className="text-sm text-slate-400 mt-1">
              $245/year • Complete your profile to proceed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Progress Sidebar */}
          <div className="md:w-1/3 bg-slate-800/30 p-6 border-r border-slate-800 flex flex-row md:flex-col gap-4 md:gap-0 justify-between md:justify-start">
            <div className="space-y-6 relative md:before:absolute md:before:inset-0 md:before:ml-4 md:before:translate-x-0 md:before:h-full md:before:w-0.5 md:before:bg-slate-800 hidden md:block">
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'details' ? 'bg-yellow-500 text-slate-950' : 'bg-green-500 text-white'}`}>
                  {step === 'details' ? '1' : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className={`font-semibold ${step === 'details' ? 'text-white' : 'text-slate-400'}`}>Guest Details</div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'verification' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
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
                    <label className="text-sm font-medium text-slate-300">First Legal Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Last Legal Name *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        required
                        type="email"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Gender *</label>
                    <select required className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none">
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">WhatsApp Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      required
                      type="tel"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Required for VIP Concierge group access.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Phone (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="tel"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Telegram (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageCircle className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-950 font-bold rounded-xl hover:from-yellow-400 hover:to-orange-500 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
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
                    <span>To ensure a safe and premium experience, we require all Elite Members to complete a quick ID verification using <strong>Stripe Identity</strong>.</span>
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
                      <div className="ml-auto shrink-0">
                        {verificationStatus === 'pending' && (
                          <button 
                            onClick={simulateStripeIdentity}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                            <Upload className="w-4 h-4 shrink-0" /> Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Face Scan */}
                  <div className={`p-5 rounded-xl border-2 transition-all ${verificationStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : verificationStatus === 'scanning' ? 'border-yellow-500 animate-pulse bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${verificationStatus === 'success' ? 'bg-green-500' : verificationStatus === 'scanning' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-700'}`}>
                        {verificationStatus === 'success' ? <CheckCircle2 className="w-6 h-6 text-slate-950" /> : <ScanFace className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Face Scan</h4>
                        <p className="text-sm text-slate-400">
                          {verificationStatus === 'scanning' ? 'Scanning face... Please hold still.' : 'Verify your identity securely'}
                        </p>
                      </div>
                      <div className="ml-auto shrink-0">
                        {verificationStatus === 'pending' && (
                          <button 
                            onClick={simulateStripeIdentity}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
                            <Camera className="w-4 h-4 shrink-0" /> Start Scan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={verificationStatus !== 'success'}
                  onClick={onComplete}
                  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] ${
                    verificationStatus === 'success' 
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-950 hover:from-yellow-400 hover:to-orange-500" 
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
