import { findOptimalSlots } from "./logic";
import { OptimizeRequest } from "./types";

describe("Business Logic: findOptimalSlots", () => {
  it("should identify a single optimal slot", () => {
    const request: OptimizeRequest = {
      meetingName: "Clear Winner",
      participants: [
        { name: "A", preferredSlots: ["2025-01-01T10:00"] },
        { name: "B", preferredSlots: ["2025-01-01T10:00"] },
        { name: "C", preferredSlots: ["2025-01-01T12:00"] },
      ],
    };
    const result = findOptimalSlots(request);
    expect(result.optimalSlots).toHaveLength(1);
    expect(result.optimalSlots[0].slot).toBe("2025-01-01T10:00");
    expect(result.maxParticipants).toBe(2);
  });

  it("should return multiple slots if there is a tie", () => {
    const request: OptimizeRequest = {
      meetingName: "Tie Game",
      participants: [
        { name: "A", preferredSlots: ["2025-01-01T10:00", "2025-01-01T12:00"] },
        { name: "B", preferredSlots: ["2025-01-01T10:00", "2025-01-01T12:00"] },
      ],
    };
    const result = findOptimalSlots(request);
    expect(result.optimalSlots).toHaveLength(2);
    expect(result.maxParticipants).toBe(2);
    expect(result.optimalSlots[0].slot).toBe("2025-01-01T10:00");
    expect(result.optimalSlots[1].slot).toBe("2025-01-01T12:00");
  });

  it("should handle scenarios with zero overlap (maxParticipants = 1)", () => {
    const request: OptimizeRequest = {
      meetingName: "No Overlap",
      participants: [
        { name: "A", preferredSlots: ["2025-01-01T09:00"] },
        { name: "B", preferredSlots: ["2025-01-01T10:00"] },
      ],
    };
    const result = findOptimalSlots(request);
    expect(result.maxParticipants).toBe(1);
    expect(result.optimalSlots).toHaveLength(2);
  });

  it("should ignore duplicate votes from the same person", () => {
    const request: OptimizeRequest = {
      meetingName: "Double Voter",
      participants: [{ name: "A", preferredSlots: ["2025-01-01T10:00", "2025-01-01T10:00"] }],
    };
    const result = findOptimalSlots(request);
    expect(result.maxParticipants).toBe(1);
  });
});
