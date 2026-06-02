import type { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextareaField({ label, id, error, required, ...props }: TextareaFieldProps) {
  return (
    <div className="min-w-0 space-y-2 sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-semibold leading-5 text-stone-800">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </label>
      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="block min-h-24 w-full min-w-0 resize-y rounded-md border border-stone-300 bg-white px-3 py-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 sm:min-h-28 sm:px-4"
        {...props}
      />
      {error ? <p id={`${id}-error`} className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
