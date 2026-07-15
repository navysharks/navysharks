import { useState } from "react";
import { X, User, Mail, Phone, MessageCircle } from "lucide-react";

interface PriveMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function PriveMembershipModal({
  isOpen,
  onClose,
  onComplete,
}: PriveMembershipModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(); // Triggers the Stripe checkout redirect in the parent
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 pb-10">
      <div className="bg-slate-900 rounded-2xl w-full max-w-xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h2 className="text-xl font-bold text-purple-400">Privé Membership</h2>
            <p className="text-sm text-slate-400 mt-1">
              $490/year • Complete your profile to proceed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">First Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Last Name *</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">WhatsApp Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <p className="text-xs text-slate-500">Required for Privé Concierge access.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Telegram (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageCircle className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6">
              <button
                type="submit"
                className="w-full py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                Continue to Payment ($490/year)
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Secure checkout powered by Stripe. You can cancel your subscription at any time.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
