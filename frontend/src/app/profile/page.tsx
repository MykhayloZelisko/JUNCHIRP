'use client';

import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import ProfileBaseInfo from './ProfileBaseInfo/ProfileBaseInfo';
import authSelector from '@/redux/auth/authSelector';
import ProfileDetails from './ProfileDetails/ProfileDetails';
import { selectAllSocials } from '@/redux/socials/socialsSlice';
import { selectAllEducations } from '@/redux/educations/educationsSlice';
import { selectAllSoftSkills } from '@/redux/softSkills/softSkillsSlice';
import { selectAllHardSkills } from '@/redux/hardSkills/hardSkillsSlice';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import ProfileAction from './ProfileAction/ProfileAction';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import ProfileActionForm from './ProfileActionForm/ProfileActionForm';
import { useDeleteSocialMutation } from '@/api/socialsApi';
import DeleteItemPopup from './DeleteItemPopup/DeleteItemPopup';
import {
  isEducation,
  isHardSkill,
  isSocial,
  isSoftSkill,
} from '@/shared/utils/typeGuards';
import { DeletedItemInterface } from '@/shared/interfaces/deleted-item.interface';
import { useToast } from '@/hooks/useToast';
import { useDeleteEducationMutation } from '@/api/educationsApi';
import { useDeleteSoftSkillMutation } from '@/api/softSkillsApi';
import { useDeleteHardSkillMutation } from '@/api/hardSkillsApi';
import ProfileBanner from './ProfileBanner/ProfileBanner';
import { useAppSelector } from '@/hooks/reduxHooks';

