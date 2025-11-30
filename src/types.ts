export interface Participant {
  name: string;
  preferredSlots: string[];
}

export interface OptimizeRequest {
  meetingName: string;
  participants: Participant[];
}

export interface OptimalSlot {
  slot: string;
  participants: string[];
}

export interface OptimizeResponse {
  meetingName: string;
  optimalSlots: OptimalSlot[];
  maxParticipants: number;
}
