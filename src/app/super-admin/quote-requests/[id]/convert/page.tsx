"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { SuperAdminRequireAuth } from "@/components/SuperAdminRequireAuth/SuperAdminRequireAuth";
import {
  createPlanFromQuoteSchema,
  type CreatePlanFromQuoteFormValues,
} from "@/schemas/create-plan-from-quote.schema";
import { convertQuoteToPlan } from "@/services/super-admin.service";
import { cn } from "@/utils/cn";

const ENTITLEMENT_OPTIONS: { name: keyof CreatePlanFromQuoteFormValues; label: string }[] = [
  { name: "timeTracking", label: "Time Tracking" },
  { name: "advancedReports", label: "Advanced Reports" },
  { name: "hr", label: "HR" },
  { name: "customPermissions", label: "Custom Permissions" },
  { name: "screenshots", label: "Screenshots" },
];

// Doesn't use the shared Input component — that's styled for text fields,
// not a boolean toggle.
function EntitlementCheckbox({ name, label }: { name: keyof CreatePlanFromQuoteFormValues; label: string }) {
  const { register } = useFormContext<CreatePlanFromQuoteFormValues>();
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600" {...register(name)} />
      {label}
    </label>
  );
}

// A plain two-option toggle, not the searchable Select component — overkill
// for a binary MONTHLY/YEARLY choice.
function BillingCycleToggle() {
  const { watch, setValue } = useFormContext<CreatePlanFromQuoteFormValues>();
  const value = watch("billingCycle");

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-900">
        Billing Cycle<span className="ml-0.5 text-red-500">*</span>
      </span>
      <div className="flex gap-2">
        {(["MONTHLY", "YEARLY"] as const).map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => setValue("billingCycle", cycle, { shouldValidate: true })}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              value === cycle
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50",
            )}
          >
            {cycle === "MONTHLY" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConvertToPlanForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const methods = useForm<CreatePlanFromQuoteFormValues>({
    resolver: zodResolver(createPlanFromQuoteSchema),
    defaultValues: {
      name: "",
      basePrice: "",
      billingCycle: "MONTHLY",
      timeTracking: true,
      advancedReports: false,
      hr: false,
      customPermissions: false,
      screenshots: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreatePlanFromQuoteFormValues) => convertQuoteToPlan(id, data),
    onSuccess: () => {
      toast.success("Custom plan created from quote request.");
      router.push("/super-admin/dashboard");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Convert to Custom Plan</h1>
        <p className="mt-1 text-sm text-gray-500">Creates a CUSTOM plan scoped to this organization.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="name" label="Plan Name" asterisk placeholder="Acme Corp Custom" />
            <Input name="basePrice" label="Base Price" asterisk placeholder="499.00" />
            <BillingCycleToggle />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-900">Entitlements</span>
              {ENTITLEMENT_OPTIONS.map((opt) => (
                <EntitlementCheckbox key={opt.name} name={opt.name} label={opt.label} />
              ))}
            </div>

            <Button type="submit" size="lg" loading={isPending} loadingText="Creating plan...">
              Create Plan
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function ConvertToPlanPage() {
  return (
    <SuperAdminRequireAuth>
      <ConvertToPlanForm />
    </SuperAdminRequireAuth>
  );
}
