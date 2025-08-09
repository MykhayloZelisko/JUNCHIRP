import { ReactElement, useEffect, useId, useRef, useState } from 'react';
import styles from './ProjectDropdown.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { ControllerRenderProps } from 'react-hook-form';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';

interface ProjectDropdownProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectCardInterface[];
  placeholder?: string;
}

export default function ProjectDropdown({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = '',
}: ProjectDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.id === value);
    setSelectedLabel(selected?.projectName ?? null);
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

  const handleSelect = (option: ProjectCardInterface): void => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className={styles['project-dropdown']} ref={ref}>
      <div className={styles['project-dropdown__field']}>
        {label && (
          <label className={styles['project-dropdown__label']} htmlFor={id}>
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['project-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
        >
          {selectedLabel ? (
            <span className={styles['project-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['project-dropdown__placeholder']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['project-dropdown__list']}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles['project-dropdown__item']}
              onClick={() => handleSelect(option)}
            >
              {option.projectName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
