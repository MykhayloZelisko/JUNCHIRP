import {
  Board,
  Education,
  ProjectRoleType,
  Task,
  TaskStatus,
  User,
} from '@prisma/client';
import { BoardResponseDto } from '../../boards/dto/board.response-dto';
import { TaskStatusMapper } from './task-status.mapper';
import { BoardWithColumnsResponseDto } from '../../boards/dto/board-with-columns.response-dto';

export class BoardMapper {
  public static toBaseResponse(board: Board): BoardResponseDto {
    return {
      id: board.id,
      boardName: board.boardName,
      projectId: board.projectId,
    };
  }

  public static toExpandResponse(
    board: Board & {
      columns: (TaskStatus & {
        tasks: (Task & {
          assignee:
            | (User & {
                educations: (Education & { specialization: ProjectRoleType })[];
              })
            | null;
        })[];
      })[];
    },
  ): BoardWithColumnsResponseDto {
    return {
      id: board.id,
      boardName: board.boardName,
      projectId: board.projectId,
      columns: board.columns.map((column) =>
        TaskStatusMapper.toExpandResponse(column),
      ),
    };
  }
}
