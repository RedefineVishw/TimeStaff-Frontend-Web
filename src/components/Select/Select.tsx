"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Check, ChevronDown } from "lucide-react";

import { Loader } from "@/components/Loader/Loader";
import { cn } from "@/utils/cn";
import type { SelectProps } from "./types";

export const Select = ({
  name,
  label,
  labelClassName,
  asterisk = false,
  wrapperClassName,
  className,
  disabled,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  options: staticOptions,
  loadOptions,
}: SelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(staticOptions ?? []);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const error = errors[name]?.message as string | undefined;

  // Keep in sync if the caller passes a new static array later.
  useEffect(() => {
    if (!loadOptions && staticOptions) setOptions(staticOptions);
  }, [staticOptions, loadOptions]);

  // Close on outside click.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lazily fetch on first open, not on mount — a page with several Selects
  // shouldn't fire every dropdown's request up front.
  const handleOpen = async () => {
    setOpen(true);
    if (loadOptions && !fetched) {
      setLoading(true);
      try {
        setOptions(await loadOptions());
        setFetched(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={cn("flex flex-col gap-1.5", wrapperClassName)}
      ref={wrapperRef}
    >
      {label && (
        <label
          htmlFor={name}
          className={cn("text-sm font-medium text-gray-900", labelClassName)}
        >
          {label}
          {asterisk && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selected = options.find((opt) => opt.value === field.value);

          return (
            <div className="relative">
              <button
                type="button"
                id={name}
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : handleOpen())}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
                  error && "border-red-500 focus-visible:ring-red-500",
                  className,
                )}
              >
                <span className={cn(!selected && "text-gray-400")}>
                  {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-gray-500 transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>

              {open && (
                <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-100 p-2">
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                    />
                  </div>

                  <ul className="max-h-60 overflow-y-auto py-1">
                    {loading ? (
                      <li className="flex items-center justify-center py-4">
                        <Loader />
                      </li>
                    ) : filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(opt.value);
                              setOpen(false);
                              setSearch("");
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {opt.label}
                            {opt.value === field.value && (
                              <Check size={14} className="text-blue-600" />
                            )}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-sm text-gray-400 italic">
                        No results found.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
