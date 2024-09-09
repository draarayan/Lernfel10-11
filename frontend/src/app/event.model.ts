export interface Event {
    id?: number;
    title: string;
    description: string;
    createdBy: string; // Benutzername
    userId: number; // Benutzer-ID
    eventDate: string; // Das Datum, an dem das Event stattfindet (im Format YYYY-MM-DD)
  }
  