import {
  Education,
  ProjectRoleType,
  Role,
  Social,
  User,
  UserHardSkill,
  UserSoftSkill,
} from '@prisma/client';
import { UserResponseDto } from '../../users/dto/user.response-dto';
import { UserWithPasswordResponseDto } from '../../users/dto/user-with-password.response-dto';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';

export class UserMapper {
  public static toFullResponse(
    user: User & {
      role: Role;
      educations: (Education & { specialization: ProjectRoleType })[];
      socials: Social[];
      softSkills: UserSoftSkill[];
      hardSkills: UserHardSkill[];
    },
    withPassword: boolean,
  ): UserResponseDto | UserWithPasswordResponseDto {
    const base = {
      id: user.id,
      googleId: user.googleId,
      discordId: user.discordId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      role: user.role,
      activeProjectsCount: user.activeProjectsCount,
      // educations: [],
      // socials: [],
      // softSkills: [],
      // hardSkills: [],
    };

    return withPassword
      ? {
          ...base,
          password: user.password,
        }
      : base;
  }

  public static toCardResponse(
    user: User & {
      educations: (Education & { specialization: ProjectRoleType })[];
    },
  ): UserCardResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      // educations: [],
      activeProjectsCount: user.activeProjectsCount,
    };
  }
}
