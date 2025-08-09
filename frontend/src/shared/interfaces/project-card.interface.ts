import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';

export interface ProjectCardInterface {
  id: string;
  projectName: string;
  description: string;
  status: 'active' | 'done';
  createdAt: Date;
  participantsCount: number;
  ownerId: string;
  roles: ProjectRoleInterface[];
}
