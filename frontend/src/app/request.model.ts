// request.model.ts
export interface Request {
  id?: number;
  eventId: number;
  requestedBy: string;
  requestItem: string;
  status?: string; 
  createdAt?: string;
  requestedByUserId?: number; 
}