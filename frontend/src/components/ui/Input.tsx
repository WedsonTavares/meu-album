import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: Props) {
  return (
    <div className="input-field">
      <label>
        {label}
        {props.required && <span style={{ color: "var(--primary)" }}> *</span>}
      </label>
      <input className="input" {...props} />
      {hint && !error && (
        <span className="muted" style={{ fontSize: 13 }}>
          {hint}
        </span>
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
