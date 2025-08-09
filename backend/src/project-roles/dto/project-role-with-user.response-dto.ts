import { ProjectRoleResponseDto } from './project-role.response-dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';

export class ProjectRoleWithUserResponseDto extends ProjectRoleResponseDto {
  @ApiProperty({ type: () => UserCardResponseDto, nullable: true })
  public readonly user: UserCardResponseDto | null;
}
