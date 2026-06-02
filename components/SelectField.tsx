import type { SelectHTMLAttributes } from "react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
  error?: string;
};

export function SelectField({ label, id, options, error, required, ...props }: SelectFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold leading-5 text-stone-800">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </label>
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="block h-12 w-full min-w-0 truncate rounded-md border border-stone-300 bg-white px-3 pr-8 text-base text-stone-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 sm:px-4"
        {...props}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p id={`${id}-error`} className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
