import { ReactElement, useEffect, useId, useRef, useState } from 'react';
import styles from './ProjectRoleDropdown.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { ControllerRenderProps } from 'react-hook-form';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';

interface ProjectRoleDropdownProps extends Partial<ControllerRenderProps> {
  label?: string;
  options: ProjectRoleInterface[];
  placeholder?: string;
  disabled: boolean;
  allowedRoleTypeIds: string[];
}

export default function ProjectRoleDropdown({
  label,
  options,
  value,
  disabled = false,
  onChange,
  onBlur,
  placeholder = '',
  allowedRoleTypeIds = [],
}: ProjectRoleDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.id === value);
    setSelectedLabel(selected?.roleType.roleName ?? null);
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

  const handleSelect = (option: ProjectRoleInterface): void => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className={styles['project-role-dropdown']} ref={ref}>
      <div className={styles['project-role-dropdown__field']}>
        {label && (
          <label
            className={styles['project-role-dropdown__label']}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <Button
          type="button"
          id={id}
          className={styles['project-role-dropdown__button']}
          fullWidth
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={onBlur}
          iconPosition="right"
          icon={isOpen ? <Up /> : <Down />}
          disabled={disabled}
        >
          {selectedLabel ? (
            <span className={styles['project-role-dropdown__selected']}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles['project-role-dropdown__placeholder']}>
              {placeholder}
            </span>
          )}
        </Button>
      </div>
      {isOpen && (
        <ul className={styles['project-role-dropdown__list']}>
          {options.map((option) => {
            const isDisabled =
              allowedRoleTypeIds &&
              !allowedRoleTypeIds.includes(option.roleType.id);

            return (
              <li
                key={option.id}
                className={`${styles['project-role-dropdown__item']} ${isDisabled ? styles['project-role-dropdown__item--disabled'] : ''}`}
                onClick={() => {
                  if (!isDisabled) {
                    handleSelect(option);
                  }
                }}
              >
                {option.roleType.roleName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
