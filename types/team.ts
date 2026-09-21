export interface TeamMember {
  name: string;
  email: string;
  role: string;
  id: number;
  label?: string | null;
  status?: string;
  isOrganizer?: boolean;
}
