"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import {
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "@/schemas/resend-verification.schema";
import { resendVerification } from "@/services/auth.service";

export default function ResendVerificationPage() {
  const [sent, setSent] = useState(false);

  const methods = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resendVerification,
    // Backend deliberately returns the same generic response whether the
    // email exists or not — nothing more specific to branch on here.
    onSuccess: () => setSent(true),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  if (sent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <MailCheck size={28} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
        <p className="max-w-sm text-gray-500">If that email needs verifying, a new link has been sent.</p>
        <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Resend verification link</h1>
        <p className="mt-1 text-sm text-gray-500">Enter the email you registered with.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="email" type="email" label="Email" asterisk placeholder="jane@company.com" />

            <Button type="submit" size="lg" loading={isPending} loadingText="Sending...">
              Resend Link
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
