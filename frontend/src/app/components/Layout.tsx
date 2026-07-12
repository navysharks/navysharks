import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "figma:asset/07af61dd9bcec36f8143b071d775139b06bfec77.png";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/destinations", label: "Destinations" },
    { path: "/membership", label: "Experiences" },
    { path: "/partners", label: "Partners" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Navy Sharks" className="h-24 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/membership"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                Join Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium py-2 ${
                    isActive(link.path) ? "text-cyan-400" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center rounded-full"
              >
                Join Now
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src={logo} alt="Navy Sharks" className="h-16 w-auto mb-4" />
              <p className="text-slate-400 text-sm">
                Elite concierge club for sophisticated travelers seeking
                exceptional value and experiences.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-slate-400 text-sm hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Destinations</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>Thailand</p>
                <p>Philippines</p>
                <p>Colombia</p>
                <p>Brazil</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>support@navysharks.com</p>
                <p>+1 (555) 123-4567</p>
                <p className="pt-4 text-xs">
                  © 2026 Navy Sharks Concierge Club. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}