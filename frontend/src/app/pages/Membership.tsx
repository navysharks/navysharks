import { CreditCard, Check, Loader2, Crown } from "lucide-react";
import { EliteMembershipModal } from "../components/EliteMembershipModal";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";

export function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEliteModalOpen, setIsEliteModalOpen] = useState(false);
  // W5: Initialize from localStorage so UI reflects the correct plan after Stripe Identity redirect
  const [eliteBilling, setEliteBilling] = useState<'yearly' | 'monthly'>(
    () => (localStorage.getItem('eliteBillingChoice') as 'yearly' | 'monthly') || 'yearly'
  );

  // Persist choice so it survives the Stripe Identity redirect
  useEffect(() => {
    localStorage.setItem('eliteBillingChoice', eliteBilling);
  }, [eliteBilling]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showRFID, setShowRFID] = useState(false);
  const [rfidCode, setRfidCode] = useState<string | null>(null);

  // W4: Guard ref to prevent double-triggering checkout on auth token refresh
  const checkoutTriggered = useRef(false);

  const handleEliteCheckoutComplete = async (verificationSessionId?: string) => {
    if (!user) {
      toast.error("Please login to proceed with Elite Membership");
      navigate("/login");
      return;
    }

    setIsEliteModalOpen(false);
    toast.loading("Preparing secure checkout...", { id: "checkout" });
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://us-central1-navysharks.cloudfunctions.net/api'}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          verificationSessionId: verificationSessionId,
          billingPlan: localStorage.getItem('eliteBillingChoice') || 'yearly',
        })
      });

      const data = await response.json();
      
      if (data.url) {
        toast.dismiss("checkout");
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      toast.error("Checkout failed", { id: "checkout", description: error.message });
      console.error(error);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("verification_session_id");
    if (sessionId && user && !checkoutTriggered.current) {
      // W4: Mark as triggered immediately to prevent duplicate calls on auth refresh
      checkoutTriggered.current = true;

      // Pass the real verification session ID to the backend for server-side validation
      handleEliteCheckoutComplete(sessionId);
      
      // Clean up the URL correctly using setSearchParams
      setSearchParams(prev => {
        prev.delete("verification_session_id");
        return prev;
      }, { replace: true });
    }

    const joinParam = searchParams.get("join");
    if (joinParam === "true") {
      setIsEliteModalOpen(true);
      setSearchParams(prev => {
        prev.delete("join");
        return prev;
      }, { replace: true });
    }
  }, [searchParams, user, setSearchParams]);

  const generateRFID = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const existingCode = userDoc.data()?.rfidCode;

      if (existingCode) {
        setRfidCode(existingCode);
      } else {
        const newCode = `NS-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
        await setDoc(userDocRef, { rfidCode: newCode }, { merge: true });
        setRfidCode(newCode);
      }
      setShowRFID(true);
      toast.success("RFID Code Generated!", {
        description: "Your unique RFID code is ready.",
      });
    } catch (error) {
      console.error("Error generating RFID:", error);
      toast.error("Failed to generate RFID code.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Elite Membership
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              The ultimate gateway to exclusive perks and VIP treatment.
            </p>
          </div>
        </div>
      </section>

      {/* Annual Membership */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-10 rounded-2xl border-2 border-yellow-500/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32"></div>

              <div className="bg-red-600 text-white text-center py-2 px-4 rounded-xl font-black tracking-widest text-sm mb-8 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                LIMITED OFFER ON THE ELITE MEMBERSHIP - FIRST THOUSAND MEMBERS ONLY!
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-10 h-10 text-yellow-500" />
                  <div>
                    <h2 className="text-3xl font-bold text-yellow-500">
                      Elite Membership
                    </h2>
                    <p className="text-slate-400">
                      Unlock exclusive benefits across all destinations
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex flex-col gap-4 mb-4">
                      {/* Yearly Option */}
                      <div 
                        onClick={() => setEliteBilling('yearly')}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${eliteBilling === 'yearly' ? 'bg-slate-900/80 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-slate-900/40 border border-slate-700 hover:bg-slate-800'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-3xl font-bold text-white">
                            $245<span className="text-sm text-slate-400">/year</span>
                          </div>
                          <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-wider">
                            BEST VALUE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">One-time annual fee. Save 58%</p>
                      </div>

                      {/* Monthly Option */}
                      <div 
                        onClick={() => setEliteBilling('monthly')}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${eliteBilling === 'monthly' ? 'bg-slate-900/80 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-slate-900/40 border border-slate-700 hover:bg-slate-800'}`}>
                        <div className="text-2xl font-bold text-white mb-1">
                          $49<span className="text-sm text-slate-400">/month</span>
                        </div>
                        <p className="text-xs text-slate-400">No refunds. Cancel anytime.</p>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-6">
                      <p className="text-yellow-500 font-bold text-sm mb-1">
                        $245 Welcome Credit (5x $49 Vouchers)
                      </p>
                      <p className="text-xs text-slate-300">
                        Added to your account instantly upon purchase. 
                        <span className="font-semibold text-white ml-1">Limit 1 voucher use per 24 hours.</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Affiliate partners access visibility only for Elite Members
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          2 TRIPS @ 5% credit
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Priority VIP table allocation at all partner clubs
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Complimentary upgrade once per year
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Phone access strictly for Elite members only
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Private WhatsApp group access sent upon signup
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Physical & digital QR CODE and RFID membership card (Delivery: 1-4 weeks)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="bg-slate-950/50 p-6 rounded-xl border border-yellow-500/30 mb-6">
                      <h4 className="font-semibold mb-3 text-yellow-400">
                        Example Savings:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Welcome Credit:
                          </span>
                          <span className="text-white">
                            $245
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            2 trips @ 5% credit:
                          </span>
                          <span className="text-white">
                            ~$130 saved
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Free upgrade value:
                          </span>
                          <span className="text-white">
                            $400+
                          </span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between font-semibold">
                          <span className="text-slate-300">
                            Total value:
                          </span>
                          <span className="text-cyan-400">
                            $775+
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsEliteModalOpen(true)}
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-950 font-bold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all">
                      Become an Elite Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RFID System */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <CreditCard className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-cyan-400">
                RFID Verification System
              </h2>
              <p className="text-xl text-slate-300">
                Secure, unique membership verification for seamless partner access
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-semibold mb-6">
                How It Works
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Instant Generation</h4>
                    <p className="text-slate-300">
                      Upon signup, a unique RFID code is automatically generated for your account—no duplicates, no screenshots accepted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">ID Verification</h4>
                    <p className="text-slate-300">
                      Upload your government ID (driver's license or passport) and matching bank card for verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Direct Access</h4>
                    <p className="text-slate-300">
                      Use your RFID code directly at affiliate locations via the website or app—verified in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Physical Card</h4>
                    <p className="text-slate-300">
                      Receive your physical RFID card shipped to your address for ultimate convenience and status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30">
                <h4 className="font-semibold mb-4 text-cyan-400">
                  Demo: RFID Code Generator
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  This is a demonstration of how your unique code will be generated upon membership registration.
                </p>

                {!showRFID ? (
                  <button
                    onClick={generateRFID}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate RFID Code"
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-lg border-2 border-cyan-500">
                      <p className="text-xs text-slate-400 mb-2">
                        Your Unique RFID Code:
                      </p>
                      <p className="text-2xl font-mono font-bold text-cyan-400">
                        {rfidCode || "Generating..."}
                      </p>
                    </div>
                    <p className="text-sm text-slate-400">
                      ✓ This code is unique and cannot be duplicated
                      <br />✓ Verified against your government ID and payment card
                      <br />✓ Works at all Navy Sharks affiliate locations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
              Membership FAQ
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  Can I cancel my membership?
                </h3>
                <p className="text-slate-300">
                  VIP monthly memberships can be canceled anytime. Annual plans are non-refundable but you retain access for the full year.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  How long does RFID card shipping take?
                </h3>
                <p className="text-slate-300">
                  Physical RFID cards are shipped within 3-5 business days. You can use your digital code immediately while waiting.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  Which countries are included?
                </h3>
                <p className="text-slate-300">
                  All memberships include access to our affiliate partners in Colombia, Brazil, Philippines, and Thailand.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  What's included in the Elite parties?
                </h3>
                <p className="text-slate-300">
                  Monthly Elite parties are exclusive events at premium venues with open bar, VIP tables, and curated guest lists. Locations rotate between our four destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Membership Modal */}
      <EliteMembershipModal
        isOpen={isEliteModalOpen}
        onClose={() => setIsEliteModalOpen(false)}
        onComplete={handleEliteCheckoutComplete}
      />
    </div>
  );
}
