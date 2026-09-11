"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/utils/cn";
import type { InputProps } from "./types";

export const Input = ({
  className,
  wrapperClassName,
  name,
  label,
  labelClassName,
  asterisk = false,
  disabled,
  defaultValue,
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={name} className={cn("text-sm font-medium text-gray-900", labelClassName)}>
          {label}
          {asterisk && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        disabled={disabled}
        defaultValue={defaultValue}
        className={cn(
          "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
        {...register(name)}
        {...rest}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
