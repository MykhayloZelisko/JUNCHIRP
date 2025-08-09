import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

export interface UsersListInterface {
  total: number;
  users: UserCardInterface[];
}
