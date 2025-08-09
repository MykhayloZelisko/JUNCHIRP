import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatusResponseDto } from './dto/task-status.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TaskStatusMapper } from '../shared/mappers/task-status.mapper';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class TaskStatusesService {
  public constructor(
    private prisma: PrismaService,
    private boardsService: BoardsService,
  ) {}

  public async addTaskStatus(
    createTaskStatusDto: CreateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    await this.boardsService.getBoardById(createTaskStatusDto.boardId);

    const existingStatuses = await this.prisma.taskStatus.count({
      where: { boardId: createTaskStatusDto.boardId },
    });

    if (existingStatuses >= 5) {
      throw new BadRequestException(
        'You can only add up to 5 columns on the board',
      );
    }

    try {
      const status = await this.prisma.taskStatus.create({
        data: {
          boardId: createTaskStatusDto.boardId,
          statusName: createTaskStatusDto.statusName,
          columnIndex: existingStatuses + 1,
        },
        include: {
          tasks: {
            include: {
              assignee: {
                include: {
                  educations: {
                    include: {
                      specialization: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return TaskStatusMapper.toExpandResponse(status);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Column name must be unique on the board');
      }
      throw error;
    }
  }

  public async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    try {
      const status = await this.prisma.taskStatus.update({
        where: { id },
        data: {
          ...updateTaskStatusDto,
        },
      });

      return TaskStatusMapper.toBaseResponse(status);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Column not found');
          case 'P2002':
            throw new ConflictException(
              'Column name must be unique on the board',
            );
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteTaskStatus(id: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      try {
        const deletedColumn = await prisma.taskStatus.delete({
          where: { id },
          select: {
            columnIndex: true,
            boardId: true,
          },
        });

        const columnsToUpdate = await prisma.taskStatus.findMany({
          where: {
            boardId: deletedColumn.boardId,
            columnIndex: { gt: deletedColumn.columnIndex },
          },
        });

        await Promise.all(
          columnsToUpdate.map((c) =>
            prisma.taskStatus.update({
              where: { id: c.id },
              data: { columnIndex: c.columnIndex - 1 },
            }),
          ),
        );
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Column not found');
        }
        throw error;
      }
    });
  }
}
