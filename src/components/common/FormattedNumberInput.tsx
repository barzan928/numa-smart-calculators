import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { formatTypingValue, sanitizeNumberInput } from '../../utils/numberFormat';

interface FormattedNumberInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  unit?: string;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  helperText?: string;
  allowDecimals?: boolean;
}

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit,
  error,
  required = false,
  autoFocus = false,
  helperText,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => formatTypingValue(value));

  // Sync display value when incoming prop value changes externally
  useEffect(() => {
    setDisplayValue(formatTypingValue(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const cleanNumber = sanitizeNumberInput(text);
    const formatted = formatTypingValue(text);

    setDisplayValue(formatted);
    onChange(cleanNumber);
  };

  const handleClear = () => {
    setDisplayValue('');
    onChange('');
  };

  return (
    <div className="space-y-1.5 text-right w-full">
      {/* Label and Helper/Required */}
      <div className="flex items-center justify-between px-0.5">
        <label htmlFor={id} className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-[#FF5C77] text-xs">*</span>}
        </label>

        {helperText && (
          <span className="text-[10.5px] text-[var(--app-text-secondary)] font-medium">
            {helperText}
          </span>
        )}
      </div>

      {/* Input Field Container */}
      <div className="relative flex items-center w-full group">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          dir="ltr"
          autoFocus={autoFocus}
          placeholder={placeholder || '0'}
          value={displayValue}
          onChange={handleInputChange}
          className={`w-full h-12 bg-[var(--app-surface)] text-[var(--app-text)] placeholder-[var(--app-text-secondary)]/50 text-sm sm:text-base font-semibold px-4 rounded-2xl border transition-all ${
            error
              ? 'border-[#FF5C77] focus:border-[#FF5C77] focus:ring-2 focus:ring-[#FF5C77]/20 text-[#FF5C77]'
              : 'border-[var(--app-border)] focus:border-[#5B5BF7] focus:ring-2 focus:ring-[#5B5BF7]/20'
          } ${unit ? 'pl-16 pr-10' : 'pl-10 pr-4'}`}
        />

        {/* Clear Button */}
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="مسح القيمة"
            className="absolute right-3 p-1 rounded-lg text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Unit / Currency Badge */}
        {unit && (
          <div className="absolute left-2.5 flex items-center pointer-events-none">
            <span className="text-xs font-bold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-2.5 py-1 rounded-xl border border-[var(--app-border)]">
              {unit}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 px-1 text-[11px] font-semibold text-[#FF5C77] animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
