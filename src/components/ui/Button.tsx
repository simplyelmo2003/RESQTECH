import React, { ButtonHTMLAttributes } from 'react';

// Define the props interface for the Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-teal text-white shadow-lg hover:shadow-xl hover:opacity-90 focus:ring-brand-navy/40 transform hover:-translate-y-1 active:translate-y-0',
    secondary: 'bg-gradient-to-r from-brand-teal to-brand-teal text-white shadow-md hover:shadow-lg hover:opacity-90 focus:ring-brand-teal/40 transform hover:-translate-y-0.5 active:translate-y-0',
    accent: 'bg-gradient-to-r from-brand-yellow to-orange-500 text-white shadow-md hover:shadow-lg hover:opacity-95 focus:ring-yellow-400/40 transform hover:-translate-y-0.5 active:translate-y-0 font-semibold',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg hover:opacity-90 focus:ring-red-500/40 transform hover:-translate-y-0.5 active:translate-y-0',
    info: 'bg-gradient-to-r from-brand-teal to-cyan-500 text-white shadow-md hover:shadow-lg hover:opacity-90 focus:ring-brand-teal/40 transform hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-white border-2 border-brand-navy text-brand-navy hover:bg-brand-navy/5 focus:ring-brand-navy/30 font-semibold transition-all',
    ghost: 'bg-transparent text-brand-navy hover:bg-brand-navy/10 focus:ring-brand-navy/20 font-medium',
  }[variant];

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[34px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-5 py-2.5 text-lg min-h-[48px]',
  }[size];

  // Disabled and Loading states
  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  const loadingContent = (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12V4a8 8 0 0116 0v8c0 2.651-2.149 4.88-4.8 4.996L17.2 17c.21-.11.4-.2.57-.3.17-.1.32-.2.47-.3a4.99 4.99 0 00-.7-.9c-.19-.1-.38-.2-.58-.3a5.002 5.002 0 00-6.19 2.51c-.13.3-.2.6-.2.9v1.07c0 .17.06.33.15.48a.98.98 0 001.37.28.995.995 0 00.28-1.37A.996.996 0 0012 19V17c-.38 0-.74-.08-1.07-.22a4.994 4.994 0 00-2.51-6.19c-.11-.19-.2-.38-.3-.58a5.002 5.002 0 00-.9-.7c-.1-.17-.2-.32-.3-.47z"></path>
      </svg>
      <span>Loading...</span>
    </div>
  );


  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingContent : children}
    </button>
  );
};

export default Button;