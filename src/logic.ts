import { OptimizeRequest, OptimizeResponse, OptimalSlot } from "./types";

export function findOptimalSlots(request: OptimizeRequest): OptimizeResponse {
  if (!request.participants || request.participants.length === 0) {
    throw new Error("Invalid input: Participants list cannot be empty.");
  }

  const slotCounts = new Map<string, string[]>();

  // Count votes (ensure 1 vote per person per slot)
  request.participants.forEach((p) => {
    if (!p.preferredSlots) return;
    const uniqueSlots = new Set(p.preferredSlots);

    uniqueSlots.forEach((slot) => {
      if (!slotCounts.has(slot)) {
        slotCounts.set(slot, []);
      }
      slotCounts.get(slot)?.push(p.name);
    });
  });

  if (slotCounts.size === 0) {
    throw new Error("No time slots provided by any participant.");
  }

  // Find max participation
  let maxCount = 0;
  slotCounts.forEach((attendees) => {
    if (attendees.length > maxCount) maxCount = attendees.length;
  });

  if (maxCount === 0) throw new Error("No matches found.");

  // Collect winning slots
  const optimalSlots: OptimalSlot[] = [];
  slotCounts.forEach((attendees, slot) => {
    if (attendees.length === maxCount) {
      optimalSlots.push({
        slot,
        participants: attendees.sort(),
      });
    }
  });

  // Sort by date/time
  optimalSlots.sort((a, b) => a.slot.localeCompare(b.slot));

  return {
    meetingName: request.meetingName,
    optimalSlots,
    maxParticipants: maxCount,
  };
}
