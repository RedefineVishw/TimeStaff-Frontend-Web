"use client";

import React from "react";

import { Loader } from "@/components/Loader/Loader";
import { cn } from "@/utils/cn";
import { buttonVariants, type ButtonProps } from "./types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      loading = false,
      loadingText,
      icon,
      iconPosition = "left",
      disabled,
      className,
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const content = loading && loadingText ? loadingText : children;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...buttonProps}
      >
        {(icon || loading) && iconPosition === "left" && (
          <span className={cn("flex items-center", content && "mr-1")}>
            {loading ? <Loader /> : icon}
          </span>
        )}

        {content}

        {(icon || loading) && iconPosition === "right" && (
          <span className={cn("flex items-center", content && "ml-1")}>
            {loading ? <Loader /> : icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
