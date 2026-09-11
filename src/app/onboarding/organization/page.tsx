"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import { createOrganizationSchema, type CreateOrganizationFormValues } from "@/schemas/organization.schema";
import { createOrganization } from "@/services/organizations.service";
import { getMe } from "@/services/auth.service";
import { useAuthStore } from "@/zustand/auth.store";

function CreateOrganizationForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Already has an org — nothing to do on this page, send them onward.
  useEffect(() => {
    if (user?.organization) router.replace("/onboarding/plan");
  }, [user, router]);

  const methods = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrganization,
    onSuccess: async () => {
      toast.success("Organization created.");
      setUser(await getMe());
      router.push("/onboarding/plan");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  if (user?.organization) return null;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Create your organization</h1>
        <p className="mt-1 text-sm text-gray-500">This is the workspace your team will work in.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="name" label="Organization Name" asterisk placeholder="Acme Inc." />

            <Button type="submit" size="lg" loading={isPending} loadingText="Creating...">
              Continue
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function OnboardingOrganizationPage() {
  return (
    <RequireAuth>
      <CreateOrganizationForm />
    </RequireAuth>
  );
}
