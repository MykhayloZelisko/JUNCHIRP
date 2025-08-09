'use client';

import {
  forwardRef,
  ForwardedRef,
  ReactElement,
  useId,
  ChangeEvent,
  TextareaHTMLAttributes,
} from 'react';
import styles from './Textarea.module.scss';
import Image from 'next/image';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  errorMessages?: string[] | string;
  className?: string;
  withError?: boolean;
}

function TextareaComponent(
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
): ReactElement {
  const {
    label,
    placeholder,
    errorMessages,
    value,
    className,
    withError,
    ...rest
  } = props;
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    rest.onChange?.(e);
  };

  const textAreaClassNames = [
    styles['textarea__textarea'],
    errorMessages?.length && styles['textarea__textarea--invalid'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.textarea} ${className ?? ''}`}>
      {label && (
        <label className={styles.textarea__label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.textarea__wrapper}>
        <textarea
          {...rest}
          id={id}
          ref={ref}
          value={value}
          onChange={handleChange}
          className={textAreaClassNames}
          placeholder={placeholder}
        />
      </div>
      {withError ? (
        errorMessages?.length ? (
          <p className={styles.textarea__error}>
            <Image
              src="/images/alert-circle.svg"
              alt={'alert'}
              width={16}
              height={16}
            />
            {errorMessages[0]}
          </p>
        ) : (
          <p className={styles.textarea__error}></p>
        )
      ) : null}
    </div>
  );
}

const Textarea = forwardRef(TextareaComponent);

export default Textarea;
