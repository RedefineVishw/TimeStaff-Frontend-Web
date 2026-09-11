"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/register.schema";
import { registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Registration successful! Check your email to verify your account.");
      router.push(`/register/success?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Start your free TimeStaff workspace.
        </p>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="First Name"
                asterisk
                placeholder="Jane"
              />
              <Input
                name="lastName"
                label="Last Name"
                asterisk
                placeholder="Doe"
              />
            </div>
            <Input
              name="email"
              type="email"
              label="Work Email"
              asterisk
              placeholder="jane@company.com"
            />
            <Input
              name="password"
              type="password"
              label="Password"
              asterisk
              placeholder="••••••••"
            />

            <Button
              type="submit"
              size="lg"
              loading={isPending}
              loadingText="Creating account..."
            >
              Create Account
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
