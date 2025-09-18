import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, ...props }, ref) => {
    // Função para combinar classes CSS
    const cn = (...classes: (string | undefined | null | false)[]) => {
      return classes.filter(Boolean).join(' ');
    };

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            // Base styles
            "w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
            // Error state
            error 
              ? "border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500" 
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-500",
            // Disabled state
            props.disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            // Custom appearance removal
            "appearance-none",
            className
          )}
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={cn(
              "w-4 h-4 transition-colors",
              error ? "text-red-400" : "text-gray-400"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, type SelectOption };
