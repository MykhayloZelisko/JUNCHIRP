import { SocialInterface } from '@/shared/interfaces/social.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EmailWithIdInterface } from '@/shared/interfaces/email-with-id.interface';

export function isSocial(item: unknown): item is SocialInterface {
  return (
    typeof item === 'object' &&
    item !== null &&
    'network' in item &&
    'url' in item
  );
}

export function isEducation(item: unknown): item is EducationInterface {
  return (
    typeof item === 'object' &&
    item !== null &&
    'institution' in item &&
    'specialization' in item
  );
}

export function isSoftSkill(item: unknown): item is SoftSkillInterface {
  return typeof item === 'object' && item !== null && 'softSkillName' in item;
}

export function isHardSkill(item: unknown): item is HardSkillInterface {
  return typeof item === 'object' && item !== null && 'hardSkillName' in item;
}

export function isEmailWithId(item: unknown): item is EmailWithIdInterface {
  return typeof item === 'object' && item !== null && 'email' in item;
}
