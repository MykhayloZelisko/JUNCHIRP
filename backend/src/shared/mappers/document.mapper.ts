import { Document } from '@prisma/client';
import { DocumentResponseDto } from '../../documents/dto/document.response-dto';

export class DocumentMapper {
  public static toResponse(doc: Document): DocumentResponseDto {
    return {
      id: doc.id,
      documentName: doc.documentName,
      url: doc.url,
    };
  }
}