export default function Profile(): ReactElement | null {
  const [action, setAction] = useState<ProfileActionType>(null);
  const [deletedItem, setDeletedItem] = useState<DeletedItemInterface<
    | SocialInterface
    | EducationInterface
    | SoftSkillInterface
    | HardSkillInterface
  > | null>(null);
  const [deleteSocial] = useDeleteSocialMutation();
  const [deleteEducation] = useDeleteEducationMutation();
  const [deleteSoftSkill] = useDeleteSoftSkillMutation();
  const [deleteHardSkill] = useDeleteHardSkillMutation();
  const toast = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const user = useAppSelector(authSelector.selectUser);
  const socials = useAppSelector(selectAllSocials);
  const educations = useAppSelector(selectAllEducations);
  const softSkills = useAppSelector(selectAllSoftSkills);
  const hardSkills = useAppSelector(selectAllHardSkills);
  const [isBanner, setBanner] = useState(false);

  const allFilled = [socials, educations, softSkills, hardSkills].every(
    (arr) => arr.length > 0,
  );

  useEffect(() => {
    if (action && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [action]);

  useEffect(() => {
    if (user && !user.discordId) {
      setBanner(true);
    }
  }, [user]);

  const handleAddSocial = (): void =>
    setAction({ type: 'add-social', description: 'Додати соцмережу' });
  const handleAddEducation = (): void =>
    setAction({ type: 'add-education', description: 'Додати освіту' });
  const handleAddHardSkill = (): void =>
    setAction({ type: 'add-hard-skill', description: 'Додати хард скіл' });
  const handleAddSoftSkill = (): void =>
    setAction({ type: 'add-soft-skill', description: 'Додати софт скіл' });
  const handleEditSocial = (item: SocialInterface): void =>
    setAction({
      type: 'edit-social',
      item,
      description: 'Редагувати соцмережу',
    });
  const handleEditEducation = (item: EducationInterface): void =>
    setAction({
      type: 'edit-education',
      item,
      description: 'Редагувати освіту',
    });
  const handleEditName = (): void =>
    setAction({
      type: 'edit-name',
      description: `Редагувати ім'я і прізвище`,
    });
  const handleCancel = (): void => setAction(null);
  const closeModal = (): void => {
    setModalOpen(false);
    setDeletedItem(null);
  };
  const openModal = (
    item:
      | SocialInterface
      | EducationInterface
      | SoftSkillInterface
      | HardSkillInterface,
  ): void => {
    setModalOpen(true);
    if (isSocial(item)) {
      setDeletedItem({
        item,
        title: 'Видалити соцмережу?',
        message:
          'Ти дійсно хочеш видалити цю соцмережу? Дію неможливо скасувати.',
      });
    }
    if (isEducation(item)) {
      setDeletedItem({
        item,
        title: 'Видалити запис про освіту?',
        message:
          'Ти дійсно хочеш видалити цей запис про освіту? Дію неможливо скасувати.',
      });
    }
    if (isSoftSkill(item) || isHardSkill(item)) {
      setDeletedItem({
        item,
        title: 'Видалити навичку?',
        message:
          'Ти дійсно хочеш видалити цю навичку? Дію неможливо скасувати.',
      });
    }
  };

  const handleDeleteSocial = async (item: SocialInterface): Promise<void> => {
    const result = await deleteSocial(item.id);
    closeModal();

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'Соцмережу видалено.',
        life: 3000,
      });
    }
  };

  const handleDeleteEducation = async (
    item: EducationInterface,
  ): Promise<void> => {
    const result = await deleteEducation(item.id);
    closeModal();

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'Запис про освіту видалено.',
        life: 3000,
      });
    }
  };

  const handleDeleteSoftSkill = async (
    item: SoftSkillInterface,
  ): Promise<void> => {
    const result = await deleteSoftSkill(item.id);
    closeModal();

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'Soft Skill видалено.',
        life: 3000,
      });
    }
  };

  const handleDeleteHardSkill = async (
    item: HardSkillInterface,
  ): Promise<void> => {
    const result = await deleteHardSkill(item.id);
    closeModal();

    if ('data' in result) {
      toast({
        severity: 'success',
        summary: 'Hard Skill видалено.',
        life: 3000,
      });
    }
  };

  const closeBanner = (): void => {
    setBanner(false);
  };

  if (!user) {
    return null;
  }

  return (
    <AuthGuard requireVerified>
      <div className={styles.profile}>
        <div className={styles.profile__details}>
          <ProfileBaseInfo user={user} handleEditName={handleEditName} />
          <ProfileDetails<SocialInterface>
            title="Соцмережі"
            isEditable
            items={socials}
            maxSize={5}
            handleAddItem={handleAddSocial}
            handleEditItem={handleEditSocial}
            handleDeleteItem={openModal}
          />
          <ProfileDetails<EducationInterface>
            title="Освіта"
            isEditable
            items={educations}
            maxSize={5}
            handleAddItem={handleAddEducation}
            handleEditItem={handleEditEducation}
            handleDeleteItem={openModal}
          />
          <ProfileDetails<HardSkillInterface>
            title="Хард скіли"
            items={hardSkills}
            maxSize={20}
            handleAddItem={handleAddHardSkill}
            handleDeleteItem={openModal}
          />
          <ProfileDetails<SoftSkillInterface>
            title="Софт скіли"
            items={softSkills}
            maxSize={20}
            handleAddItem={handleAddSoftSkill}
            handleDeleteItem={openModal}
          />
        </div>
        <div className={styles.profile__actions} ref={formRef}>
          <ProfileAction action={action} />
          <ProfileActionForm
            user={user}
            action={action}
            allField={allFilled}
            onCancel={handleCancel}
          />
        </div>
      </div>
      {isModalOpen && deletedItem && isSocial(deletedItem.item) && (
        <DeleteItemPopup<SocialInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteSocial}
          maxSize={5}
          count={socials.length}
          title={deletedItem.title}
          message={deletedItem.message}
        />
      )}
      {isModalOpen && isEducation(deletedItem?.item) && (
        <DeleteItemPopup<EducationInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteEducation}
          maxSize={5}
          count={educations.length}
          title={deletedItem.title}
          message={deletedItem.message}
        />
      )}
      {isModalOpen && isSoftSkill(deletedItem?.item) && (
        <DeleteItemPopup<SoftSkillInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteSoftSkill}
          maxSize={20}
          count={softSkills.length}
          title={deletedItem.title}
          message={deletedItem.message}
        />
      )}
      {isModalOpen && isHardSkill(deletedItem?.item) && (
        <DeleteItemPopup<HardSkillInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteHardSkill}
          maxSize={20}
          count={hardSkills.length}
          title={deletedItem.title}
          message={deletedItem.message}
        />
      )}
      <Suspense fallback={null}>
        {isBanner && <ProfileBanner closeBanner={closeBanner} />}
      </Suspense>
    </AuthGuard>
  );
}
