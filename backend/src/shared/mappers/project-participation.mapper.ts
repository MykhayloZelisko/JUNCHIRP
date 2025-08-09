import { Participation } from '../types/participation.type';
import {
  Project,
  ProjectCategory,
  ProjectRole,
  ProjectRoleType,
} from '@prisma/client';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectParticipationResponseDto } from '../../participations/dto/project-participation.response-dto';

export class ProjectParticipationMapper {
  public static toResponse(
    participation: Participation & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & {
          category: ProjectCategory;
          roles: (ProjectRole & { roleType: ProjectRoleType })[];
        };
      };
    },
  ): ProjectParticipationResponseDto {
    return {
      id: participation.id,
      userId: participation.userId,
      projectRole: ProjectRoleMapper.toProjectResponse(
        participation.projectRole,
      ),
    };
  }
}
