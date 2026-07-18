import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";
import logoUrl from "../../assets/logo.png";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setIsSignOutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logoUrl} alt="Navy Sharks Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold tracking-[0.2em] text-lg hidden sm:block drop-shadow-md">NAVY SHARKS</span>
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
              <div className="flex items-center gap-4 border-l border-slate-700 pl-8">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setIsSignOutModalOpen(true)}
                      className="px-6 py-2 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-all text-sm font-medium border border-slate-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/membership?join=true"
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all text-sm font-medium"
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </div>
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
              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2 text-cyan-400 text-center rounded-full border border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsSignOutModalOpen(true);
                      }}
                      className="block w-full py-2 text-slate-300 text-center rounded-full border border-slate-700 hover:bg-slate-800"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2 text-slate-300 text-center rounded-full border border-slate-700 hover:bg-slate-800"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/membership?join=true"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center rounded-full"
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center opacity-80">
                  <img src={logoUrl} alt="Navy Sharks Logo" className="w-full h-full object-contain grayscale" />
                </div>
                <span className="text-xl font-bold tracking-widest text-white">NAVY SHARKS</span>
              </div>
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

      {/* Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsSignOutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/10 text-red-500 font-medium border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}