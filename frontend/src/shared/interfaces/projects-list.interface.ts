import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';

export interface ProjectsListInterface {
  total: number;
  projects: ProjectCardInterface[];
}
