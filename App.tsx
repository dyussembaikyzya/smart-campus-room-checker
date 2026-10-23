import { useState } from "react";
import { Clock, Lock, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { canBook, type Booking } from "@/canBook";

const MINUTES_PER_HOUR = 60;

function toMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * MINUTES_PER_HOUR + m;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Fictional, hard-coded data per spec
const NOW = 540; // 09:00
const INITIAL_BOOKINGS: Booking[] = [[600, 660]]; // 10:00–11:00

function App() {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:00");
  const [blocked, setBlocked] = useState(false);
  const bookings = INITIAL_BOOKINGS;

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const result = canBook(start, end, NOW, blocked, bookings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-3">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Smart Campus Room Availability
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Check whether Room A-101 is free for your slot.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          {/* Current time banner */}
          <div className="bg-slate-800 px-5 py-3 flex items-center gap-2 text-sm text-slate-200">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Current time:{" "}
              <span className="font-semibold text-white">
                {formatTime(NOW)}
              </span>
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="start-time"
                  className="block text-xs font-medium text-slate-500 mb-1.5"
                >
                  Start time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-xs font-medium text-slate-500 mb-1.5"
                >
                  End time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Duration hint */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Duration:{" "}
                <span className="font-medium text-slate-600">
                  {end > start ? `${end - start} min` : "—"}
                </span>
              </span>
              <span>Max 120 min allowed</span>
            </div>

            {/* Blocked toggle */}
            <label className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer select-none transition hover:bg-amber-100/70">
              <input
                type="checkbox"
                checked={blocked}
                onChange={(e) => setBlocked(e.target.checked)}
                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm font-medium text-amber-800">
                  Room blocked
                </span>
              </div>
            </label>

            {/* Existing bookings */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Existing bookings
              </h2>
              <ul className="space-y-1.5">
                {bookings.length === 0 ? (
                  <li className="text-sm text-slate-400 italic py-2">
                    No existing bookings.
                  </li>
                ) : (
                  bookings.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-100"
                    >
                      <span className="text-slate-600">
                        {formatTime(b[0])} – {formatTime(b[1])}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Result */}
            <div
              className={`rounded-xl border p-4 transition ${
                result.available
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.available ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-bold text-lg leading-tight ${
                      result.available ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.available ? "Available" : "Unavailable"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4 px-4">
          This tool only checks availability. It does not create or modify any
          booking.
        </p>

        {/* Spacer so the result panel clears the floating badge on narrow screens */}
        <div className="h-16 sm:h-12" aria-hidden="true" />
      </div>
    </div>
  );
}

export default App;
