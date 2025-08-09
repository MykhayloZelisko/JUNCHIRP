import {
  Education,
  ProjectRoleType,
  Task,
  TaskStatus,
  User,
} from '@prisma/client';
import { TaskStatusResponseDto } from '../../task-statuses/dto/task-status.response-dto';
import { TaskMapper } from './task.mapper';
import { TaskStatusWithTasksResponseDto } from '../../task-statuses/dto/task-status-with-tasks.response-dto';

export class TaskStatusMapper {
  public static toBaseResponse(status: TaskStatus): TaskStatusResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
    };
  }

  public static toExpandResponse(
    status: TaskStatus & {
      tasks: (Task & {
        assignee:
          | (User & {
              educations: (Education & { specialization: ProjectRoleType })[];
            })
          | null;
      })[];
    },
  ): TaskStatusWithTasksResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
      tasks: status.tasks.map((task) => TaskMapper.toBaseResponse(task)),
    };
  }
}
