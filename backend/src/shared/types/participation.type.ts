import { ParticipationInvite, ParticipationRequest } from '@prisma/client';

export type Participation = ParticipationRequest | ParticipationInvite;
