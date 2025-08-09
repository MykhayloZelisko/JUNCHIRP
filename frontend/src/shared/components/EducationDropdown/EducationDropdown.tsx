'use client';

import { useState, useId, useRef, useEffect, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import styles from './EducationDropdown.module.scss';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';

interface EducationDropdownProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectRoleTypeInterface[];
  placeholder?: string;
}

export default function EducationDropdown({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = '',
}: EducationDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.id === value);
    setSelectedLabel(selected?.roleName ?? null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: ProjectRoleTypeInterface): void => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className={styles['education-dropdown']} ref={ref}>
      <div className={styles['education-dropdown__field']}>
        {label && (
          <label className={styles['education-dropdown__label']} htmlFor={id}>
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['education-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabel ? (
            <span className={styles['education-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['education-dropdown__placeholder']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['education-dropdown__list']}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles['education-dropdown__item']}
              onClick={() => handleSelect(option)}
            >
              {option.roleName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
