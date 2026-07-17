import { useState, useEffect } from "react";
import { MapPin, Shield, Utensils } from "lucide-react";
import thailandBackground from "../../imports/thailand-background.png";
import philippinesBackground from "../../imports/philippines-background.png";
import { homeDestinationsComingSoonBackgrounds } from "../comingSoonBackgrounds";

import thailandBangkok from "../../assets/Thailand/Bangkok.jpg";
import thailandPhuket from "../../assets/Thailand/Phuket.jpg";
import thailandPattaya from "../../assets/Thailand/pattaya.jpg";

import phBoracay from "../../assets/Philippines/Boracay.jpg";
import phPalawan from "../../assets/Philippines/Palawan.jpg";
import phSiargao from "../../assets/Philippines/Siargao.jpg";

function DestinationImageCrossfade({ dest }: { dest: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!dest.images || dest.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % dest.images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [dest.images]);

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
      {dest.images ? (
        dest.images.map((img: string, idx: number) => (
          <img
            key={idx}
            src={img}
            alt={dest.country}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-105`}
          />
        ))
      ) : (
        <img
          src={dest.image}
          alt={dest.country}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>
    </div>
  );
}

export function Destinations() {
  const destinations = [
    {
      country: "Thailand",
      cities: ["Bangkok", "Phuket", "Pattaya"],
      images: [thailandBangkok, thailandPhuket, thailandPattaya],
      description:
        "Experience the perfect blend of ancient culture, modern luxury, and unbeatable value in Southeast Asia.",
      highlights: [
        "Sukhumvit Road nightlife and dining scene",
        "Luxury beach clubs and yacht charters",
        "Luxury accommodations at incredible prices",
        "World-renowned Thai cuisine and hospitality",
      ],
    },
    {
      country: "Philippines",
      cities: ["Boracay", "Siargao", "Palawan"],
      images: [phBoracay, phPalawan, phSiargao],
      description:
        "Discover tropical paradise with world-famous hospitality, pristine beaches, and incredible luxury experiences.",
      highlights: [
        "White sand beaches and luxury beachfront resorts in Boracay",
        "World-class surfing and island hopping in Siargao",
        "Breathtaking lagoons and private islands in Palawan",
        "English-speaking friendly environment and warm hospitality",
      ],
    },
    {
      country: "Colombia (Coming Soon)",
      cities: ["Medellín", "Cartagena", "Bogotá"],
      image: homeDestinationsComingSoonBackgrounds.colombia,
      description:
        "Experience the vibrant culture, stunning beaches, and exceptional value of Colombia's finest cities.",
      highlights: [
        "Trendy El Poblado & Laureles neighborhoods in Medellín",
        "Historic walled city and beach clubs in Cartagena",
        "Premium restaurants at fraction of Western prices",
        "World-class nightlife scene",
      ],
    },
    {
      country: "Brazil (Coming Soon)",
      cities: ["Rio de Janeiro", "São Paulo", "Florianópolis"],
      image: homeDestinationsComingSoonBackgrounds.brazil,
      description:
        "Immerse yourself in Brazil's legendary beaches, carnival spirit, and sophisticated urban lifestyle.",
      highlights: [
        "Iconic Copacabana and Ipanema beach scenes",
        "Elite nightclubs in Jardins, São Paulo",
        "Beach resort paradise in Floripa",
        "Exclusive yacht parties and boat tours",
      ],
    },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Premium Destinations
            </h1>
            <p className="text-xl text-slate-300">
              Four carefully selected countries offering the perfect combination
              of lifestyle, value, and safety
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {destinations.map((dest, index) => (
              <div
                key={dest.country}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <DestinationImageCrossfade dest={dest} />
                </div>

                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <h2 className="text-4xl font-bold mb-4 text-cyan-400">
                    {dest.country}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dest.cities.map((city) => (
                      <span
                        key={city}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                  <p className="text-lg text-slate-300 mb-6">
                    {dest.description}
                  </p>

                  <div className="space-y-3">
                    {dest.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        </div>
                        <p className="text-slate-300">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why These Destinations */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
            Our Selection Criteria
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Shield className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Safety First</h3>
              <p className="text-slate-300">
                Every location is thoroughly researched for safe zones, reliable
                transportation, and trusted local partnerships to ensure your
                security.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Utensils className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Food Hygiene</h3>
              <p className="text-slate-300">
                All recommended restaurants and venues meet strict hygiene
                standards. We only partner with establishments we trust.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <MapPin className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                Micro-Location Intel
              </h3>
              <p className="text-slate-300">
                We pinpoint the exact neighborhoods, streets, and venues where
                the action is—saving you time and maximizing your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Explore These Destinations?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose from curated experience packages starting from $780 per person
          </p>
          <a
            href="/membership"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            View Experience Packages
          </a>
        </div>
      </section>
    </div>
  );
}
