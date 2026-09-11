"use client";

import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Select } from "@/components/Select/Select";
import { Loader } from "@/components/Loader/Loader";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import { inviteUserSchema, type InviteUserFormValues } from "@/schemas/invite.schema";
import { inviteUser } from "@/services/organizations.service";
import { getRoles } from "@/services/roles.service";
import { useAuthStore } from "@/zustand/auth.store";

function InviteTeammateForm() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organization?.id;

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const methods = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { email: "", firstName: "", lastName: "", roleId: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: InviteUserFormValues) => inviteUser(organizationId!, data),
    onSuccess: () => {
      toast.success("Invite sent.");
      methods.reset();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  if (rolesLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader className="h-6 w-6 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Invite a teammate</h1>
        <p className="mt-1 text-sm text-gray-500">They&apos;ll get an email to set their password.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input name="firstName" label="First Name" asterisk placeholder="Jane" />
              <Input name="lastName" label="Last Name" asterisk placeholder="Doe" />
            </div>
            <Input name="email" type="email" label="Email" asterisk placeholder="jane@company.com" />
            <Select
              name="roleId"
              label="Role"
              asterisk
              placeholder="Choose a role"
              options={roles?.map((r) => ({ label: r.name, value: r.id }))}
            />

            <Button type="submit" size="lg" loading={isPending} loadingText="Sending invite...">
              Send Invite
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

export default function InviteTeammatePage() {
  return (
    <RequireAuth>
      <InviteTeammateForm />
    </RequireAuth>
  );
}
