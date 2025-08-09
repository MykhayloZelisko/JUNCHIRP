'use client';

import { ReactElement } from 'react';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import styles from './ProfileActionForm.module.scss';
import SocialForm from './SocialForm/SocialForm';
import EducationForm from './EducationForm/EducationForm';
import SoftSkillForm from './SoftSkillForm/SoftSkillForm';
import HardSkillForm from './HardSkillForm/HardSkillForm';
import { UserInterface } from '@/shared/interfaces/user.interface';
import UserNameForm from './UserNameForm/UserNameForm';

interface ProfileActionFormProps {
  action: ProfileActionType;
  allField: boolean;
  user: UserInterface;
  onCancel: () => void;
}

export default function ProfileActionForm(
  props: ProfileActionFormProps,
): ReactElement {
  const { action, allField, onCancel, user } = props;
  let content: ReactElement;
  switch (action?.type) {
    case 'add-social': {
      content = <SocialForm onCancel={onCancel} />;
      break;
    }
    case 'edit-social': {
      content = <SocialForm initialValues={action.item} onCancel={onCancel} />;
      break;
    }
    case 'add-education': {
      content = <EducationForm onCancel={onCancel} />;
      break;
    }
    case 'edit-education': {
      content = (
        <EducationForm initialValues={action.item} onCancel={onCancel} />
      );
      break;
    }
    case 'add-soft-skill': {
      content = <SoftSkillForm onCancel={onCancel} />;
      break;
    }
    case 'add-hard-skill': {
      content = <HardSkillForm onCancel={onCancel} />;
      break;
    }
    case 'edit-name': {
      content = <UserNameForm initialValues={user} onCancel={onCancel} />;
      break;
    }
    default: {
      content = allField ? (
        <p className={styles['profile-action-form__text']}>
          Профіль готовий — обирай проєкт або створи власний!
        </p>
      ) : (
        <p className={styles['profile-action-form__text']}>
          Заповни профіль, щоб показати свої сильні сторони та долучитись до
          крутих можливостей!
        </p>
      );
    }
  }

  return <div className={styles['profile-action-form']}>{content}</div>;
}
