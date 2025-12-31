/**
 * Componente para exibir mensagens de alerta (erro, sucesso, aviso)
 * Usado para feedback de operações e validações
 */

import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: typeof AlertCircle }> = {
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
    icon: AlertCircle,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    icon: Info,
  },
};

const AlertMessage = ({ type, message, onClose }: AlertMessageProps) => {
  const styles = alertStyles[type];
  const Icon = styles.icon;

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border animate-fade-in
        ${styles.bg} ${styles.border}
      `}
    >
      <Icon className={`w-5 h-5 ${styles.text} flex-shrink-0`} />
      <p className={`flex-1 text-sm ${styles.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-foreground/10 transition-colors ${styles.text}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
