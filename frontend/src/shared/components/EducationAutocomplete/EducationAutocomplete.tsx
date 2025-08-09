'use client';

import {
  useId,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  ReactElement,
  InputHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';
import Input from '@/shared/components/Input/Input';
import styles from './EducationAutocomplete.module.scss';
import { useLazyGetEducationsAutocompleteQuery } from '@/api/educationsApi';

interface EducationAutocompleteProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessages?: string[] | string;
  withError?: boolean;
  onSelectEducation?: (edu: string | null) => void;
  placeholder?: string;
}

function EducationAutocompleteComponent(
  {
    label,
    errorMessages,
    withError,
    onSelectEducation,
    value,
    placeholder,
    onChange,
    onBlur,
    ...rest
  }: EducationAutocompleteProps,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() ?? '');
  const [getInstitutions, { data = [] }] =
    useLazyGetEducationsAutocompleteQuery();

  useEffect(() => {
    setInputValue(value?.toString() ?? '');
  }, [value]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (inputValue.trim().length >= 2) {
        getInstitutions(inputValue.trim());
      }
    }, 500);

    return (): void => clearTimeout(delay);
  }, [inputValue, getInstitutions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    onChange?.(e);
    onSelectEducation?.(null);
  };

  const handleSelect = (item: string): void => {
    setInputValue(item);
    const syntheticEvent = {
      target: { value: item },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    onSelectEducation?.(item);
    setIsOpen(false);
  };

  return (
    <div className={styles['education-autocomplete']} ref={containerRef}>
      <Input
        label={label}
        placeholder={placeholder}
        {...rest}
        ref={ref}
        id={id}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        autoComplete="off"
        withError={withError}
        errorMessages={errorMessages}
      />
      {isOpen && data.length > 0 && (
        <ul className={styles['education-autocomplete__list']}>
          {data.map((item: string) => (
            <li
              key={item}
              className={styles['education-autocomplete__item']}
              onMouseDown={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const EducationAutocomplete = forwardRef(EducationAutocompleteComponent);

export default EducationAutocomplete;
