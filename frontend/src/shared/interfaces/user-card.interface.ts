import { EducationInterface } from '@/shared/interfaces/education.interface';

export interface UserCardInterface {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  activeProjectsCount: number;
  educations: EducationInterface[];
}
