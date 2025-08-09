import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BoardMapper } from '../shared/mappers/board.mapper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateColumnsOrderDto } from './dto/update-columns-order.dto';
import { BoardWithColumnsResponseDto } from './dto/board-with-columns.response-dto';

@Injectable()
export class BoardsService {
  public constructor(private prisma: PrismaService) {}

  public async addBoard(
    createBoardDto: CreateBoardDto,
  ): Promise<BoardWithColumnsResponseDto> {
    const existingBoards = await this.prisma.board.count({
      where: { projectId: createBoardDto.projectId },
    });

    if (existingBoards >= 5) {
      throw new BadRequestException(
        'You can only add up to 5 boards in the project',
      );
    }

    try {
      const board = await this.prisma.board.create({
        data: {
          boardName: createBoardDto.boardName,
          projectId: createBoardDto.projectId,
          columns: {
            create: [
              { statusName: 'To Do', columnIndex: 1 },
              { statusName: 'In Progress', columnIndex: 2 },
              { statusName: 'Done', columnIndex: 3 },
            ],
          },
        },
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  assignee: {
                    include: {
                      educations: {
                        include: { specialization: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return BoardMapper.toExpandResponse(board);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Board with this name already exists');
      }
      throw error;
    }
  }

  public async getBoardById(id: string): Promise<BoardWithColumnsResponseDto> {
    try {
      const board = await this.prisma.board.findUniqueOrThrow({
        where: { id },
        include: {
          columns: {
            orderBy: { columnIndex: 'asc' },
            include: {
              tasks: {
                include: {
                  assignee: {
                    include: {
                      educations: {
                        include: { specialization: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return BoardMapper.toExpandResponse(board);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Board not found');
      }
      throw error;
    }
  }

  public async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardWithColumnsResponseDto> {
    try {
      const board = await this.prisma.board.update({
        where: { id },
        data: updateBoardDto,
        include: {
          columns: {
            include: {
              tasks: {
                include: {
                  assignee: {
                    include: {
                      educations: {
                        include: { specialization: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return BoardMapper.toExpandResponse(board);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Board not found');
          case 'P2002':
            throw new ConflictException('Board with this name already exists');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteBoard(id: string): Promise<void> {
    try {
      await this.prisma.board.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Board not found');
      }
      throw error;
    }
  }

  public async updateColumnsOrder(
    boardId: string,
    updateColumnsOrderDto: UpdateColumnsOrderDto,
  ): Promise<BoardWithColumnsResponseDto> {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const existingColumns = await this.prisma.taskStatus.findMany({
      where: { boardId },
    });
    const existingIdsSet = new Set(existingColumns.map((col) => col.id));

    if (updateColumnsOrderDto.columns.length !== existingIdsSet.size) {
      throw new BadRequestException(
        'Columns list must match existing columns exactly',
      );
    }

    const indices = updateColumnsOrderDto.columns.map((col) => col.columnIndex);
    const unique = new Set(indices);

    if (unique.size !== indices.length) {
      throw new BadRequestException('Indices must not be repeated');
    }

    if (unique.size !== Math.max(...indices)) {
      throw new BadRequestException(
        `Indices must be between 1 and ${unique.size}`,
      );
    }

    for (const col of updateColumnsOrderDto.columns) {
      if (!existingIdsSet.has(col.id)) {
        throw new BadRequestException(
          `Column with id ${col.id} does not belong to the board`,
        );
      }
    }

    await this.prisma.$transaction(
      updateColumnsOrderDto.columns.map((col) =>
        this.prisma.taskStatus.update({
          where: { id: col.id },
          data: { columnIndex: col.columnIndex },
        }),
      ),
    );

    const updatedBoard = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
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
          orderBy: { columnIndex: 'asc' },
        },
      },
    });

    if (!updatedBoard) {
      throw new InternalServerErrorException('Board not found after update');
    }

    return BoardMapper.toExpandResponse(updatedBoard);
  }
}
