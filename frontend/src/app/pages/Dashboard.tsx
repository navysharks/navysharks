import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Shield, MessageCircle, Star, MapPin, Users, Crown, CalendarDays, ScanLine, X, Loader2, Wallet, TrendingUp, CreditCard, Package, Truck, PackageCheck, Gift, Copy, Check } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "sonner";
import { ConciergeChatModal } from "../components/ConciergeChatModal";
import logoUrl from "../../assets/logo_optimized.webp";

export function Dashboard() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  // All hooks must be declared before any conditional returns (React Rules of Hooks)
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showRFID, setShowRFID] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rfidCode, setRfidCode] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [tripCredits, setTripCredits] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Pre-compute barcode dimensions once so they don't flicker on re-renders
  const barcodeBars = useMemo(() =>
    [...Array(24)].map(() => ({
      width: Math.random() > 0.5 ? 'w-1' : 'w-2',
      height: Math.random() > 0.5 ? 'h-full' : 'h-3/4',
    })),
  []);

  const handleShowRFID = async () => {
    if (!user) return;
    setShowRFID(true);
    if (!rfidCode) {
      setIsGenerating(true);
      try {
        // Check if RFID code already exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const existingCode = userDoc.data()?.rfidCode;

        if (existingCode) {
          setRfidCode(existingCode);
        } else {
          // Generate new code and save it permanently to Firestore
          const newCode = `NS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          await setDoc(userDocRef, { rfidCode: newCode }, { merge: true });
          setRfidCode(newCode);
        }
      } catch (error) {
        console.error("Error fetching/saving RFID code:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    // Guard: user may be null briefly during auth state transitions
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "bookings"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(fetchedBookings);
        
        // Calculate 5% Trip Credits
        let spent = 0;
        fetchedBookings.forEach((b: any) => {
          spent += (b.amountPaid || 0) / 100;
        });
        setTotalSpent(spent);
        setTripCredits(spent * 0.05);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchBookings();
  }, [user?.uid]);

  // All hooks are declared above — safe to return null conditionally here
  if (!user) return null;

  const isElite = userData?.membershipStatus === "Elite";

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Compact Header */}
        <div className="mb-10">
          <p className="text-slate-500 text-sm tracking-wider uppercase mb-1">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {userData?.name || user.email}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{userData?.email || user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile / Digital Card */}
          <div className="lg:col-span-5 space-y-6">
            {isElite ? (
              // Elite Black Card Design - Hyper Realistic
              <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-slate-900 via-slate-950 to-black rounded-2xl p-5 md:p-6 flex flex-col justify-between border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden group">
                {/* Brushed metal / Carbon fiber subtle texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-transparent to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]" />
                
                {/* Card subtle shine on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform ease-in-out" />
                
                {/* Top Row: Logo & Shield */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center drop-shadow-xl">
                      <img src={logoUrl} alt="Navy Sharks" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white font-bold tracking-[0.2em] text-[10px] md:text-sm drop-shadow-md">NAVY SHARKS</span>
                  </div>
                  <Shield className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center mt-2 md:mt-1">
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    {/* Realistic EMV Chip */}
                    <div className="w-9 h-6 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md p-1 shadow-inner relative overflow-hidden border border-yellow-700/50">
                      <div className="absolute inset-0 border border-yellow-700/30 rounded-md" />
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-700/30" />
                      <div className="absolute left-1/3 top-0 w-[1px] h-full bg-yellow-700/30" />
                      <div className="absolute right-1/3 top-0 w-[1px] h-full bg-yellow-700/30" />
                      <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-yellow-700/30 rounded-[2px]" />
                    </div>
                    
                    {/* Contactless Icon */}
                    <svg className="w-5 h-5 text-slate-400 rotate-90 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                      <line x1="12" y1="20" x2="12.01" y2="20"></line>
                    </svg>
                  </div>
                  
                  {/* Fake Card Number for realism */}
                  <div className="text-slate-300 font-mono text-sm md:text-base tracking-[0.15em] mb-1 text-shadow-sm opacity-90 truncate">
                    ELIT  8842  0001  9999
                  </div>
                </div>
                
                {/* Bottom Row: Name, Dates, Mastercard Logo */}
                <div className="relative z-10 flex justify-between items-end mt-auto">
                  <div className="max-w-[75%]">
                    <p className="text-cyan-400/80 text-[8px] md:text-[9px] font-mono tracking-widest mb-0.5 uppercase">Elite Member</p>
                    <h2 className="text-base md:text-lg font-mono tracking-widest text-white drop-shadow-md truncate">
                      {userData?.name ? userData.name.toUpperCase() : 'VIP MEMBER'}
                    </h2>
                    <div className="flex items-center gap-4 mt-1.5 md:mt-2">
                      <div>
                        <p className="text-[7px] md:text-[8px] text-slate-400 uppercase tracking-widest mb-0.5">Valid Thru</p>
                        <p className="text-[10px] md:text-xs text-slate-300 font-mono leading-none">12/99</p>
                      </div>
                      <div>
                        <p className="text-[7px] md:text-[8px] text-slate-400 uppercase tracking-widest mb-0.5">Member Since</p>
                        <p className="text-[10px] md:text-xs text-slate-300 font-mono leading-none">
                          {userData?.createdAt ? (typeof (userData.createdAt as any).toDate === 'function' ? (userData.createdAt as any).toDate() : new Date(userData.createdAt as any)).toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' }) : '07/26'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mastercard-style circles */}
                  <div className="flex -space-x-2 md:-space-x-3 opacity-90 pb-1">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-cyan-500/60 backdrop-blur-md mix-blend-screen" />
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600/60 backdrop-blur-md mix-blend-screen" />
                  </div>
                </div>
              </div>
            ) : (
              // Standard Card Design with Progress
              <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-2 opacity-70">
                    <div className="w-10 h-10 flex items-center justify-center grayscale">
                      <img src={logoUrl} alt="Navy Sharks" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-slate-400 font-bold tracking-widest text-xs md:text-sm">NAVY SHARKS</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-800 rounded-full text-slate-400 text-[10px] uppercase tracking-widest border border-slate-700">
                    Standard
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h2 className="text-xl md:text-2xl font-mono tracking-widest text-white drop-shadow-md mb-6 truncate">
                    {userData?.name ? userData.name.toUpperCase() : 'GUEST'}
                  </h2>
                  
                  {/* Elite Progression Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] md:text-xs font-medium uppercase tracking-wider">
                      <span className="text-slate-400">Elite Progression</span>
                      <span className="text-cyan-400">
                        ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })} / $10,000
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${Math.min((totalSpent / 10000) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Spend ${Math.max(10000 - totalSpent, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} more to unlock Elite Concierge.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isElite && (
              <>
                <button
                  onClick={handleShowRFID}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-cyan-400 font-bold"
                >
                  <ScanLine className="w-5 h-5" />
                  Show VIP RFID Code
                </button>
                
                {/* Physical Card Tracker */}
                <div className="mt-4 bg-slate-900/50 border border-slate-800 rounded-xl p-5 mb-4 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[30px] pointer-events-none" />
                  
                  <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 relative z-10">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Physical Card Delivery
                  </h3>
                  
                  {(() => {
                    const status = userData?.cardStatus || 'processing';
                    const steps = [
                      { id: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
                      { id: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
                      { id: 'delivered', label: 'Delivered', icon: <PackageCheck className="w-4 h-4" /> }
                    ];
                    const currentIndex = steps.findIndex(s => s.id === status);
                    
                    return (
                      <div className="relative z-10">
                        {/* Progress Line */}
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800">
                          <div 
                            className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between relative z-10">
                          {steps.map((step, idx) => {
                            const isCompleted = idx <= currentIndex;
                            const isActive = idx === currentIndex;
                            return (
                              <div key={step.id} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                                  isCompleted ? 'bg-slate-950 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'
                                } ${isActive ? 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' : ''}`}>
                                  {step.icon}
                                </div>
                                <span className={`text-[9px] md:text-[10px] uppercase tracking-wider font-semibold ${
                                  isCompleted ? 'text-cyan-400' : 'text-slate-500'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-3 mt-6 text-center">
                          <p className="text-xs text-slate-300">
                            {status === 'processing' && "Your exclusive physical card is being crafted. Expected delivery: 1-4 weeks."}
                            {status === 'shipped' && "Your card is on the way! Watch out for the delivery."}
                            {status === 'delivered' && "Your card has been successfully delivered."}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* VIP Upgrade Tokens */}
                {userData?.upgradeTokens && userData.upgradeTokens.length > 0 && (
                  <div className="mt-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-xl p-5 mb-4 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[30px] pointer-events-none" />
                    
                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 relative z-10">
                      <Gift className="w-4 h-4 text-amber-400" />
                      Your VIP Perks & Tokens
                    </h3>
                    
                    <div className="space-y-3 relative z-10">
                      {userData.upgradeTokens.map((token, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between group">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Single-use Upgrade Token</p>
                            <p className="font-mono text-amber-400 font-bold">{token}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(token);
                              setCopiedToken(token);
                              toast.success("Token copied to clipboard!");
                              setTimeout(() => setCopiedToken(null), 2000);
                            }}
                            className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-md transition-colors"
                          >
                            {copiedToken === token ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Use these tokens at checkout when booking an experience to claim your free VIP upgrade. Each token is single-use and will automatically discount $500 from your total.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Trip Credits Wallet */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Trip Credits</h3>
                    <p className="text-slate-400 text-xs">Available Balance</p>
                  </div>
                </div>
                {tripCredits > 0 && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20 uppercase tracking-wider">
                    Ready to Claim
                  </span>
                )}
              </div>
              
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    ${tripCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs">
                    <TrendingUp className="w-3 h-3 text-cyan-500" />
                    <span>5% back from all bookings</span>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    if (!user) return;
                    try {
                      const userDocRef = doc(db, "users", user.uid);
                      const userDoc = await getDoc(userDocRef);
                      const existingPromo = userDoc.data()?.promoCode;
                      if (existingPromo) {
                        setPromoCode(existingPromo);
                      } else {
                        const prefix = userData?.name ? userData.name.substring(0, 3).toUpperCase() : 'VIP';
                        const newCode = `${prefix}-${crypto.randomUUID().substring(0, 4).toUpperCase()}`;
                        await setDoc(userDocRef, { promoCode: newCode }, { merge: true });
                        setPromoCode(newCode);
                      }
                    } catch (err) {
                      console.error("Error generating promo code:", err);
                    }
                    setShowClaimModal(true);
                  }}
                  disabled={tripCredits === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    tripCredits > 0 
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Claim
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/partners"
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all group"
              >
                <Users className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Partners</span>
              </Link>
              <Link
                to="/experiences"
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all group"
              >
                <Crown className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Experiences</span>
              </Link>
              <Link
                to="/destinations"
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all group"
              >
                <MapPin className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Destinations</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Contact</span>
              </Link>
            </div>
          </div>

          {/* Concierge Hub */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-10 h-full shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <Star className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Concierge Hub</h2>
                  <p className="text-slate-400 text-sm font-medium">Your 24/7 Lifestyle Manager</p>
                </div>
              </div>

              {isElite ? (
                <div className="flex-1 flex flex-col">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-8 flex gap-4 items-center">
                    <div className="relative">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Concierge" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/50" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Sarah Jenkins</h3>
                      <p className="text-cyan-400 text-sm">Lead VIP Concierge</p>
                      <p className="text-slate-400 text-xs mt-1">Online • Typically replies in 2 mins</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-auto">
                    <button onClick={() => setShowChatModal(true)} className="w-full flex items-center justify-between p-4 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 transition-all font-bold group shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5" />
                        <span>Start Live Chat</span>
                      </div>
                      <span className="text-xs bg-slate-950/20 px-2 py-1 rounded">Recommended</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href="https://wa.me/12345678900?text=Hi%20Navy%20Sharks%20Concierge,%20I%20need%20assistance."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-green-500/50 hover:bg-slate-800 transition-all text-slate-300 hover:text-white group"
                      >
                        <MessageCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </a>
                      
                      <a
                        href="https://t.me/navysharks_concierge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-slate-800 transition-all text-slate-300 hover:text-white group"
                      >
                        <MessageCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center w-full min-h-[320px] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl border border-slate-800 p-8 mt-auto">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 mb-6 relative">
                    <Shield className="w-8 h-8 text-slate-500" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg">
                      <Crown className="w-4 h-4 text-slate-950" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Elite Exclusive</h3>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed px-4">
                    Upgrade to Elite Membership to unlock your 24/7 personal concierge for VIP travel bookings, sold-out event access, and bespoke requests.
                  </p>
                  
                  <button
                    onClick={() => navigate('/membership?join=true')}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <span>Upgrade Now</span>
                    <span className="opacity-70 font-normal">| $49/mo or $245/yr</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Party Points Gamification Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Party Points Tier Rewards</h2>
          </div>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            
            <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
              Your annual spend unlocks extraordinary experiences. As you reach new milestones, Navy Sharks curates exclusive invitations tailored to your lifestyle.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  threshold: 10000, 
                  label: '$10k', 
                  title: 'VIP Cocktail Parties', 
                  desc: 'Access an elite realm of private VIP cocktail parties. Mingle with discerning guests in exclusive venues tailored for luxury and sophistication.',
                  color: 'cyan'
                },
                { 
                  threshold: 50000, 
                  label: '$50k', 
                  title: 'High-Network Gathering', 
                  desc: 'Step into the inner circle. Gain coveted invitations to high-network gatherings with top-tier business owners and global industry leaders.',
                  color: 'amber'
                },
                { 
                  threshold: 100000, 
                  label: '$100k', 
                  title: 'Hollywood & High Rollers', 
                  desc: 'The pinnacle of the Navy Sharks experience. Secure exclusive access to Hollywood celebrity parties, premiere events, and ultimate high roller experiences.',
                  color: 'purple'
                }
              ].map((tier, idx) => {
                const isUnlocked = totalSpent >= tier.threshold;
                const progress = Math.min((totalSpent / tier.threshold) * 100, 100);
                const remaining = tier.threshold - totalSpent;
                
                const colorClasses = {
                  cyan: { text: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]', hover: 'hover:border-cyan-500/50' },
                  amber: { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', hover: 'hover:border-amber-500/50' },
                  purple: { text: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]', hover: 'hover:border-purple-500/50' },
                }[tier.color as 'cyan'|'amber'|'purple'];

                return (
                  <div key={idx} className={`p-6 rounded-2xl border transition-all relative group flex flex-col h-full ${isUnlocked ? `bg-slate-800/60 ${colorClasses.border} ${colorClasses.shadow}` : `bg-slate-800/40 border-slate-700/50 ${colorClasses.hover}`}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="text-3xl font-black text-white mb-2">{tier.label} <span className="text-sm font-normal text-slate-400 uppercase tracking-widest">/ Year</span></div>
                      <h3 className={`font-bold mb-3 text-lg ${colorClasses.text}`}>{tier.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed flex-1">
                        {tier.desc}
                      </p>
                      
                      <div className="mt-6 pt-4 border-t border-slate-700/50">
                        {isUnlocked ? (
                          <button
                            onClick={() => setShowChatModal(true)}
                            className={`w-full py-3 rounded-xl font-bold text-slate-950 ${colorClasses.bg} hover:brightness-110 transition-all flex items-center justify-center gap-2`}
                          >
                            <Crown className="w-4 h-4" />
                            Request Invite
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white">${totalSpent.toLocaleString()} / ${tier.threshold.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                              <div 
                                className={`h-full ${colorClasses.bg} transition-all duration-1000 ease-out`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center mt-1">
                              Spend ${remaining.toLocaleString()} more to unlock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-6 h-6 text-cyan-500" />
            <h2 className="text-2xl font-bold text-white tracking-tight">My Bookings</h2>
          </div>
          
          <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[200px]">
            {loadingBookings ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-white text-lg leading-tight">{booking.bundleName}</h3>
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                        Confirmed
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-slate-400 flex justify-between">
                        <span>Date:</span>
                        <span className="text-slate-300 font-medium">
                          {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </p>
                      <p className="text-sm text-slate-400 flex justify-between">
                        <span>Amount Paid:</span>
                        <span className="text-slate-300 font-medium">
                          ${(booking.amountPaid / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500 text-center">Booking ID: {booking.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">No bookings yet</h3>
                <p className="text-slate-500 mb-6">Explore our curated destinations and exclusive experiences.</p>
                <Link
                  to="/experiences"
                  className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded-full font-medium transition-colors border border-slate-700 hover:border-cyan-500/50"
                >
                  View Experiences
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RFID Modal */}
      {showRFID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-8 relative shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setShowRFID(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
              <ScanLine className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Your RFID Pass</h3>
            <p className="text-slate-400 text-center text-sm mb-8">
              Present this code to our affiliate partners for exclusive access.
            </p>

            <div className="w-full aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {isGenerating ? (
                <>
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                  <p className="text-cyan-400 font-mono text-sm animate-pulse">GENERATING SECURE CODE...</p>
                </>
              ) : (
                <>
                  {/* Fake Barcode Lines */}
                  <div className="flex gap-1 h-20 mb-6 items-center w-full justify-center px-4">
                    {barcodeBars.map((bar, i) => (
                      <div key={i} className={`bg-white rounded-full ${bar.width} ${bar.height}`} />
                    ))}
                  </div>
                  <div className="text-3xl font-mono font-bold tracking-[0.25em] text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    {rfidCode}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Credits Modal */}
      {showClaimModal && (        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-8 relative shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <Wallet className="w-8 h-8 text-green-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Claim Credits</h3>
            <p className="text-slate-400 text-center text-sm mb-8">
              Your generated promo code for <b>${tripCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> is ready to use on your next booking.
            </p>

            <div className="w-full bg-slate-950 rounded-2xl border-2 border-dashed border-green-500/50 flex flex-col items-center justify-center p-6 relative overflow-hidden mb-6">
              <div className="text-2xl font-mono font-bold tracking-[0.25em] text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                {promoCode || "Generating..."}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none" />
            </div>
            
            <button
              onClick={async () => {
                if (promoCode) {
                  await navigator.clipboard.writeText(promoCode);
                  toast.success("Promo code copied to clipboard!");
                }
                setShowClaimModal(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* Concierge Chat Modal */}
      <ConciergeChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        userId={user.uid}
      />
    </div>
  );
}
