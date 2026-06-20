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
}

export interface IEventResponse extends WithID<IEvent> {
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  createdBy: string;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
  assignedDate: string;
  dueDate: string;
  status: TaskStatus;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";