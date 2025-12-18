/**
 * Componente de input de formulário reutilizável
 * Suporta diferentes tipos: text, number, select
 */

import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface BaseProps {
  label: string;
  error?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'number' | 'email';
}

interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

// Input de texto/número
export const FormInput = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-background text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

// Select/Dropdown
export const FormSelect = ({ label, error, children, className = '', ...props }: SelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-background text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
          ${className}
        `}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
