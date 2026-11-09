import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClasses =
  "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-md px-3.5 py-2.5 text-sm text-[var(--foreground)] transition-all duration-200 outline-none focus:border-[var(--accent-from)]/60 focus:ring-4 focus:ring-[var(--accent-from)]/15";

function Wrapper({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[var(--foreground)]/80"
      >
        {label}
      </label>
      {children}
      {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
    </div>
  );
}

export function Input({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = props.id ?? props.name;
  return (
    <Wrapper label={label} htmlFor={id!} hint={hint}>
      <input id={id} className={controlClasses} {...props} />
    </Wrapper>
  );
}

export function Textarea({
  label,
  hint,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
}) {
  const id = props.id ?? props.name;
  return (
    <Wrapper label={label} htmlFor={id!} hint={hint}>
      <textarea id={id} className={controlClasses} rows={3} {...props} />
    </Wrapper>
  );
}

export function Select({
  label,
  hint,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
}) {
  const id = props.id ?? props.name;
  return (
    <Wrapper label={label} htmlFor={id!} hint={hint}>
      <select id={id} className={controlClasses} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}
