import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  labelClassName?: string;
  asterisk?: boolean;
  wrapperClassName?: string;
}
