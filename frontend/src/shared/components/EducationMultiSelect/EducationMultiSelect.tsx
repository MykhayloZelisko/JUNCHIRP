'use client';

import React, { useState, useId, useRef, useEffect, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import styles from './EducationMultiSelect.module.scss';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import Checkbox from '@/assets/icons/checkbox-empty.svg';

interface EducationMultiSelectProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectRoleTypeInterface[];
  placeholder?: string;
}

export default function EducationMultiSelect({
  label,
  options,
  value = [],
  onChange,
  onBlur,
  placeholder = '',
}: EducationMultiSelectProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const selectedIds = Array.isArray(value) ? value : [];

  const selectedLabels = options
    .filter((opt) => selectedIds.includes(opt.id))
    .map((opt) => opt.roleName);

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

  const toggleSelect = (option: ProjectRoleTypeInterface): void => {
    const alreadySelected = selectedIds.includes(option.id);
    const newSelected = alreadySelected
      ? selectedIds.filter((itemId) => itemId !== option.id)
      : [...selectedIds, option.id];
    onChange?.(newSelected);
  };

  return (
    <div className={styles['education-multi-select']} ref={ref}>
      <div className={styles['education-multi-select__field']}>
        {label && (
          <label
            className={styles['education-multi-select__label']}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={`${styles['education-multi-select__button']} ${isOpen ? styles['education-multi-select__button--focused'] : ''}`}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabels.length > 0 ? (
            <span className={styles['education-multi-select__selected']}>
              {selectedLabels.join(' / ')}
            </span>
          ) : (
            <span className={styles['education-multi-select__selected']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['education-multi-select__list']}>
          {options.map((option) => {
            const selected = selectedIds.includes(option.id);
            return (
              <li
                key={option.id}
                className={`${styles['education-multi-select__item']} ${
                  selected
                    ? styles['education-multi-select__item--selected']
                    : ''
                }`}
                onClick={() => toggleSelect(option)}
              >
                <div
                  className={styles['education-multi-select__checkbox-label']}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    readOnly
                    className={styles['education-multi-select__checkbox']}
                  />
                  {selected ? (
                    <CheckboxChecked
                      className={styles['education-multi-select__icon']}
                    />
                  ) : (
                    <Checkbox
                      className={styles['education-multi-select__icon']}
                    />
                  )}
                  <span
                    className={
                      styles['education-multi-select__checkbox-label-text']
                    }
                  >
                    {option.roleName}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
