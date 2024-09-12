export interface Event {
  id?: number;
  title: string;
  description: string;
  createdBy?: string;
  userId?: number;
  eventDate?: Date;
  plz: string;
}
  