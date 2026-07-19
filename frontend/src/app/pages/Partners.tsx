import { Hotel, Utensils, Music, Anchor, Lock, Unlock, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Partners() {
  const { userData } = useAuth();
  const isElite = userData?.membershipStatus === "Elite";
  const [activeCategory, setActiveCategory] = useState("marine");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const categories = [
    { id: "marine", label: "Marine", icon: Anchor },
    { id: "nightclubs", label: "VIP Nightlife", icon: Music },
    { id: "hotels", label: "Accommodation", icon: Hotel },
    { id: "restaurants", label: "Dining", icon: Utensils },
  ];

  const partners = {
    marine: [
      {
        name: "Caribbean Yacht Charters",
        location: "Cartagena, Colombia",
        image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1080",
        country: "Colombia",
        discount: "Exclusive member access",
      },
      {
        name: "Rio Jet Ski Adventures",
        location: "Copacabana, Rio",
        image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1080",
        country: "Brazil",
        discount: "Curated marine allocation",
      },
      {
        name: "Manila Bay Yacht Club",
        location: "Manila, Philippines",
        image: "https://images.unsplash.com/photo-1574041160351-46ab3469e38e?auto=format&fit=crop&q=80&w=1080",
        country: "Philippines",
        discount: "Exclusive sunset allocation",
      },
      {
        name: "Phuket Luxury Charters",
        location: "Phuket, Thailand",
        image: "https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?auto=format&fit=crop&q=80&w=1080",
        country: "Thailand",
        discount: "Curated captain allocation",
      },
    ],
    nightclubs: [
      {
        name: "Envy Rooftop Lounge",
        location: "Medellín, Colombia",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1080",
        country: "Colombia",
        discount: "Priority VIP tables",
      },
      {
        name: "Warung Beach Club",
        location: "Itaim Bibi, São Paulo",
        image: "https://images.unsplash.com/photo-1578736641330-3155e606cd40?auto=format&fit=crop&q=80&w=1080",
        country: "Brazil",
        discount: "Priority VIP entry",
      },
      {
        name: "Valkyrie Nightclub",
        location: "BGC, Manila",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1080",
        country: "Philippines",
        discount: "Exclusive member access",
      },
      {
        name: "Levels Club Bangkok",
        location: "Sukhumvit, Bangkok",
        image: "https://images.unsplash.com/photo-1557995168-98e3678ebdbd?auto=format&fit=crop&q=80&w=1080",
        country: "Thailand",
        discount: "Priority VIP tables",
      },
    ],
    hotels: [
      {
        name: "Luxury Boutique Medellín",
        location: "El Poblado, Medellín",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1080",
        country: "Colombia",
        discount: "Curated seasonal allocation",
      },
      {
        name: "Copacabana Palace Resort",
        location: "Copacabana, Rio",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1080",
        country: "Brazil",
        discount: "Exclusive member access",
      },
      {
        name: "Manila Bay Premium Suites",
        location: "BGC, Manila",
        image: "https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?auto=format&fit=crop&q=80&w=1080",
        country: "Philippines",
        discount: "Priority penthouse booking",
      },
      {
        name: "Phuket Beach Club Resort",
        location: "Patong, Phuket",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1080",
        country: "Thailand",
        discount: "Curated seasonal allocation",
      },
    ],
    restaurants: [
      {
        name: "El Cielo Gastronomic",
        location: "Zona Rosa, Bogotá",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1080",
        country: "Colombia",
        discount: "Priority VIP seating",
      },
      {
        name: "Marius Degustare",
        location: "Copacabana, Rio",
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1080",
        country: "Brazil",
        discount: "Exclusive tasting menu access",
      },
      {
        name: "Antonio's Restaurant",
        location: "Tagaytay, Philippines",
        image: "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&q=80&w=1080",
        country: "Philippines",
        discount: "Priority VIP seating",
      },
      {
        name: "Nahm Bangkok",
        location: "Sathorn, Bangkok",
        image: "https://images.unsplash.com/photo-1414235077428-338988a2e8c0?auto=format&fit=crop&q=80&w=1080",
        country: "Thailand",
        discount: "Complimentary curated aperitif",
      },
    ],
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Global Partners
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Exclusive access to hand-picked luxury venues offering exceptional value and curated experiences.
            </p>
            
            {isElite ? (
              <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 px-6 py-3 rounded-full mb-10 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Crown className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-cyan-50 font-semibold tracking-wide">
                  Elite Access Unlocked — Viewing Full Partner Directory
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-full mb-10">
                <Lock className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-semibold tracking-wide">
                  Members-Only Area — Join to unlock full access & locations
                </span>
              </div>
            )}

            {/* Country Selector */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { id: "all", label: "All Destinations" },
                { id: "Thailand", label: "Thailand" },
                { id: "Philippines", label: "Philippines" },
                { id: "Colombia", label: "Colombia" },
                { id: "Brazil", label: "Brazil" }
              ].map((country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedCountry === country.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/50"
                  }`}
                >
                  {country.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 border-y border-slate-800/50 sticky top-20 bg-slate-950/80 backdrop-blur-xl z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-cyan-500/10 border-b-2 border-cyan-500 text-cyan-400"
                      : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 min-h-[500px]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners[activeCategory as keyof typeof partners]
              .filter((partner) => selectedCountry === "all" || partner.country === selectedCountry)
              .map((partner, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all duration-500 group shadow-lg"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={partner.image}
                      alt={isElite ? partner.name : "Premium Partner"}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        !isElite ? "blur-md grayscale opacity-60" : ""
                      }`}
                    />
                    
                    {!isElite && (
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center backdrop-blur-[2px]">
                        <Lock className="w-12 h-12 text-slate-300 drop-shadow-2xl opacity-80" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                      {partner.country}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${!isElite ? 'text-slate-200' : 'text-white'}`}>
                      {isElite ? partner.name : "Premium Partner"}
                    </h3>
                    
                    <p className={`text-sm mb-5 flex items-center gap-2 ${isElite ? 'text-slate-300' : 'text-slate-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      {isElite ? partner.location : "Location hidden (Members Only)"}
                    </p>
                    
                    <div className={`border px-4 py-3 rounded-xl transition-colors ${
                      isElite 
                        ? 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30' 
                        : 'bg-slate-800/50 border-slate-700'
                    }`}>
                      <div className="flex items-start gap-3">
                        {isElite ? (
                          <Unlock className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isElite ? 'text-cyan-500' : 'text-slate-500'}`}>
                            {isElite ? 'Elite Benefit' : 'Locked Benefit'}
                          </p>
                          <p className={`text-sm font-medium ${isElite ? 'text-cyan-50' : 'text-slate-400'}`}>
                            {isElite ? partner.discount : "Sign up to view discount"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {isElite && (
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Hi Navy Sharks Concierge, I'd like to request a booking at ${partner.name} (${partner.location}). Please assist me with availability and details. Thank you!`);
                          window.open(`https://wa.me/?text=${message}`, '_blank');
                        }}
                        className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 text-sm font-bold rounded-lg transition-colors"
                      >
                        Request Booking
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              How Partner Access Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-950 font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Show Your RFID Code
                </h3>
                <p className="text-slate-300 text-sm">
                  Present your unique Navy Sharks RFID code via app or physical
                  card at any partner venue
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-950 font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Instant Verification
                </h3>
                <p className="text-slate-300 text-sm">
                  Partner scans your code and instantly verifies your active
                  membership status
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-950 font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Enjoy Benefits</h3>
                <p className="text-slate-300 text-sm">
                  Skip lines, get discounts, and receive VIP treatment reserved
                  for Navy Sharks members
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Unlock Access to All Partners
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join Navy Sharks today and start enjoying exclusive benefits at
            premium venues across all four destinations
          </p>
          <a
            href="/membership"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            Become a Member
          </a>
        </div>
      </section>
    </div>
  );
}
