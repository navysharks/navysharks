import {
  Check,
  Crown,
  CreditCard,
  Star,
  Ship,
  Waves,
  Home,
  Music,
  UtensilsCrossed,
  Car,
  Shield,
  Plane,
  X,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { BookingCalendarModal } from "../components/BookingCalendarModal";
import { AviationMap } from "../components/AviationMap";
import { CheckoutModal } from "../components/CheckoutModal";
import { EliteMembershipModal } from "../components/EliteMembershipModal";
import { destinations } from "../data/membershipData";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState as useReactState } from "react";

export function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRFID, setShowRFID] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState("thailand");
  const [showCustomExperience, setShowCustomExperience] =
    useState(false);
  const [customSelections, setCustomSelections] = useState<
    Record<string, string>
  >({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedBundleForCalendar, setSelectedBundleForCalendar] = useState("");
  const [selectedBundlePrice, setSelectedBundlePrice] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEliteModalOpen, setIsEliteModalOpen] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "EUR" | "AUD">("USD");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showEliteMessage, setShowEliteMessage] = useState(false);
  const [aviationQty, setAviationQty] = useState(1);
  const [aviationTier, setAviationTier] = useState<"standard" | "firstclass">("standard");
  const [aviationCustomAmount, setAviationCustomAmount] = useState("");

  const handleAddonClick = (addonId: string) => {
    if (addonId === 'elite') {
      if (selectedAddons.length === 0 || (selectedAddons.length === 1 && selectedAddons[0] === 'elite')) {
        setShowEliteMessage(true);
        setTimeout(() => setShowEliteMessage(false), 4000);
        return;
      }
    }
    
    setSelectedAddons(prev => {
      const isSelected = prev.includes(addonId);
      let next = isSelected ? prev.filter(id => id !== addonId) : [...prev, addonId];
      
      if (addonId !== 'elite' && isSelected && next.length === 1 && next[0] === 'elite') {
        next = [];
      }
      
      return next;
    });
  };

  // Fetch token when checkout modal opens
  const handleOpenCalendarWithToken = async (bundleName: string, price: string) => {
    if (user) {
      const token = await user.getIdToken();
      setUserToken(token);
    }
    setSelectedBundleForCalendar(bundleName);
    setSelectedBundlePrice(price);
    setIsCalendarOpen(true);
  };

  const formatPrice = (priceStr: string) => {
    const rawPrice = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
    if (isNaN(rawPrice)) return priceStr;

    if (currency === "EUR") {
      const converted = Math.round(rawPrice * 0.92);
      return `€${converted.toLocaleString()}`;
    }
    if (currency === "AUD") {
      const converted = Math.round(rawPrice * 1.5);
      return `A$${converted.toLocaleString()}`;
    }
    return priceStr; // Default USD
  };

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
    if (sessionId && user) {
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

  const handleOpenCalendar = async (bundleName: string, price: string) => {
    if (user) {
      const token = await user.getIdToken();
      setUserToken(token);
    }
    setSelectedBundleForCalendar(bundleName);
    setSelectedBundlePrice(price);
    setIsCalendarOpen(true);
  };

  const handleCalendarConfirm = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = async (selectedAddons: string[] = []) => {
    if (!user) {
      toast.error("Please login to proceed with your booking");
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }

    setIsCheckoutOpen(false);
    toast.loading("Preparing secure checkout...", { id: "bundle-checkout" });

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://us-central1-navysharks.cloudfunctions.net/api'}/api/payment/create-bundle-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          bundleName: selectedBundleForCalendar,
          price: selectedBundlePrice,
          date: selectedDate.toISOString(),
          addons: selectedAddons,
        })
      });

      const data = await response.json();
      
      if (data.url) {
        toast.dismiss("bundle-checkout");
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      toast.error("Checkout failed", { id: "bundle-checkout", description: error.message });
      console.error(error);
    }
  };

  const [rfidCode, setRfidCode] = useReactState<string | null>(null);

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

  const toggleCustomSelection = (
    category: string,
    option: string,
    price: number,
  ) => {
    setCustomSelections((prev) => {
      const key = `${category}-${option}`;
      const newSelections = { ...prev };
      if (newSelections[key]) {
        delete newSelections[key];
      } else {
        // Remove other selections from same category
        Object.keys(newSelections).forEach((k) => {
          if (k.startsWith(category + "-")) {
            delete newSelections[k];
          }
        });
        newSelections[key] = JSON.stringify({
          category,
          option,
          price,
        });
      }
      return newSelections;
    });
  };

  const calculateTotal = () => {
    return Object.values(customSelections).reduce(
      (total, item) => {
        const parsed = JSON.parse(item);
        return total + parsed.price;
      },
      0,
    );
  };

  // RFID code is now generated and stored in Firestore via generateRFID()

  // Destinations data is imported from ../data/membershipData.ts
  // Edit pricing, bundles, and descriptions there without touching this file.

  const currentDestination: any =
    destinations[
      selectedDestination as keyof typeof destinations
    ];



  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Curated Luxury Experiences
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Stay. Sail. Celebrate — in one seamless booking
            </p>
            <p className="text-sm text-slate-400">
              No memberships required. Book the experience that
              fits your travel style.
            </p>
          </div>
        </div>
      </section>

      {/* Destination Selector & Currency Toggle */}
      <section className="py-8 border-y border-slate-800 bg-slate-950 relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {Object.keys(destinations).map((key) => {
              const dest =
                destinations[key as keyof typeof destinations];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDestination(key)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedDestination === key
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {dest.name}
                </button>
              );
            })}
          </div>

          <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800">
            {(["USD", "EUR", "AUD"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  currency === curr
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            * Exchange rates are approximate. Final charge will be in USD.
          </p>
        </div>
      </section>

      {/* Experience Bundles */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-cyan-400">
              {currentDestination.name} Experiences
            </h2>
            <p className={`text-base md:text-lg text-slate-400 ${currentDestination.comingSoon ? 'blur-[5px] opacity-40 select-none pointer-events-none' : ''}`}>
              {currentDestination.location}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {currentDestination.comingSoon ? (
              // Coming Soon State
              <div className="col-span-full relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 blur-sm pointer-events-none">
                  {(
                    currentDestination.bangkokBundles ||
                    currentDestination.bundles ||
                    []
                  ).map((bundle: any, index: number) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                        bundle.popular
                          ? "border-cyan-500"
                          : "border-slate-700"
                      }`}
                    >
                      {bundle.popular && (
                        <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                          <Star
                            className="w-3 h-3 md:w-4 md:h-4"
                            fill="currentColor"
                          />
                          MOST POPULAR
                        </div>
                      )}

                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>

                      <div className="mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                          {bundle.name}
                        </h3>
                        <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                          {bundle.nights}
                        </p>
                        <p className="text-slate-300 text-sm mb-3 md:mb-4">
                          {bundle.description}
                        </p>
                        {index === 1 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                            🇬🇧 Popular among UK travelers
                          </div>
                        )}


                        <div className="mb-3 md:mb-4">
                          <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                            Retail Value: {formatPrice(bundle.value)}
                          </div>
                          <div className="text-3xl md:text-4xl font-bold text-white">
                            {formatPrice(bundle.price)}
                            <span className="text-sm md:text-base text-slate-400 font-normal">
                              {" "}
                              per person
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                        {bundle.includes.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 md:gap-3"
                          >
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                        className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                          bundle.popular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}
                      >
                        Reserve Your Dates
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl mx-auto">
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                      <img
                        src={currentDestination.comingSoonImage}
                        alt={`${currentDestination.name} Coming Soon`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60 flex items-center justify-center">
                        <div className="text-center px-4">
                          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            COMING SOON
                          </h3>
                          <p className="text-xl md:text-2xl text-slate-300 mb-2">
                            {currentDestination.name}
                          </p>
                          <p className="text-base md:text-lg text-slate-400">
                            Exciting experiences launching soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Available Packages
              <>
                {currentDestination.name === "Philippines" && (
                  <>
                    {/* Boracay Packages */}
                    <div className="col-span-full mb-4 md:mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                        Boracay
                      </h3>
                    </div>
                    <div className="col-span-full mb-4 md:mb-8">
                      <button
                        onClick={() => setShowCustomExperience(true)}
                        className="w-full py-3 md:py-4 bg-slate-900/50 border-2 border-yellow-500 text-yellow-500 font-bold text-base md:text-lg rounded-full hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-lg md:text-xl">✨</span>
                        CREATE MY OWN EXPERIENCE
                      </button>
                    </div>
                    {currentDestination.boracayBundles?.map((bundle: any, index: number) => (
                      <div
                        key={`boracay-${index}`}
                        className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                          bundle.popular ? "border-cyan-500" : "border-slate-700"
                        }`}
                      >
                        {bundle.popular && (
                          <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                            <Star className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            MOST POPULAR
                          </div>
                        )}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="mb-4 md:mb-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                            {bundle.name}
                          </h3>
                          <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                            {bundle.nights}
                          </p>
                          <p className="text-slate-300 text-sm mb-3 md:mb-4">
                            {bundle.description}
                          </p>
                        {index === 1 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                            🇬🇧 Popular among UK travelers
                          </div>
                        )}
                          <div className="mb-3 md:mb-4">
                            <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                              Retail Value: {formatPrice(bundle.value)}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                              {formatPrice(bundle.price)}
                              <span className="text-sm md:text-base text-slate-400 font-normal">
                                {" "}
                                per person
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                          {bundle.includes.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 md:gap-3">
                              <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                          className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                          bundle.popular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}>
                          Reserve Your Dates
                        </button>
                      </div>
                    ))}

                    {/* Siargao Packages */}
                    <div className="col-span-full mb-4 md:mb-8 mt-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                        Siargao
                      </h3>
                    </div>
                    <div className="col-span-full mb-4 md:mb-8">
                      <button
                        onClick={() => setShowCustomExperience(true)}
                        className="w-full py-3 md:py-4 bg-slate-900/50 border-2 border-yellow-500 text-yellow-500 font-bold text-base md:text-lg rounded-full hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-lg md:text-xl">✨</span>
                        CREATE MY OWN EXPERIENCE
                      </button>
                    </div>
                    {currentDestination.siargaoBundles?.map((bundle: any, index: number) => (
                      <div
                        key={`siargao-${index}`}
                        className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                          bundle.popular ? "border-cyan-500" : "border-slate-700"
                        }`}
                      >
                        {bundle.popular && (
                          <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                            <Star className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            MOST POPULAR
                          </div>
                        )}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="mb-4 md:mb-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                            {bundle.name}
                          </h3>
                          <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                            {bundle.nights}
                          </p>
                          <p className="text-slate-300 text-sm mb-3 md:mb-4">
                            {bundle.description}
                          </p>
                        {index === 1 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                            🇬🇧 Popular among UK travelers
                          </div>
                        )}
                          <div className="mb-3 md:mb-4">
                            <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                              Retail Value: {formatPrice(bundle.value)}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                              {formatPrice(bundle.price)}
                              <span className="text-sm md:text-base text-slate-400 font-normal">
                                {" "}
                                per person
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                          {bundle.includes.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 md:gap-3">
                              <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                          className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                          bundle.popular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}>
                          Reserve Your Dates
                        </button>
                      </div>
                    ))}

                    {/* Palawan Packages */}
                    <div className="col-span-full mb-4 md:mb-8 mt-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                        Palawan
                      </h3>
                    </div>
                    <div className="col-span-full mb-4 md:mb-8">
                      <button
                        onClick={() => setShowCustomExperience(true)}
                        className="w-full py-3 md:py-4 bg-slate-900/50 border-2 border-yellow-500 text-yellow-500 font-bold text-base md:text-lg rounded-full hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-lg md:text-xl">✨</span>
                        CREATE MY OWN EXPERIENCE
                      </button>
                    </div>
                    {currentDestination.palawanBundles?.map((bundle: any, index: number) => (
                      <div
                        key={`palawan-${index}`}
                        className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                          bundle.popular ? "border-cyan-500" : "border-slate-700"
                        }`}
                      >
                        {bundle.popular && (
                          <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                            <Star className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            MOST POPULAR
                          </div>
                        )}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="mb-4 md:mb-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                            {bundle.name}
                          </h3>
                          <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                            {bundle.nights}
                          </p>
                          <p className="text-slate-300 text-sm mb-3 md:mb-4">
                            {bundle.description}
                          </p>
                        {index === 1 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                            🇬🇧 Popular among UK travelers
                          </div>
                        )}
                          <div className="mb-3 md:mb-4">
                            <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                              Retail Value: {formatPrice(bundle.value)}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                              {formatPrice(bundle.price)}
                              <span className="text-sm md:text-base text-slate-400 font-normal">
                                {" "}
                                per person
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                          {bundle.includes.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 md:gap-3">
                              <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                          className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                          bundle.popular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}>
                          Reserve Your Dates
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {currentDestination.name === "Thailand" && (
                  <>
                    {/* Phuket Packages */}
                <div className="col-span-full mb-4 md:mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                    Phuket
                  </h3>
                </div>

                {/* Create My Own Experience Button */}
                <div className="col-span-full mb-4 md:mb-8">
                  <button
                    onClick={() =>
                      setShowCustomExperience(true)
                    }
                    className="w-full py-3 md:py-4 bg-slate-900/50 border-2 border-yellow-500 text-yellow-500 font-bold text-base md:text-lg rounded-full hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-lg md:text-xl">
                      ✨
                    </span>
                    CREATE MY OWN EXPERIENCE
                  </button>
                </div>

                {currentDestination.phuketBundles.map(
                  (bundle: any, index: number) => (
                    <div
                      key={`phuket-${index}`}
                      className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                        bundle.popular
                          ? "border-cyan-500"
                          : "border-slate-700"
                      }`}
                    >
                      {bundle.popular && (
                        <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                          <Star
                            className="w-3 h-3 md:w-4 md:h-4"
                            fill="currentColor"
                          />
                          MOST POPULAR
                        </div>
                      )}

                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>

                      <div className="mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                          {bundle.name}
                        </h3>
                        <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                          {bundle.nights}
                        </p>
                        <p className="text-slate-300 text-sm mb-3 md:mb-4">
                          {bundle.description}
                        </p>
                        {index === 1 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                            🇬🇧 Popular among UK travelers
                          </div>
                        )}


                        <div className="mb-3 md:mb-4">
                          <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                            Retail Value: {formatPrice(bundle.value)}
                          </div>
                          <div className="text-3xl md:text-4xl font-bold text-white">
                            {formatPrice(bundle.price)}
                            <span className="text-sm md:text-base text-slate-400 font-normal">
                              {" "}
                              per person
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                        {bundle.includes.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 md:gap-3"
                          >
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                        className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                          bundle.popular
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}
                      >
                        Reserve Your Dates
                      </button>
                    </div>
                  ),
                )}

                {/* Bangkok Packages - Coming Soon */}
                <div className="col-span-full mb-4 md:mb-8 mt-8 md:mt-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                    Bangkok
                  </h3>
                </div>
                <div className="col-span-full relative min-h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 blur-sm pointer-events-none">
                    {currentDestination.bangkokBundles.map(
                      (bundle: any, index: number) => (
                        <div
                          key={`bangkok-${index}`}
                          className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                            bundle.popular
                              ? "border-cyan-500"
                              : "border-slate-700"
                          }`}
                        >
                          {bundle.popular && (
                            <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                              <Star
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="currentColor"
                              />
                              MOST POPULAR
                            </div>
                          )}

                          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>

                          <div className="mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                              {bundle.name}
                            </h3>
                            <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                              {bundle.nights}
                            </p>
                            <p className="text-slate-300 text-sm mb-3 md:mb-4">
                              {bundle.description}
                            </p>
                            {index === 1 && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                                🇬🇧 Popular among UK travelers
                              </div>
                            )}

                            <div className="mb-3 md:mb-4">
                              <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                                Retail Value: {formatPrice(bundle.value)}
                              </div>
                              <div className="text-3xl md:text-4xl font-bold text-white">
                                {formatPrice(bundle.price)}
                                <span className="text-sm md:text-base text-slate-400 font-normal">
                                  {" "}
                                  per person
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            {bundle.includes.map(
                              (item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 md:gap-3"
                                >
                                  <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                    {item}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                            className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                              bundle.popular
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                                : "bg-slate-700 text-white hover:bg-slate-600"
                            }`}
                          >
                            Reserve Your Dates
                          </button>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Coming Soon Overlay for Bangkok */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl mx-auto">
                      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1697082390865-dbd02b4a74c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMHJpdmVyJTIwQ29sb21iaWElMjBjaXR5c2NhcGV8ZW58MXx8fHwxNzc2MzQ0OTk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Bangkok Coming Soon"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60 flex items-center justify-center">
                          <div className="text-center px-4">
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                              COMING SOON
                            </h3>
                            <p className="text-xl md:text-2xl text-slate-300 mb-2">
                              Bangkok
                            </p>
                            <p className="text-base md:text-lg text-slate-400">
                              Exciting river & rooftop
                              experiences launching soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattaya Packages - Coming Soon */}
                <div className="col-span-full mb-4 md:mb-8 mt-8 md:mt-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 md:mb-6">
                    Pattaya
                  </h3>
                </div>
                <div className="col-span-full relative min-h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 blur-sm pointer-events-none">
                    {currentDestination.pattayaBundles.map(
                      (bundle: any, index: number) => (
                        <div
                          key={`pattaya-${index}`}
                          className={`bg-gradient-to-b from-slate-800 to-slate-900 p-6 md:p-8 rounded-2xl border-2 relative overflow-hidden min-h-[320px] ${
                            bundle.popular
                              ? "border-cyan-500"
                              : "border-slate-700"
                          }`}
                        >
                          {bundle.popular && (
                            <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm rounded-bl-xl flex items-center gap-1 md:gap-2">
                              <Star
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="currentColor"
                              />
                              MOST POPULAR
                            </div>
                          )}

                          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>

                          <div className="mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                              {bundle.name}
                            </h3>
                            <p className="text-sm text-cyan-400 mb-2 md:mb-3">
                              {bundle.nights}
                            </p>
                            <p className="text-slate-300 text-sm mb-3 md:mb-4">
                              {bundle.description}
                            </p>
                            {index === 1 && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
                                🇬🇧 Popular among UK travelers
                              </div>
                            )}

                            <div className="mb-3 md:mb-4">
                              <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                                Retail Value: {formatPrice(bundle.value)}
                              </div>
                              <div className="text-3xl md:text-4xl font-bold text-white">
                                {formatPrice(bundle.price)}
                                <span className="text-sm md:text-base text-slate-400 font-normal">
                                  {" "}
                                  per person
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            {bundle.includes.map(
                              (item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 md:gap-3"
                                >
                                  <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                    {item}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenCalendar(bundle.name, bundle.price)}
                            className={`w-full py-3 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all ${
                              bundle.popular
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                                : "bg-slate-700 text-white hover:bg-slate-600"
                            }`}
                          >
                            Reserve Your Dates
                          </button>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Coming Soon Overlay for Pattaya */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl mx-auto">
                      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1560359614-870d1a7ea91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpbGFuZCUyMGJlYWNoJTIwcGFydHl8ZW58MXx8fHwxNzcyNDQ4MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Pattaya Coming Soon"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60 flex items-center justify-center">
                          <div className="text-center px-4">
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                              COMING SOON
                            </h3>
                            <p className="text-xl md:text-2xl text-slate-300 mb-2">
                              Pattaya
                            </p>
                            <p className="text-base md:text-lg text-slate-400">
                              Exciting beach & island
                              experiences launching soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Custom Experience Modal */}
      {showCustomExperience && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-900 rounded-2xl max-w-7xl w-full my-4 relative max-h-[95vh] flex flex-col">
            <div className="bg-slate-900 border-b border-slate-700 p-4 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-cyan-400">
                  Create Your Custom Experience
                </h2>
                <button
                  onClick={() => setShowCustomExperience(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={28} />
                </button>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Select your preferred options to build your
                perfect Phuket experience
              </p>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Yacht Hire */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Ship className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Yacht Hire
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { name: "Half Day", price: 399 },
                    { name: "Full Day", price: 649 },
                    {
                      name: "Premium Yacht Experience",
                      price: 999,
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "yacht",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[`yacht-${option.name}`]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Jet Ski Hire */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Waves className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Jet Ski Hire
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { name: "Half Day", price: 149 },
                    { name: "Full Day", price: 249 },
                    {
                      name: "Supercharged Jet Ski (Full Day Only)",
                      price: 299,
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "jetski",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `jetski-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Accommodation
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Private Pool Villa (3+ guests)",
                      price: 499,
                      per: "/ night",
                    },
                    {
                      name: "Luxury Sea View Room (Max 2 guests)",
                      price: 199,
                      per: "/ night",
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "accommodation",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `accommodation-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}{" "}
                        <span className="text-sm text-slate-400">
                          {option.per}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nightlife Packages */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Nightlife Packages
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Club Credit",
                      price: 99,
                      desc: "drinks & shots at reduced prices",
                    },
                    {
                      name: "Standard Bottle Service",
                      price: 249,
                      desc: null,
                    },
                    {
                      name: "VIP Premium Package",
                      price: 349,
                      desc: "Top bourbon, premium liquors, vodka, private booth",
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "nightlife",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `nightlife-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                      {option.desc && (
                        <div className="text-xs text-slate-400 mt-1">
                          {option.desc}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dining Experiences */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Dining Experiences
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: "Restaurant Credit", price: 149 },
                    {
                      name: "Premium Dining Credit",
                      price: 299,
                      desc: "Top-rated & Michelin-star venues",
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "dining",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `dining-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                      {option.desc && (
                        <div className="text-xs text-slate-400 mt-1">
                          {option.desc}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Services */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Transport Services
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Short-Term Transport Credit",
                      price: 199,
                    },
                    {
                      name: "Long-Term Transport Credit",
                      price: 499,
                      desc: "Personal chauffeur, airport transfers, luxury car hire",
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "transport",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `transport-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                      {option.desc && (
                        <div className="text-xs text-slate-400 mt-1">
                          {option.desc}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Security */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Personal Security
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Half Day (6 hours)",
                      price: 199,
                      desc: "Shopping, tours, excursions",
                    },
                    {
                      name: "Full Day (12 hours)",
                      price: 299,
                      desc: "Nightlife and event coverage",
                    },
                    {
                      name: "Elite Protection (12 hours)",
                      price: 399,
                      desc: "MMA/military trained, armed option available",
                    },
                  ].map((option) => (
                    <button
                      key={option.name}
                      onClick={() =>
                        toggleCustomSelection(
                          "security",
                          option.name,
                          option.price,
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customSelections[
                          `security-${option.name}`
                        ]
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.name}
                      </div>
                      <div className="text-cyan-400 text-lg font-bold mt-1">
                        ${option.price}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aviation Credit Maps */}
              <div className="mt-8 mb-4">
                <AviationMap 
                  selectedRouteId={
                    Object.keys(customSelections).find(k => k.startsWith("aviation-"))?.replace("aviation-", "")
                  }
                  onSelectRoute={(route) => {
                    toggleCustomSelection("aviation", route.id, route.price);
                  }}
                />
              </div>
            </div>

            {/* Sticky Footer with Total */}
            <div className="bg-slate-900 border-t border-slate-700 p-4 rounded-b-2xl flex-shrink-0">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm text-slate-400">
                    Total Experience Cost
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">
                    ${calculateTotal()}
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenCalendar("Custom Experience", "")}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all">
                  Book My Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Options */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">
              Enhance Your Experience
            </h2>
            <p className="text-lg text-slate-300">
              Add premium upgrades at checkout for an
              unforgettable trip
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto mb-8">
            <div className="relative group">
              <div 
                onClick={() => handleAddonClick('elite')}
                className={`bg-slate-800 p-6 rounded-xl border text-center relative overflow-hidden group cursor-pointer transition-all ${
                  selectedAddons.includes('elite') ? 'border-amber-400 bg-slate-800/80 ring-2 ring-amber-400/50' : 'border-amber-500/50 hover:border-amber-400'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-2xl font-bold text-amber-400 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                  FREE
                </div>
                <h3 className="font-semibold text-amber-50 mb-2">
                  Elite Concierge Chat
                </h3>
                <p className="text-sm text-amber-200/70">
                  24/7 dedicated chat for 24 hours
                </p>
              </div>
              {showEliteMessage && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-red-900/90 text-red-100 text-xs p-2 rounded border border-red-500/50 text-center z-20 shadow-lg animate-in fade-in slide-in-from-top-2">
                  Please select at least one credit first to unlock your FREE 24-hour Elite Concierge Chat.
                </div>
              )}
            </div>

            <div 
              onClick={() => handleAddonClick('marine')}
              className={`bg-slate-800 p-6 rounded-xl border text-center cursor-pointer transition-all ${
                selectedAddons.includes('marine') ? 'border-cyan-400 bg-slate-700/80 ring-2 ring-cyan-400/50' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$499
              </div>
              <h3 className="font-semibold mb-2">
                Marine Credit
              </h3>
              <p className="text-sm text-slate-400">
                Yacht + Jetski
              </p>
            </div>

            <div 
              onClick={() => {
                if (!selectedAddons.includes('aviation')) handleAddonClick('aviation');
              }}
              className={`bg-slate-800 p-6 rounded-xl border text-center transition-all ${
                selectedAddons.includes('aviation') ? 'border-cyan-400 bg-slate-700/80 ring-2 ring-cyan-400/50 cursor-default col-span-1 sm:col-span-2 lg:col-span-2' : 'border-slate-700 hover:border-slate-500 cursor-pointer'
              }`}
            >
              {!selectedAddons.includes('aviation') ? (
                <>
                  <div className="text-2xl font-bold text-cyan-400 mb-2">
                    +$349
                  </div>
                  <h3 className="font-semibold mb-2">
                    Aviation Credit
                  </h3>
                  <p className="text-sm text-slate-400">
                    Helicopters + jets <br />
                    Helicopter transfers starting from 349*
                  </p>
                </>
              ) : (
                <div className="text-left animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-2">
                    <h3 className="font-semibold text-lg text-cyan-400">Aviation Credit</h3>
                    <button onClick={(e) => { e.stopPropagation(); handleAddonClick('aviation'); }} className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-1 border border-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${aviationTier === 'standard' ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 bg-slate-800 hover:border-slate-400'}`}>
                        <input type="radio" name="aviationTier" className="accent-cyan-400" checked={aviationTier === 'standard'} onChange={() => setAviationTier('standard')} />
                        <span className="text-sm font-medium">Standard Credit ($349*)</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${aviationTier === 'firstclass' ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 bg-slate-800 hover:border-slate-400'}`}>
                        <input type="radio" name="aviationTier" className="accent-cyan-400" checked={aviationTier === 'firstclass'} onChange={() => setAviationTier('firstclass')} />
                        <span className="text-sm font-medium">First Class Flyer Credit ($999*)</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Or insert custom credit amount:</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input 
                          type="number" 
                          value={aviationCustomAmount} 
                          onChange={e => setAviationCustomAmount(e.target.value)} 
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 pl-7 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all" 
                          placeholder="Amount" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <span className="text-sm text-slate-300 font-medium">Quantity</span>
                      <div className="flex items-center gap-3 bg-slate-900 rounded-lg border border-slate-600 p-1">
                        <button onClick={() => setAviationQty(Math.max(1, aviationQty - 1))} className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 transition-colors">-</button>
                        <span className="text-sm w-4 text-center font-bold">{aviationQty}</span>
                        <button onClick={() => setAviationQty(aviationQty + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 transition-colors">+</button>
                      </div>
                    </div>

                    <p className="text-xs text-cyan-300 bg-cyan-900/30 p-2.5 rounded-lg border border-cyan-500/30 text-center leading-relaxed">
                      All bought credit can be used for all aviation services
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div 
              onClick={() => handleAddonClick('accommodation')}
              className={`bg-slate-800 p-6 rounded-xl border text-center cursor-pointer transition-all ${
                selectedAddons.includes('accommodation') ? 'border-cyan-400 bg-slate-700/80 ring-2 ring-cyan-400/50' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$249
              </div>
              <h3 className="font-semibold mb-2">
                Accommodation Credit
              </h3>
              <p className="text-sm text-slate-400">
                Premium stays & upgrades
              </p>
            </div>

            <div 
              onClick={() => handleAddonClick('club')}
              className={`bg-slate-800 p-6 rounded-xl border text-center cursor-pointer transition-all ${
                selectedAddons.includes('club') ? 'border-cyan-400 bg-slate-700/80 ring-2 ring-cyan-400/50' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$199
              </div>
              <h3 className="font-semibold mb-2">
                Club Credit
              </h3>
              <p className="text-sm text-slate-400">
                Dining, nightlife, & security
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => handleOpenCalendar("Custom Quote / Enhanced Experience", "")}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]">
              Request a Custom Quote
            </button>
          </div>
        </div>
      </section>

      {/* Annual Membership */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-10 rounded-2xl border-2 border-yellow-500/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-10 h-10 text-yellow-500" />
                  <div>
                    <h2 className="text-3xl font-bold text-yellow-500">
                      Elite Membership
                    </h2>
                    <p className="text-slate-400">
                      Unlock exclusive benefits across all
                      destinations
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-4xl font-bold text-white">
                        $245
                        <span className="text-lg text-slate-400">
                          {" "}
                          /year
                        </span>
                      </div>
                      <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        HALF PRICE
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      One-time annual fee for year-round benefits
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg mb-6">
                      <p className="text-yellow-500 font-bold text-sm">
                        $245 Welcome Credit
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Expires in 12 months. Minimum 5 transactions in separate bookings.
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
                          Dedicated concierge HOTLINE & WHATSAPP GROUP AND TELEGRAM GROUP ACCESS
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Access to member-only events & parties (<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 animate-pulse" style={{ textShadow: "0 0 10px rgba(34, 211, 238, 0.4)" }}>Meet Hollywood celebrities</span> and network with the world's highest net worth/network individuals)
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Physical & digital QR CODE membership card
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
                Secure, unique membership verification for
                seamless partner access
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
                    <h4 className="font-semibold mb-2">
                      Instant Generation
                    </h4>
                    <p className="text-slate-300">
                      Upon signup, a unique RFID code is
                      automatically generated for your
                      account—no duplicates, no screenshots
                      accepted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      ID Verification
                    </h4>
                    <p className="text-slate-300">
                      Upload your government ID (driver's
                      license or passport) and matching bank
                      card for verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Direct Access
                    </h4>
                    <p className="text-slate-300">
                      Use your RFID code directly at affiliate
                      locations via the website or app—verified
                      in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Physical Card
                    </h4>
                    <p className="text-slate-300">
                      Receive your physical RFID card shipped to
                      your address for ultimate convenience and
                      status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30">
                <h4 className="font-semibold mb-4 text-cyan-400">
                  Demo: RFID Code Generator
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  This is a demonstration of how your unique
                  code will be generated upon membership
                  registration.
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
                      ✓ This code is unique and cannot be
                      duplicated
                      <br />✓ Verified against your government
                      ID and payment card
                      <br />✓ Works at all Navy Sharks affiliate
                      locations
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
                  VIP monthly memberships can be canceled
                  anytime. Annual plans are non-refundable but
                  you retain access for the full year.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  How long does RFID card shipping take?
                </h3>
                <p className="text-slate-300">
                  Physical RFID cards are shipped within 3-5
                  business days. You can use your digital code
                  immediately while waiting.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  Which countries are included?
                </h3>
                <p className="text-slate-300">
                  All memberships include access to our
                  affiliate partners in Colombia, Brazil,
                  Philippines, and Thailand.
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-lg mb-2">
                  What's included in the Elite parties?
                </h3>
                <p className="text-slate-300">
                  Monthly Elite parties are exclusive events at
                  premium venues with open bar, VIP tables, and
                  curated guest lists. Locations rotate between
                  our four destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar Modal */}
      <BookingCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={handleCalendarConfirm}
        bundleName={selectedBundleForCalendar}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleCheckoutComplete}
        selectedDate={selectedDate}
        bundleName={selectedBundleForCalendar}
        bundlePrice={selectedBundlePrice}
        userToken={userToken}
      />

      {/* Elite Membership Modal */}
      <EliteMembershipModal
        isOpen={isEliteModalOpen}
        onClose={() => setIsEliteModalOpen(false)}
        onComplete={handleEliteCheckoutComplete}
      />
    </div>
  );
}
