'use client';

import {
  InputHTMLAttributes,
  useState,
  forwardRef,
  ForwardedRef,
  ReactElement,
  useId,
  ChangeEvent,
} from 'react';
import styles from './Input.module.scss';
import Image from 'next/image';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  errorMessages?: string[] | string;
  className?: string;
  withError?: boolean;
}

function InputComponent(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const {
    label,
    placeholder,
    errorMessages,
    value,
    type = 'text',
    className,
    withError,
    ...rest
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const isPasswordField = props.type === 'password';
  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    rest.onChange?.(e);
  };

  const inputClassNames = [
    styles['input__input'],
    errorMessages?.length && styles['input__input--invalid'],
    isPasswordField && styles['input__input--password'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.input} ${className ?? ''}`}>
      {label && (
        <label className={styles.input__label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.input__wrapper}>
        <input
          {...rest}
          id={id}
          ref={ref}
          type={inputType}
          value={value}
          onChange={handleChange}
          className={inputClassNames}
          placeholder={placeholder}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles['input__toggle-button']}
          >
            <Image
              src={showPassword ? '/images/eye.svg' : '/images/eye-off.svg'}
              alt="eye"
              width={16}
              height={16}
            />
          </button>
        )}
      </div>
      {withError ? (
        errorMessages?.length ? (
          <p className={styles.input__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={16}
              height={16}
            />
            {errorMessages[0]}
          </p>
        ) : (
          <p className={styles.input__error}></p>
        )
      ) : null}
    </div>
  );
}

const Input = forwardRef(InputComponent);

export default Input;
