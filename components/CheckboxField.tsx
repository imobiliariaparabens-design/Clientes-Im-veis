import type { InputHTMLAttributes } from "react";

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function CheckboxField({ label, id, error, required, ...props }: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 rounded-md border border-stone-300 bg-stone-50 p-4 text-sm leading-6 text-stone-800">
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 rounded border-stone-400 text-emerald-800 focus:ring-emerald-700"
          {...props}
        />
        <span>
          {label}
          {required ? <span className="text-red-700"> *</span> : null}
        </span>
      </label>
      {error ? <p id={`${id}-error`} className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
