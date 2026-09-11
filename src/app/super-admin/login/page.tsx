"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import {
  superAdminLoginSchema,
  type SuperAdminLoginFormValues,
} from "@/schemas/super-admin-login.schema";
import { superAdminLogin } from "@/services/super-admin.service";
import { useSuperAdminStore } from "@/zustand/super-admin.store";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const setSession = useSuperAdminStore((s) => s.setSession);

  const methods = useForm<SuperAdminLoginFormValues>({
    resolver: zodResolver(superAdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: superAdminLogin,
    onSuccess: ({ accessToken, superAdmin }) => {
      setSession(accessToken, superAdmin);
      router.push("/super-admin/dashboard");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Separate login from the regular TimeStaff account system.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="email" type="email" label="Email" asterisk placeholder="admin@timestaff.app" />
            <Input name="password" type="password" label="Password" asterisk placeholder="••••••••" />

            <Button type="submit" size="lg" loading={isPending} loadingText="Logging in...">
              Login
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
