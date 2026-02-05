import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string; // Ensure ID is always provided for accessibility
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = '', ...props }, ref) => {
  const baseStyles =
    'block w-full px-4 py-2.5 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal focus:border-brand-teal sm:text-sm font-medium transition-all duration-200';
  const errorStyles = error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-brand-navy/20 hover:border-brand-navy/40';

  React.useEffect(() => {
    if (id === 'reporterName' || id === 'reporterContact') {
      const input = (ref as any)?.current;
      if (input) {
        // eslint-disable-next-line no-console
        console.log(`[Input ${id}] value:`, input.value, 'name:', input.name);
      }
    }
  }, [id, ref]);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark mb-1">
          {label}
        </label>
      )}
      <input 
        ref={ref} 
        id={id} 
        className={`${baseStyles} ${errorStyles}`} 
        {...props}
        onChange={(e) => {
          if (id === 'reporterName' || id === 'reporterContact') {
            // eslint-disable-next-line no-console
            console.log(`[Input ${id}] onChange:`, e.target.value);
          }
          if (props.onChange) props.onChange(e);
        }}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;