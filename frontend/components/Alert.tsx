// Error alert component

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'success';
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  className?: string;
}

export function Alert({
  title,
  message,
  type = 'error',
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
  className,
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  const styles = {
    error: {
      bg: 'bg-error-50 border-error-200',
      icon: 'text-error-600',
      title: 'text-error-900',
      message: 'text-error-700',
      button: 'text-error-600 hover:text-error-700',
    },
    warning: {
      bg: 'bg-warning-50 border-warning-200',
      icon: 'text-warning-600',
      title: 'text-warning-900',
      message: 'text-warning-700',
      button: 'text-warning-600 hover:text-warning-700',
    },
    success: {
      bg: 'bg-success-50 border-success-200',
      icon: 'text-success-600',
      title: 'text-success-900',
      message: 'text-success-700',
      button: 'text-success-600 hover:text-success-700',
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        'rounded-lg border p-4 animate-slide-up',
        style.bg,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`text-xl ${style.icon}`}>
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚡'}
          {type === 'success' && '✓'}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold text-sm ${style.title}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${style.message} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`ml-2 text-lg transition-colors ${style.button}`}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
