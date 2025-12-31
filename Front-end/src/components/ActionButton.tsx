/**
 * Componente de botão de ação reutilizável
 * Suporta variantes: primary, secondary, danger
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const ActionButton = ({
  variant = 'primary',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ActionButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        px-4 py-2.5 rounded-lg font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
