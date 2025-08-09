'use client';

import {
  useState,
  useId,
  useRef,
  useEffect,
  forwardRef,
  ForwardedRef,
  ReactElement,
  InputHTMLAttributes,
  ChangeEvent,
} from 'react';
import styles from './SocialAutocomplete.module.scss';
import { ClientSocialInterface } from '@/shared/interfaces/social.interface';
import Input from '@/shared/components/Input/Input';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  suggestions: ClientSocialInterface[];
  label?: string;
  errorMessages?: string[] | string;
  withError?: boolean;
  onSelectSocial?: (network: ClientSocialInterface | null) => void;
  placeholder?: string;
}

function SocialAutocompleteComponent(
  {
    suggestions,
    label,
    errorMessages,
    withError,
    onSelectSocial,
    value,
    placeholder,
    onChange,
    onBlur,
    ...rest
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() ?? '');

  useEffect(() => {
    setInputValue(value?.toString() ?? '');
  }, [value]);

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

  const filtered = suggestions.filter((item) =>
    item.network.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    onChange?.(e);

    const match = suggestions.find(
      (item) => item.network.toLowerCase() === val.toLowerCase(),
    );
    onSelectSocial?.(match ?? null);
  };

  const handleSelect = (item: ClientSocialInterface): void => {
    setInputValue(item.network);
    const syntheticEvent = {
      target: { value: item.network },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    onSelectSocial?.(item);
    setIsOpen(false);
  };

  return (
    <div className={styles['social-autocomplete']} ref={containerRef}>
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
      {isOpen && filtered.length > 0 && (
        <ul className={styles['social-autocomplete__list']}>
          {filtered.map((item) => (
            <li
              key={item.network}
              className={styles['social-autocomplete__item']}
              onMouseDown={() => handleSelect(item)}
            >
              {item.network}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SocialAutocomplete = forwardRef(SocialAutocompleteComponent);

export default SocialAutocomplete;
