import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Camera, CreditCard, CheckCircle2, ScanFace, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (addons: string[], guestDetails: GuestDetails) => void;
  selectedDate: Date | null;
  bundleName: string;
  bundlePrice: string;
  userToken: string | null;
  onBeforeRedirect?: (addons: string[]) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onComplete,
  selectedDate,
  bundleName,
  bundlePrice,
  userToken,
  onBeforeRedirect,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"details" | "addons" | "verification">("details");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "scanning" | "success">("pending");

  // Controlled guest detail fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // W6: Reset state on reopen
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setSelectedAddons([]);
      setVerificationStatus("pending");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    }
  }, [isOpen]);

  const addonsList = [
    { id: "helicopter", name: "Helicopter Airport Transfer", price: 380, icon: "🚁" },
    { id: "yacht_ext", name: "Extend Yacht Charter (+4 hrs)", price: 600, icon: "🛥️" },
    { id: "vip_night", name: "Extra VIP Nightlife Experience", price: 250, icon: "🌙" },
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleNextDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("addons");
  };

  const handleNextAddons = () => {
    onComplete(selectedAddons, { firstName, lastName, email, phone });
  };

  const handleStartVerification = async () => {
    if (!userToken) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    setVerificationStatus("scanning");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://us-central1-navysharks.cloudfunctions.net/api'}/api/identity/create-verification-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.url) {
        if (onBeforeRedirect) {
          onBeforeRedirect(selectedAddons);
        }
        // Redirect to Stripe Identity verification page
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start verification");
      }
    } catch (error: any) {
      toast.error("Verification failed: " + error.message);
      setVerificationStatus("pending");
    }
  };


  if (!isOpen) return null;

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
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-800">
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'details' ? 'bg-cyan-500 text-slate-950' : 'bg-green-500 text-white'}`}>
                  {step === 'details' ? '1' : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className={`font-semibold ${step === 'details' ? 'text-white' : 'text-slate-400'}`}>Guest Details</div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'addons' ? 'bg-cyan-500 text-slate-950' : step === 'verification' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {step === 'addons' ? '2' : step === 'verification' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                </div>
                <div className={`font-semibold ${step === 'addons' ? 'text-white' : 'text-slate-400'}`}>Enhancements</div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step === 'verification' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  3
                </div>
                <div className={`font-semibold ${step === 'verification' ? 'text-white' : 'text-slate-400'}`}>ID Verification</div>
              </div>
              <div className="relative flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center shrink-0 z-10">
                  4
                </div>
                <div className="font-semibold text-slate-400">Payment</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-6">
            {step === "details" && (
              <form onSubmit={handleNextDetails} className="space-y-4">
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
                         value={firstName}
                         onChange={e => setFirstName(e.target.value)}
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
                     value={lastName}
                     onChange={e => setLastName(e.target.value)}
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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
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
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Continue to Enhancements
                </button>
              </form>
            )}

            {step === "addons" && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                  <h3 className="font-bold text-white text-lg">Enhance Your Experience</h3>
                  <p className="text-sm text-slate-400">Select premium add-ons for your trip.</p>
                </div>

                <div className="space-y-3">
                  {addonsList.map(addon => (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        selectedAddons.includes(addon.id) 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{addon.icon}</div>
                        <div>
                          <h4 className="font-bold text-white">{addon.name}</h4>
                          <p className="text-sm text-slate-400">+${addon.price}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAddons.includes(addon.id) ? 'border-cyan-500 bg-cyan-500' : 'border-slate-600'
                      }`}>
                        {selectedAddons.includes(addon.id) && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep("details")}
                    className="w-1/3 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextAddons}
                    className="w-2/3 py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    Continue to Verification
                  </button>
                </div>
              </div>
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
                            onClick={handleStartVerification}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-sm font-bold transition-colors">
                            <Camera className="w-4 h-4" /> Start Verification
                          </button>
                        )}
                        {verificationStatus === 'scanning' && (
                          <div className="flex items-center gap-2 text-cyan-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-6">
                  <h4 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">Order Summary</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{bundleName}</span>
                      <span className="text-slate-300 font-mono">{bundlePrice}</span>
                    </div>
                    {selectedAddons.map(addonId => {
                      const addon = addonsList.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-slate-400">{addon.name}</span>
                          <span className="text-slate-300 font-mono">+${addon.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-slate-800">
                    <span className="text-white">Total Estimate</span>
                    <span className="text-cyan-400 font-mono">
                      {(() => {
                        const safePrice = bundlePrice || "";
                        const basePrice = parseInt(safePrice.replace(/[^0-9]/g, '') || "0", 10);
                        const addonsTotal = selectedAddons.reduce((sum, id) => {
                          const addon = addonsList.find(a => a.id === id);
                          return sum + (addon ? addon.price : 0);
                        }, 0);
                        if (basePrice > 0) return `$${(basePrice + addonsTotal).toLocaleString()}`;
                        return addonsTotal > 0 ? `Custom + $${addonsTotal.toLocaleString()}` : 'Custom';
                      })()}
                    </span>
                  </div>
                </div>

                <button
                  disabled={verificationStatus !== 'success'}
                  onClick={() => onComplete(selectedAddons)}
                  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] ${
                    verificationStatus === 'success' 
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  Continue to Payment (Stripe Checkout)
                </button>
                <p className="text-xs text-center text-slate-500 mt-2">
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
