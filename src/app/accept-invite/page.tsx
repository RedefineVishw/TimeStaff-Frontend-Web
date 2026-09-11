"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { acceptInviteSchema, type AcceptInviteFormValues } from "@/schemas/accept-invite.schema";
import { acceptInvite } from "@/services/auth.service";

export default function AcceptInvitePage() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const methods = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { token, password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      toast.success("Invite accepted. You can now log in.");
      router.push("/login");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  if (!token) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Invalid invite link</h1>
        <p className="max-w-sm text-gray-500">This invite link is missing its token.</p>
        <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Set your password</h1>
        <p className="mt-1 text-sm text-gray-500">You&apos;ve been invited to join an organization on TimeStaff.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="password" type="password" label="Password" asterisk placeholder="••••••••" />

            <Button type="submit" size="lg" loading={isPending} loadingText="Setting password...">
              Accept Invite
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
