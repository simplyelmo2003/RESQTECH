import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  id: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, id, className = '', ...props }, ref) => {
  const baseStyles =
    'block w-full px-4 py-2.5 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal focus:border-brand-teal sm:text-sm font-medium transition-all duration-200 resize-y';
  const errorStyles = error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-brand-navy/20 hover:border-brand-navy/40';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark mb-1">
          {label}
        </label>
      )}
      <textarea ref={ref} id={id} className={`${baseStyles} ${errorStyles}`} {...props} />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;