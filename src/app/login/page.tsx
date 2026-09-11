"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { getMe, loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/zustand/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      // Login's own response only carries organizationId, not the full
      // organization object — fetch the canonical shape once, from the one
      // place (getMe) that also backs session restore on refresh.
      const user = await getMe();
      setUser(user);

      if (!user.organization) {
        router.push("/onboarding/organization");
      } else if (user.organization.status !== "ACTIVE") {
        router.push("/onboarding/plan");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to your TimeStaff workspace.</p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Input name="email" type="email" label="Work Email" asterisk placeholder="jane@company.com" />
            <Input name="password" type="password" label="Password" asterisk placeholder="••••••••" />

            <Button type="submit" size="lg" loading={isPending} loadingText="Logging in...">
              Login
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Didn&apos;t get a verification email?{" "}
          <Link href="/resend-verification" className="font-medium text-indigo-600 hover:underline">
            Resend it
          </Link>
        </p>
      </div>
    </div>
  );
}
