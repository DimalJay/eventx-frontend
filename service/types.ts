export type Response<T = any> = {
  success: boolean;
  message: string;
  data: T;
  total?: number;
};

export type WithID<T> = { _id: string } & T;


export interface IEvent {
  title: string;
  description?: string;
  startDate: Date,
  endDate: Date,
  location?: string;
  imageUrl?: string;
  isPublic: boolean;
  capacity: number;
  ticketPrice: number;
  registrationDeadline?: string; // YYYY-MM-DD HH:MM:SS
  waitlistEnabled?: boolean;
  agenda?: string;
}

export interface IAgendaItem {
  task: string;
  time: Date;
  location: string;
}
