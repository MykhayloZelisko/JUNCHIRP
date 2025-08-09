'use client';

import styles from './Button.module.scss';
import {
  ButtonHTMLAttributes,
  cloneElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react';
import Spinner from '../Spinner/Spinner';

type ButtonSize = 'ssm' | 'sm' | 'md' | 'lg' | 'lg-md';
type Variant =
  | 'primary'
  | 'secondary'
  | 'secondary-frame'
  | 'secondary-footer'
  | 'tertiary'
  | 'link';
type IconPosition = 'left' | 'right';
type Color = 'green' | 'red' | 'gray' | 'black' | 'blue';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  size?: ButtonSize;
  variant?: Variant;
  icon?: ReactElement<SVGProps<SVGSVGElement>>;
  iconPosition?: IconPosition;
  children?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  color = 'gray',
  size = 'sm',
  variant = 'primary',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  disabled,
  fullWidth = false,
  loading = false,
  className,
  type = 'button',
}: ButtonProps): ReactElement {
  const isIconOnly = !!icon && !children;

  const classNames = [
    styles.button,
    styles[`button--${variant}-${color}`],
    styles[`button--${variant}-${size}`],
    fullWidth && styles['button--full'],
    isIconOnly && styles[`button--icon-button-${variant}-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize =
    size === 'ssm' ? 16 : size === 'sm' ? 20 : size === 'md' ? 24 : 32;

  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const RenderIcon = icon
    ? cloneElement(icon, {
        width: iconSize,
        height: iconSize,
        className: styles.button__icon,
      })
    : null;

  const RenderSpinner = loading
    ? cloneElement(<Spinner />, {
        width: iconSize,
        height: iconSize,
      })
    : null;

  return (
    <button
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
    >
      {RenderSpinner ? (
        <>
          {iconPosition === 'left' && RenderSpinner}
          {children}
          {iconPosition === 'right' && RenderIcon}
        </>
      ) : (
        <>
          {iconPosition === 'left' && RenderIcon}
          {children}
          {iconPosition === 'right' && RenderIcon}
        </>
      )}
    </button>
  );
}
