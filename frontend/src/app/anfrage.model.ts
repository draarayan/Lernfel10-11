// anfrage.model.ts
export interface Anfrage {
  id?: number;
  eventId: number;
  requestedBy: string;
  requestItem: string;
  status?: string; 
  createdAt?: string;
  requestedByUserId?: number; 
}