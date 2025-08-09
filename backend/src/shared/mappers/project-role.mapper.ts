import {
  Education,
  Project,
  ProjectCategory,
  ProjectRole,
  ProjectRoleType,
  User,
} from '@prisma/client';
import { ProjectRoleResponseDto } from '../../project-roles/dto/project-role.response-dto';
import { ProjectRoleWithProjectResponseDto } from '../../project-roles/dto/project-role-with-project.response-dto';
import { ProjectMapper } from './project.mapper';
import { UserMapper } from './user.mapper';
import { ProjectRoleWithUserResponseDto } from '../../project-roles/dto/project-role-with-user.response-dto';

export class ProjectRoleMapper {
  public static toBaseResponse(
    role: ProjectRole & { roleType: ProjectRoleType },
  ): ProjectRoleResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
    };
  }

  public static toProjectResponse(
    role: ProjectRole & {
      roleType: ProjectRoleType;
      project: Project & {
        category: ProjectCategory;
        roles: (ProjectRole & { roleType: ProjectRoleType })[];
      };
    },
  ): ProjectRoleWithProjectResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
      project: ProjectMapper.toCardResponse(role.project),
    };
  }

  public static toUserResponse(
    role: ProjectRole & {
      roleType: ProjectRoleType;
      user:
        | (User & {
            educations: (Education & { specialization: ProjectRoleType })[];
          })
        | null;
    },
  ): ProjectRoleWithUserResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
      user: role.user ? UserMapper.toCardResponse(role.user) : null,
    };
  }
}
