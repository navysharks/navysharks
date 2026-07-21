import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface BookingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  bundleName: string;
}

export function BookingCalendarModal({
  isOpen,
  onClose,
  onConfirm,
  bundleName,
}: BookingCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // W9: Reset date on reopen
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setCurrentDate(new Date());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              Reserve Your Dates
            </h2>
            <p className="text-sm text-cyan-400 mt-1">{bundleName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-slate-400">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentDate.getMonth() &&
                selectedDate?.getFullYear() === currentDate.getFullYear();
              
              // Mock some dates as unavailable (e.g., past dates or randomly)
              const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(new Date().setHours(0,0,0,0));

              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => handleDateSelect(day)}
                  className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    isPast
                      ? "text-slate-600 cursor-not-allowed"
                      : isSelected
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-800/30">
          <button
            disabled={!selectedDate}
            onClick={() => selectedDate && onConfirm(selectedDate)}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              selectedDate
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.02]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {selectedDate ? "Confirm Dates & Checkout" : "Select an arrival date"}
          </button>
          <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
            Syncs seamlessly with Google Calendar
          </p>
        </div>
      </div>
    </div>
  );
}
