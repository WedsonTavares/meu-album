import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "neutral";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({
  children,
  className,
  variant = "neutral",
  icon,
  ...props
}: Props) {
  return (
    <button
      className={classNames(
        "btn",
        {
          primary: variant === "primary",
          ghost: variant === "ghost",
          danger: variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
