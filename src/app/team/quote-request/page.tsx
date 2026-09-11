"use client";

import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import {
  createQuoteRequestSchema,
  type CreateQuoteRequestFormValues,
} from "@/schemas/quote-request.schema";
import { createQuoteRequest } from "@/services/organizations.service";
import { useAuthStore } from "@/zustand/auth.store";

function QuoteRequestForm() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organization?.id;

  const methods = useForm<CreateQuoteRequestFormValues>({
    resolver: zodResolver(createQuoteRequestSchema),
    defaultValues: { notes: "", contactPhone: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateQuoteRequestFormValues) => createQuoteRequest(organizationId!, data),
    onSuccess: () => {
      toast.success("Quote request submitted. Our team will be in touch.");
      methods.reset();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Request a custom plan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tell us what you need and our team will follow up with a tailored plan.
        </p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="notes" label="Notes" placeholder="e.g. 50 seats, custom SSO" />
            <Input name="contactPhone" label="Contact Phone" placeholder="+91 9876543210" />

            <Button type="submit" size="lg" loading={isPending} loadingText="Submitting...">
              Submit Request
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/dashboard" className="font-medium text-indigo-600 hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function QuoteRequestPage() {
  return (
    <RequireAuth>
      <QuoteRequestForm />
    </RequireAuth>
  );
}
