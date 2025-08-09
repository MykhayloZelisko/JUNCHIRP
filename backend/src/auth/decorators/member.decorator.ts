import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  MODEL_KEY,
  PROJECT_ID_KEY_KEY,
  PROJECT_ID_SOURCE_KEY,
} from '../../shared/constants/owner-member-metadata';
import { MemberGuard } from '../guards/member/member.guard';
import { User } from './user.decorator';

export const Member = (
  source: 'params' | 'body' | 'query' = 'params',
  key = 'id',
  model:
    | 'project'
    | 'task'
    | 'taskStatus'
    | 'board'
    | 'participationInvite'
    | 'participationRequest'
    | 'projectRole'
    | 'document' = 'project',
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SetMetadata(PROJECT_ID_SOURCE_KEY, source),
    SetMetadata(PROJECT_ID_KEY_KEY, key),
    SetMetadata(MODEL_KEY, model),
    User('discord'),
    UseGuards(MemberGuard),
  );
