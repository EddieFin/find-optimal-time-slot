import { OptimizeRequest, OptimizeResponse, OptimalSlot } from "./types";

const isValidDate = (dateString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
  return regex.test(dateString);
};

export function findOptimalSlots(request: OptimizeRequest): OptimizeResponse {
  if (!request.participants || request.participants.length === 0) {
    throw new Error("Invalid input: Participants list cannot be empty.");
  }

  const slotCounts = new Map<string, string[]>();

  request.participants.forEach((p) => {
    if (!p.preferredSlots) {
      throw new Error(`Invalid input: Participant "${p.name}" has no preferredSlots.`);
    }

    const uniqueSlots = new Set(p.preferredSlots);

    uniqueSlots.forEach((slot) => {
      if (!isValidDate(slot)) {
        throw new Error(`Invalid input: Slot '${slot}' is not in ISO 8601 format (YYYY-MM-DDTHH:mm).`);
      }
      if (!slotCounts.has(slot)) {
        slotCounts.set(slot, []);
      }
      slotCounts.get(slot)!.push(p.name);
    });
  });

  if (slotCounts.size === 0) {
    throw new Error("No time slots provided by any participant.");
  }

  let maxCount = 0;
  slotCounts.forEach((attendees) => {
    if (attendees.length > maxCount) maxCount = attendees.length;
  });

  const optimalSlots: OptimalSlot[] = [];
  slotCounts.forEach((attendees, slot) => {
    if (attendees.length === maxCount) {
      optimalSlots.push({
        slot,
        participants: attendees.sort(),
      });
    }
  });

  optimalSlots.sort((a, b) => a.slot.localeCompare(b.slot));

  return {
    meetingName: request.meetingName,
    optimalSlots,
    maxParticipants: maxCount,
  };
}
