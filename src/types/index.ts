export interface Event {
  id: string; // uuid from Supabase
  name: string;
  date: string;
  created_at?: string;
}

export interface Registration {
  id: string; // Changed from number to string to match Supabase UUID
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface RegistrationWithEvent extends Registration {
  event: Event;
}