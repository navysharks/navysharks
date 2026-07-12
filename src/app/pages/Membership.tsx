import {
  Check,
  Crown,
  Zap,
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
import { useState } from "react";
import { toast } from "sonner";
import { experiencesComingSoonBackgrounds } from "../comingSoonBackgrounds";

export function Membership() {
  const [showRFID, setShowRFID] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState("thailand");
  const [showCustomExperience, setShowCustomExperience] =
    useState(false);
  const [customSelections, setCustomSelections] = useState<
    Record<string, string>
  >({});

  const generateRFID = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowRFID(true);
    setIsGenerating(false);
    toast.success("RFID Code Generated!", {
      description: "Your demo RFID code is ready.",
    });
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

  const mockRFIDCode =
    "NS-" +
    Math.random().toString(36).substr(2, 9).toUpperCase();

  const destinations = {
    thailand: {
      name: "Thailand",
      location:
        "Phuket • Bangkok (Coming Soon) • Pattaya (Coming Soon)",
      comingSoon: false,
      comingSoonImage: "",
      bangkokBundles: [
        {
          name: "VIP Weekend Access",
          price: "$980",
          nights: "3 Nights",
          description: "Perfect for elevated weekend escapes",
          includes: [
            "3-night 5-star hotel stay",
            "2 VIP rooftop nightclub table reservations",
            "Bottle service credit included",
            "River club day pass",
            "Private airport transfers",
            "Dedicated concierge support",
          ],
          value: "$1,450",
          popular: false,
        },
        {
          name: "Luxe Escape Experience",
          price: "$1,290",
          nights: "4 Nights",
          description: "The complete Bangkok experience",
          includes: [
            "4-night riverfront 5-star stay",
            "Daily breakfast included",
            "$200 curated dining credit",
            "VIP rooftop nightclub access (1 evening)",
            "Private airport transfers",
            "Priority spa booking",
            "24/7 concierge WhatsApp support",
          ],
          value: "$1,950",
          popular: true,
        },
        {
          name: "River & Rooftop Elite",
          price: "$1,650",
          nights: "3 Nights",
          description:
            "Private river cruise with rooftop nightlife",
          includes: [
            "3-night premium riverfront hotel stay",
            "Half-day private river yacht (up to 8 guests)",
            "Champagne & onboard host",
            "Exclusive rooftop nightclub access",
            "Professional photography session",
            "Private transfers",
            "Concierge planning service",
          ],
          value: "$2,500",
          popular: false,
        },
      ],
      pattayaBundles: [
        {
          name: "VIP Weekend Access",
          price: "$980",
          nights: "3 Nights",
          description:
            "Perfect for elevated beach weekend escapes",
          includes: [
            "3-night beachfront 5-star hotel stay",
            "2 VIP nightclub table reservations",
            "Bottle service credit included",
            "Beach club day pass",
            "Private airport transfers",
            "Dedicated concierge support",
          ],
          value: "$1,450",
          popular: false,
        },
        {
          name: "Luxe Escape Experience",
          price: "$1,290",
          nights: "4 Nights",
          description: "The complete Pattaya beach experience",
          includes: [
            "4-night beachfront 5-star stay",
            "Daily breakfast included",
            "$200 curated dining credit",
            "VIP nightclub access (1 evening)",
            "Private airport transfers",
            "Priority spa booking",
            "24/7 concierge WhatsApp support",
          ],
          value: "$1,950",
          popular: true,
        },
        {
          name: "Yacht & Island Elite",
          price: "$1,650",
          nights: "3 Nights",
          description:
            "Private island hopping with yacht experience",
          includes: [
            "3-night premium beachfront hotel stay",
            "Half-day private yacht island tour (up to 8 guests)",
            "Champagne & onboard host",
            "Exclusive island beach club access",
            "Professional photography session",
            "Private transfers",
            "Concierge planning service",
          ],
          value: "$2,500",
          popular: false,
        },
      ],
      phuketBundles: [
        {
          name: "VIP Weekend Access",
          price: "$980",
          nights: "3 Nights",
          description:
            "Perfect for elevated island weekend escapes",
          includes: [
            "3-night beachfront 5-star hotel stay",
            "2 VIP nightclub table reservations",
            "Bottle service credit included",
            "Beach club day pass",
            "Private airport transfers",
            "Dedicated concierge support",
          ],
          value: "$1,450",
          popular: false,
        },
        {
          name: "Luxe Escape Experience",
          price: "$1,290",
          nights: "4 Nights",
          description: "The complete Phuket island experience",
          includes: [
            "4-night beachfront 5-star stay",
            "Daily breakfast included",
            "$200 curated dining credit",
            "VIP nightclub access (1 evening)",
            "Private airport transfers",
            "Priority spa booking",
            "24/7 concierge WhatsApp support",
          ],
          value: "$1,950",
          popular: true,
        },
        {
          name: "Yacht & Island Elite",
          price: "$1,650",
          nights: "3 Nights",
          description:
            "Private island hopping with yacht experience",
          includes: [
            "3-night premium beachfront hotel stay",
            "Half-day private yacht island hopping (up to 8 guests)",
            "Champagne & onboard host",
            "Exclusive island beach club access",
            "Professional photography session",
            "Private transfers",
            "Concierge planning service",
          ],
          value: "$2,500",
          popular: false,
        },
      ],
    },
    philippines: {
      name: "Philippines",
      location: "Manila • Cebu • Boracay",
      comingSoon: true,
      comingSoonImage:
        experiencesComingSoonBackgrounds.philippines,
      bundles: [
        {
          name: "Island Weekend Escape",
          price: "$850",
          nights: "3 Nights",
          description: "Tropical paradise entry experience",
          includes: [
            "3-night beachfront resort stay",
            "Island hopping tour included",
            "Beach club access",
            "Welcome drinks & dining credit",
            "Private transfers",
            "Concierge support",
          ],
          value: "$1,300",
          popular: false,
        },
        {
          name: "Manila Luxe Experience",
          price: "$1,180",
          nights: "4 Nights",
          description: "Urban luxury meets island paradise",
          includes: [
            "4-night premium BGC hotel",
            "$250 curated dining credit",
            "2 VIP nightclub reservations",
            "Day trip to hidden beach",
            "Rooftop bar access",
            "Private car service",
            "24/7 concierge support",
          ],
          value: "$1,850",
          popular: true,
        },
        {
          name: "Yacht & Beach Club Elite",
          price: "$1,450",
          nights: "3 Nights",
          description: "Private yacht & exclusive beach access",
          includes: [
            "3-night luxury resort",
            "Private yacht charter (6-8 guests)",
            "Beach club VIP cabana",
            "Sunset dinner cruise",
            "Water sports package",
            "Professional photos",
            "Full concierge service",
          ],
          value: "$2,300",
          popular: false,
        },
      ],
    },
    colombia: {
      name: "Colombia",
      location: "Medellín • Cartagena • Bogotá",
      comingSoon: true,
      comingSoonImage:
        experiencesComingSoonBackgrounds.colombia,
      bundles: [
        {
          name: "Medellín Lifestyle Weekend",
          price: "$780",
          nights: "3 Nights",
          description: "City of eternal spring experience",
          includes: [
            "3-night El Poblado boutique hotel",
            "Rooftop pool & bar access",
            "VIP nightclub entry",
            "Guided nightlife tour",
            "Private transfers",
            "Concierge support",
          ],
          value: "$1,200",
          popular: false,
        },
        {
          name: "Cartagena Luxe Escape",
          price: "$1,150",
          nights: "4 Nights",
          description: "Caribbean coast luxury experience",
          includes: [
            "4-night walled city boutique hotel",
            "$180 dining credit",
            "Beach club day pass",
            "VIP rooftop lounge access",
            "Old city walking tour",
            "Private car service",
            "24/7 concierge WhatsApp",
          ],
          value: "$1,800",
          popular: true,
        },
        {
          name: "Caribbean Yacht Experience",
          price: "$1,550",
          nights: "3 Nights",
          description: "Private yacht & colonial luxury",
          includes: [
            "3-night luxury hotel",
            "Private yacht charter (8 guests)",
            "Rosario Islands cruise",
            "Beach club access",
            "VIP nightclub reservations",
            "Professional photographer",
            "Premium concierge service",
          ],
          value: "$2,400",
          popular: false,
        },
      ],
    },
    brazil: {
      name: "Brazil",
      location: "Rio • São Paulo • Florianópolis",
      comingSoon: true,
      comingSoonImage: experiencesComingSoonBackgrounds.brazil,
      bundles: [
        {
          name: "Rio Beach & Night",
          price: "$920",
          nights: "3 Nights",
          description: "Copacabana lifestyle experience",
          includes: [
            "3-night Copacabana hotel",
            "Beach club access",
            "2 VIP nightclub entries",
            "Sunset at Ipanema tour",
            "Private transfers",
            "Concierge support",
          ],
          value: "$1,400",
          popular: false,
        },
        {
          name: "São Paulo Luxe Experience",
          price: "$1,250",
          nights: "4 Nights",
          description: "Urban sophistication meets nightlife",
          includes: [
            "4-night Jardins luxury hotel",
            "$220 fine dining credit",
            "2 VIP club reservations",
            "Rooftop pool access",
            "Art gallery tour",
            "Private car service",
            "24/7 concierge support",
          ],
          value: "$1,900",
          popular: true,
        },
        {
          name: "Beach Yacht Elite",
          price: "$1,750",
          nights: "3 Nights",
          description: "Private yacht on Brazil's coast",
          includes: [
            "3-night beachfront resort",
            "Full-day private yacht (10 guests)",
            "Island hopping expedition",
            "Beach club VIP access",
            "Caipirinha masterclass",
            "Professional photography",
            "Premium concierge",
          ],
          value: "$2,700",
          popular: false,
        },
      ],
    },
  };

  const currentDestination =
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

      {/* Destination Selector */}
      <section className="py-8 border-y border-slate-800 sticky top-24 bg-slate-950/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
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
        </div>
      </section>

      {/* Experience Bundles */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-cyan-400">
              {currentDestination.name} Experiences
            </h2>
            <p className="text-base md:text-lg text-slate-400">
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
                  ).map((bundle, index) => (
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

                        <div className="mb-3 md:mb-4">
                          <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                            Retail Value: {bundle.value}
                          </div>
                          <div className="text-3xl md:text-4xl font-bold text-white">
                            {bundle.price}
                            <span className="text-sm md:text-base text-slate-400 font-normal">
                              {" "}
                              per person
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                        {bundle.includes.map((item, idx) => (
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
                  (bundle, index) => (
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

                        <div className="mb-3 md:mb-4">
                          <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                            Retail Value: {bundle.value}
                          </div>
                          <div className="text-3xl md:text-4xl font-bold text-white">
                            {bundle.price}
                            <span className="text-sm md:text-base text-slate-400 font-normal">
                              {" "}
                              per person
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                        {bundle.includes.map((item, idx) => (
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
                      (bundle, index) => (
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

                            <div className="mb-3 md:mb-4">
                              <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                                Retail Value: {bundle.value}
                              </div>
                              <div className="text-3xl md:text-4xl font-bold text-white">
                                {bundle.price}
                                <span className="text-sm md:text-base text-slate-400 font-normal">
                                  {" "}
                                  per person
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            {bundle.includes.map(
                              (item, idx) => (
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
                      (bundle, index) => (
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

                            <div className="mb-3 md:mb-4">
                              <div className="text-xs md:text-sm text-slate-400 line-through mb-1">
                                Retail Value: {bundle.value}
                              </div>
                              <div className="text-3xl md:text-4xl font-bold text-white">
                                {bundle.price}
                                <span className="text-sm md:text-base text-slate-400 font-normal">
                                  {" "}
                                  per person
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            {bundle.includes.map(
                              (item, idx) => (
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
          </div>
        </div>
      </section>

      {/* Custom Experience Modal */}
      {showCustomExperience && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
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

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
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

              {/* Helicopter Transfer */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">
                    Helicopter Transfer
                  </h3>
                </div>
                <div className="grid md:grid-cols-1 gap-3 max-w-md">
                  <button
                    onClick={() =>
                      toggleCustomSelection(
                        "helicopter",
                        "Fixed Rate",
                        349,
                      )
                    }
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customSelections["helicopter-Fixed Rate"]
                        ? "border-cyan-500 bg-cyan-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      Fixed Rate
                    </div>
                    <div className="text-cyan-400 text-lg font-bold mt-1">
                      $349
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Transfers to selected destinations
                    </div>
                  </button>
                </div>
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
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all">
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

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$499
              </div>
              <h3 className="font-semibold mb-2">
                Yacht + Jetski Credit
              </h3>
              <p className="text-sm text-slate-400">
                Marine adventure package
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$349
              </div>
              <h3 className="font-semibold mb-2">
                Helicopter Transfer
              </h3>
              <p className="text-sm text-slate-400">
                Private airport arrival
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$199
              </div>
              <h3 className="font-semibold mb-2">
                Transport / Security Credit
              </h3>
              <p className="text-sm text-slate-400">
                Premium transfers & protection
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                +$199
              </div>
              <h3 className="font-semibold mb-2">
                Restaurant + Nightclub Credit
              </h3>
              <p className="text-sm text-slate-400">
                Dining & nightlife package
              </p>
            </div>
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
                    <div className="text-4xl font-bold text-white mb-2">
                      $490
                      <span className="text-lg text-slate-400">
                        {" "}
                        /year
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                      One-time annual fee for year-round
                      benefits
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Early access to yacht dates & limited
                          availability
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Priority VIP table allocation at all
                          partner clubs
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          5% experience credit on all bookings
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
                          Dedicated concierge hotline & WhatsApp
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Access to member-only events & parties
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Physical & digital RFID membership
                          card
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
                            2 trips @ 5% credit:
                          </span>
                          <span className="text-white">
                            ~$130 saved
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Priority yacht access:
                          </span>
                          <span className="text-white">
                            Priceless
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
                            $530+
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-950 font-bold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all">
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
                      "Generate Demo RFID Code"
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-lg border-2 border-cyan-500">
                      <p className="text-xs text-slate-400 mb-2">
                        Your Unique RFID Code:
                      </p>
                      <p className="text-2xl font-mono font-bold text-cyan-400">
                        {mockRFIDCode}
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
    </div>
  );
}