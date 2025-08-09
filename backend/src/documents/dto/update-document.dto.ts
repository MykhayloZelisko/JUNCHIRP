import { CreateDocumentDto } from './create-document.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateDocumentDto extends OmitType(CreateDocumentDto, [
  'projectId',
]) {}
