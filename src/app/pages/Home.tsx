import { Link } from "react-router";
import { Shield, MapPin, Award, Users, ChevronRight } from "lucide-react";
import videoBackground from "../../imports/small.mp4";
import thailandBackground from "../../imports/thailand-background.png";
import { homeDestinationsComingSoonBackgrounds } from "../comingSoonBackgrounds";

export function Home() {
  return (
    <div className="bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="bg-slate-950">
        {/* Title Above Video */}
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-7xl mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wider" style={{ fontFamily: "'Pompei New Bold', serif", fontWeight: 'bold', letterSpacing: '0.15em' }}>
            NAVY SHARKS
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-white">
            Elite Concierge Club
          </h2>
        </div>

        {/* Clean Video */}
        <div className="relative w-full" style={{ height: '60vh' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
        </div>

        {/* CTA Below Video */}
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover the world's best value-for-money lifestyle destinations
            with expertly researched safe zones, premium venues, and
            unparalleled experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/membership"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all text-center text-lg"
            >
              Explore Experiences
            </Link>
            <Link
              to="/destinations"
              className="px-8 py-4 border-2 border-slate-500 text-white font-semibold rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all text-center text-lg"
            >
              View Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
              About Navy Sharks
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Navy Sharks Concierge Club is your gateway to the world's most
              exciting lifestyle destinations. We specialize in finding the best
              value-for-money countries with thriving dating markets, combining
              this with meticulously researched safe zones and premium food
              hygiene standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Our Market Edge
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We don't just recommend countries—we pinpoint the best micro
                locations within macro destinations. Our team researches and
                verifies the ultimate lifestyle buzz locations, ensuring you get
                the best overall experience while saving time and money.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Through our trusted, proven direct connections with local
                providers, we make your trip as efficient as possible. Every
                venue, every experience is carefully vetted for quality, value,
                and safety.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Exclusive Partnerships
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We form strategic affiliate partnerships with the best
                value-for-money hotels, restaurants, nightclubs, and luxury
                marine experiences including boat charters, yacht parties, and
                jet ski hire.
              </p>
              <p className="text-slate-300 leading-relaxed">
                All partner venues are carefully selected and their photos and
                details are exclusively accessible to Navy Sharks members,
                ensuring an elite experience unavailable to the general public.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
              <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Safe Zones</h4>
              <p className="text-slate-400 text-sm">
                Researched and verified safe locations
              </p>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
              <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Micro Locations</h4>
              <p className="text-slate-400 text-sm">
                Best spots within prime destinations
              </p>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
              <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Premium Partners</h4>
              <p className="text-slate-400 text-sm">
                Exclusive affiliate venue access
              </p>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700">
              <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Elite Network</h4>
              <p className="text-slate-400 text-sm">
                Connect with like-minded members
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Preview */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
              Our Destinations
            </h2>
            <p className="text-xl text-slate-300">
              Four incredible countries, endless possibilities
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Thailand",
                image: thailandBackground,
                highlight: "Bangkok & Pattaya",
                comingSoon: false,
              },
              {
                name: "Philippines",
                image: homeDestinationsComingSoonBackgrounds.philippines,
                highlight: "Manila & Cebu",
                comingSoon: true,
              },
              {
                name: "Colombia",
                image: homeDestinationsComingSoonBackgrounds.colombia,
                highlight: "Cartagena & Medellín",
                comingSoon: true,
              },
              {
                name: "Brazil",
                image: homeDestinationsComingSoonBackgrounds.brazil,
                highlight: "Rio & São Paulo",
                comingSoon: true,
              },
            ].map((dest) => (
              <div
                key={dest.name}
                className="relative h-80 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent">
                  {dest.comingSoon && (
                    <div className="absolute top-6 left-0 right-0 text-center">
                      <p className="text-3xl font-bold text-cyan-400 bg-slate-950/80 inline-block px-6 py-3 rounded-lg">
                        Coming Soon
                      </p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                    <p className="text-cyan-400">{dest.highlight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Explore All Destinations
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the Elite?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get access to exclusive venues, VIP experiences, and a global
            network of sophisticated travelers.
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all text-lg"
          >
            View Membership Options
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
