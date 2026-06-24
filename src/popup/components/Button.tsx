import React from 'react';
import Icon, { IconName } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'action';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: IconName;
  isLoading?: boolean;
  onClick?: () => void;
  title?: string;
  type?: 'button' | 'submit';
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  disabled = false,
  icon,
  isLoading = false,
  onClick,
  title,
  type = 'button',
  variant = 'secondary',
}) => (
  <button
    className={`ff-button ff-button-${variant} ${className}`}
    disabled={disabled || isLoading}
    onClick={onClick}
    title={title}
    type={type}
  >
    {isLoading ? <span className="ff-spinner" aria-hidden="true" /> : icon && <Icon name={icon} />}
    <span>{children}</span>
  </button>
);

export default Button;
