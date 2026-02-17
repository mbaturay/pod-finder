import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ variant = 'primary', children, className = '', onClick, disabled, type = 'button' }: ButtonProps) {
  const baseClasses = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClass} ${className}`}
    >
      {children}
    </motion.button>
  );
}
