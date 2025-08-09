import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentResponseDto } from './dto/document.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DocumentMapper } from '../shared/mappers/document.mapper';

@Injectable()
export class DocumentsService {
  public constructor(private prisma: PrismaService) {}

  public async addDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const documentCount = await this.prisma.document.count({
      where: {
        projectId: createDocumentDto.projectId,
      },
    });

    if (documentCount >= 20) {
      throw new BadRequestException(
        'Maximum number of documents per project is 20',
      );
    }

    try {
      const document = await this.prisma.document.create({
        data: createDocumentDto,
      });

      return DocumentMapper.toResponse(document);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Duplicate document url');
      }
      throw error;
    }
  }

  public async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    try {
      const document = await this.prisma.document.update({
        where: { id },
        data: updateDocumentDto,
      });

      return DocumentMapper.toResponse(document);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Document not found');
          case 'P2002':
            throw new ConflictException('Duplicate document url');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    try {
      await this.prisma.document.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Document not found');
      }
      throw error;
    }
  }
}
