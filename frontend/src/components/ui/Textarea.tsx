import { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, ...props }: Props) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <textarea className="textarea" rows={4} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
