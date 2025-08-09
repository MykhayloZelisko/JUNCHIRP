import {
  Board,
  Education,
  Project,
  ProjectCategory,
  ProjectRole,
  Document,
  ProjectRoleType,
  User,
} from '@prisma/client';
import { ProjectResponseDto } from '../../projects/dto/project.response-dto';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectCardResponseDto } from '../../projects/dto/project-card.response-dto';
import { BoardMapper } from './board.mapper';

export class ProjectMapper {
  public static toCardResponse(
    project: Project & {
      category: ProjectCategory;
      roles: (ProjectRole & { roleType: ProjectRoleType })[];
    },
  ): ProjectCardResponseDto {
    return {
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      ownerId: project.ownerId,
      participantsCount: project.participantsCount,
      status: project.status,
      createdAt: project.createdAt,
      category: project.category,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toBaseResponse(role),
      ),
    };
  }

  public static toFullResponse(
    project: Project & {
      category: ProjectCategory;
      roles: (ProjectRole & {
        roleType: ProjectRoleType;
        user:
          | (User & {
              educations: (Education & { specialization: ProjectRoleType })[];
            })
          | null;
      })[];
      documents: Document[];
      boards: Board[];
    },
  ): ProjectResponseDto {
    return {
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      ownerId: project.ownerId,
      participantsCount: project.participantsCount,
      status: project.status,
      createdAt: project.createdAt,
      category: project.category,
      discordUrl: project.discordUrl,
      logoUrl: project.logoUrl ?? '',
      documents: project.documents,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
      boards: project.boards.map((board) => BoardMapper.toBaseResponse(board)),
    };
  }
}
