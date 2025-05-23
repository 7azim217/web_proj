import React, { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="flex items-center mb-4">
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={`
          w-5 h-5 rounded bg-gray-700 border-gray-600 
          text-blue-600 focus:ring-blue-500 focus:ring-2
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      <label htmlFor={checkboxId} className="ml-2 text-white select-none">
        {label}
      </label>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;