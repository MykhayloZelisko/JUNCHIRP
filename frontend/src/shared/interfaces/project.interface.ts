import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import { BoardInterface } from '@/shared/interfaces/board.interface';

export interface ProjectInterface extends ProjectCardInterface {
  discordUrl: string;
  logoUrl: string | null;
  documents: DocumentInterface[];
  boards: BoardInterface[];
}
