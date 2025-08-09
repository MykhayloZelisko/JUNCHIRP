import { Education, ProjectRole, ProjectRoleType, User } from '@prisma/client';
import { UserParticipationResponseDto } from '../../participations/dto/user-participation.response-dto';
import { UserMapper } from './user.mapper';
import { ProjectRoleMapper } from './project-role.mapper';
import { Participation } from '../types/participation.type';

export class UserParticipationMapper {
  public static toResponse(
    participation: Participation & {
      user: User & {
        educations: (Education & { specialization: ProjectRoleType })[];
      };
      projectRole: ProjectRole & { roleType: ProjectRoleType };
    },
  ): UserParticipationResponseDto {
    return {
      id: participation.id,
      user: UserMapper.toCardResponse(participation.user),
      projectRole: ProjectRoleMapper.toBaseResponse(participation.projectRole),
    };
  }
}
