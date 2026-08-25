export type Response<T = any> = {
  success: boolean;
  message: string;
  data: T;
  total?: number;
};

export type WithID<T> = { _id: string } & T;


export interface IEvent {
  id?: string | number;
  organizerId?: string | number;
  title: string;
  description?: string;
  startDate: Date,
  endDate: Date,
  location?: string;
  imageUrl?: string;
  isPublic: boolean;
  capacity: number;
  ticketPrice: number;
  agenda: string,
  registrationDeadline?: string;
  regDeadline?: string;
  waitlistEnabled?: boolean;
  status?: string;
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

export interface IAgendaItem {
  id: string;
  eventId: string;
  task: string;
  time: Date,
  location: string;
}

export interface IRegistration {
  id: string;
  eventId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt: Date;
  status: "GOING" | "WAITLIST" | "NOT_GOING" | "PENDING";
  ticketCode: string;
  checkingTime?: Date;
  chekingTime?: string | Date;
}
