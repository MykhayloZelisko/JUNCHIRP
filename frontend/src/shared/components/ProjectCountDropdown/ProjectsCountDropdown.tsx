'use client';

import { useState, useId, useRef, useEffect, ReactElement } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import styles from './ProjectsCountDropdown.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { ProjectsCountOptionsInterface } from '@/shared/interfaces/projects-count-options.interface';

interface ProjectsCountDropdownProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectsCountOptionsInterface[];
  placeholder?: string;
}

export default function ProjectsCountDropdown({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = '',
}: ProjectsCountDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.value === value) ?? options[0];
    setSelectedLabel(selected.label);
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

  const handleSelect = (option: ProjectsCountOptionsInterface): void => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={styles['projects-count-dropdown']} ref={ref}>
      <div className={styles['projects-count-dropdown__field']}>
        {label && (
          <label
            className={styles['projects-count-dropdown__label']}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['projects-count-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabel ? (
            <span className={styles['projects-count-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['projects-count-dropdown__selected']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['projects-count-dropdown__list']}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles['projects-count-dropdown__item']}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
