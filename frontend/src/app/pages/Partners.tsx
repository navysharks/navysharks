import { Hotel, Utensils, Music, Anchor, Lock, Unlock, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Partners() {
  const { userData } = useAuth();
  const isElite = userData?.membershipStatus === "Elite";
  const [activeCategory, setActiveCategory] = useState("hotels");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const categories = [
    { id: "hotels", label: "Hotels & Resorts", icon: Hotel },
    { id: "restaurants", label: "Fine Dining", icon: Utensils },
    { id: "nightclubs", label: "VIP Nightlife", icon: Music },
    { id: "marine", label: "Marine & Yachts", icon: Anchor },
  ];

  const partners = {
    hotels: [
      {
        name: "Luxury Boutique Medellín",
        location: "El Poblado, Medellín",
        image:
          "https://images.unsplash.com/photo-1738407283641-5e127f36f47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc3MjQ0ODI2MHww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Colombia",
        discount: "20% off Rack Rate",
      },
      {
        name: "Copacabana Palace Resort",
        location: "Copacabana, Rio",
        image:
          "https://images.unsplash.com/photo-1684782654017-ce022311bf74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjBwYXJ0eXxlbnwxfHx8fDE3NzI0NDgyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Brazil",
        discount: "25% off + Free Breakfast",
      },
      {
        name: "Manila Bay Premium Suites",
        location: "BGC, Manila",
        image:
          "https://images.unsplash.com/photo-1561811358-21aef14f0551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGlsaXBwaW5lcyUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3NzI0NDgyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Philippines",
        discount: "30% off Penthouse",
      },
      {
        name: "Phuket Beach Club Resort",
        location: "Patong, Phuket",
        image:
          "https://images.unsplash.com/photo-1560359614-870d1a7ea91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpbGFuZCUyMGJlYWNoJTIwcGFydHl8ZW58MXx8fHwxNzcyNDQ4MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Thailand",
        discount: "25% off Villa Stays",
      },
    ],
    restaurants: [
      {
        name: "El Cielo Gastronomic",
        location: "Zona Rosa, Bogotá",
        image:
          "https://images.unsplash.com/photo-1769773297747-bd00e31b33aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc3MjQ0MTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Colombia",
        discount: "15% off + Priority Seating",
      },
      {
        name: "Marius Degustare",
        location: "Copacabana, Rio",
        image:
          "https://images.unsplash.com/photo-1769773297747-bd00e31b33aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc3MjQ0MTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Brazil",
        discount: "20% off Total Bill",
      },
      {
        name: "Antonio's Restaurant",
        location: "Tagaytay, Philippines",
        image:
          "https://images.unsplash.com/photo-1769773297747-bd00e31b33aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc3MjQ0MTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Philippines",
        discount: "15% off Tasting Menu",
      },
      {
        name: "Nahm Bangkok",
        location: "Sathorn, Bangkok",
        image:
          "https://images.unsplash.com/photo-1769773297747-bd00e31b33aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc3MjQ0MTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Thailand",
        discount: "20% off + Free Aperitif",
      },
    ],
    nightclubs: [
      {
        name: "Envy Rooftop Lounge",
        location: "Medellín",
        image:
          "https://images.unsplash.com/photo-1770782986192-d786218838e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwbmlnaHRjbHViJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNDQ4MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Colombia",
        discount: "Skip line + VIP table",
      },
      {
        name: "Warung Beach Club",
        location: "Itaim Bibi, São Paulo",
        image:
          "https://images.unsplash.com/photo-1578760427294-9871d8667bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjB2aXAlMjBib3R0bGUlMjBzZXJ2aWNlfGVufDF8fHx8MTc3MjQ0ODI1NHww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Brazil",
        discount: "VIP Entry + Bottle Service",
      },
      {
        name: "Valkyrie Nightclub",
        location: "BGC, Manila",
        image:
          "https://images.unsplash.com/photo-1770782986192-d786218838e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwbmlnaHRjbHViJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNDQ4MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Philippines",
        discount: "Complimentary Table",
      },
      {
        name: "Levels Club Bangkok",
        location: "Sukhumvit, Bangkok",
        image:
          "https://images.unsplash.com/photo-1578760427294-9871d8667bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjB2aXAlMjBib3R0bGUlMjBzZXJ2aWNlfGVufDF8fHx8MTc3MjQ0ODI1NHww&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Thailand",
        discount: "VIP Reserved Seating",
      },
    ],
    marine: [
      {
        name: "Caribbean Yacht Charters",
        location: "Cartagena",
        image:
          "https://images.unsplash.com/photo-1768424953203-998b815c84ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMHBhcnR5JTIwd29tZW58ZW58MXx8fHwxNzcyNDQ4MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Colombia",
        discount: "20% off Charters",
      },
      {
        name: "Rio Jet Ski Adventures",
        location: "Copacabana, Rio",
        image:
          "https://images.unsplash.com/photo-1563172428-52ee6ec61b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXQlMjBza2klMjB3YXRlciUyMHNwb3J0c3xlbnwxfHx8fDE3NzI0NDgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Brazil",
        discount: "25% off Rentals",
      },
      {
        name: "Manila Bay Yacht Club",
        location: "Manila",
        image:
          "https://images.unsplash.com/photo-1768424953203-998b815c84ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMHBhcnR5JTIwd29tZW58ZW58MXx8fHwxNzcyNDQ4MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Philippines",
        discount: "30% off Sunset Cruise",
      },
      {
        name: "Phuket Luxury Charters",
        location: "Phuket",
        image:
          "https://images.unsplash.com/photo-1768424953203-998b815c84ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMHBhcnR5JTIwd29tZW58ZW58MXx8fHwxNzcyNDQ4MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        country: "Thailand",
        discount: "25% off + Captain Upgrade",
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
                      <button className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 text-sm font-bold rounded-lg transition-colors">
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
