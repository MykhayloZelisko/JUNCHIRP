import { RoleInterface } from './role.interface';
import { SoftSkillInterface } from './soft-skill.interface';
import { HardSkillInterface } from './hard-skill.interface';
import { SocialInterface } from './social.interface';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

export interface UserInterface extends UserCardInterface {
  googleId: string | null;
  discordId: string | null;
  email: string;
  isVerified: boolean;
  role: RoleInterface;
  softSkills: SoftSkillInterface[];
  hardSkills: HardSkillInterface[];
  socials: SocialInterface[];
}
