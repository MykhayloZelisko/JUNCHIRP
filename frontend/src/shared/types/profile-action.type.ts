import { SocialInterface } from '../interfaces/social.interface';
import { EducationInterface } from '../interfaces/education.interface';

export type ProfileActionType =
  | { type: 'edit-name'; description: `Редагувати ім'я і прізвище` }
  | { type: 'add-social'; description: 'Додати соцмережу' }
  | {
      type: 'edit-social';
      item: SocialInterface;
      description: 'Редагувати соцмережу';
    }
  | { type: 'add-education'; description: 'Додати освіту' }
  | {
      type: 'edit-education';
      item: EducationInterface;
      description: 'Редагувати освіту';
    }
  | { type: 'add-soft-skill'; description: 'Додати софт скіл' }
  | { type: 'add-hard-skill'; description: 'Додати хард скіл' }
  | null;
