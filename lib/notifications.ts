export type Notification = {
  id: number;
  title: string;
  meta: string;
  unread: boolean;
};

export const notifications: Notification[] = [
  { id: 1, title: "New registration for Astra Product Summit", meta: "2 min ago", unread: true },
  { id: 2, title: "Marcus approved the registration email", meta: "1 hour ago", unread: true },
  { id: 3, title: "Venue walkthrough scheduled for Monday", meta: "Yesterday", unread: false },
  { id: 4, title: "Sponsor deck uploaded by Marketing", meta: "2 days ago", unread: false },
  { id: 5, title: "Ticket sales passed 1,000 for Night Market Sessions", meta: "3 days ago", unread: false },
  { id: 6, title: "Pulse Design Retreat moved to a venue hold", meta: "5 days ago", unread: false },
  { id: 7, title: "Weekly registrations report is ready", meta: "1 week ago", unread: false },
];
