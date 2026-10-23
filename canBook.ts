export type Booking = [number, number];

export interface CanBookResult {
  available: boolean;
  message: string;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Pure function that checks whether Room A-101 can be booked for the
 * given time range. Returns an Available / Unavailable result with a
 * specific reason. Does NOT create, modify, or persist any booking.
 *
 * Rules:
 *  AC1  0 <= start < end <= 1440; start must be strictly after now
 *  AC2  Duration must not exceed 120 minutes (exactly 120 is allowed)
 *  AC3  Reject when the room is blocked
 *  AC4  Reject overlap with existing bookings (endpoint-touch is allowed)
 *  AC5  Return a clear Available / Unavailable result
 *  AC6  Return a specific validation message
 */
export function canBook(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  existing: Booking[]
): CanBookResult {
  // Guard — reject non-finite or non-integer inputs (empty / invalid time fields)
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return {
      available: false,
      message: "Please enter both start and end time.",
    };
  }

  // AC3 — reject when blocked
  if (blocked) {
    return {
      available: false,
      message: "This room is currently blocked and cannot be used.",
    };
  }

  // AC1 — validate time range and ordering
  if (start < 0) {
    return { available: false, message: "Start time must be at least 00:00." };
  }
  if (end > 1440) {
    return { available: false, message: "End time must be at most 24:00." };
  }
  if (start >= end) {
    return { available: false, message: "End time must be after start time." };
  }
  if (start <= now) {
    return {
      available: false,
      message: `Start time must be after the current time (${formatTime(now)}).`,
    };
  }

  // AC2 — duration cap (exactly 120 is allowed)
  const duration = end - start;
  if (duration > 120) {
    return {
      available: false,
      message: `Maximum duration is 120 minutes (your request is ${duration} minutes).`,
    };
  }

  // AC4 — overlap check (endpoint-touch does NOT overlap)
  for (const [bStart, bEnd] of existing) {
    if (start < bEnd && end > bStart) {
      return {
        available: false,
        message: `Overlaps with existing booking ${formatTime(bStart)}–${formatTime(bEnd)}.`,
      };
    }
  }

  // AC5 / AC6 — available
  return {
    available: true,
    message: `Room A-101 is available ${formatTime(start)}–${formatTime(end)}.`,
  };
}
