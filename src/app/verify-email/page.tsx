"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";

import { Loader } from "@/components/Loader/Loader";
import { verifyEmail } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token");

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (t: string) => verifyEmail(t),
  });

  // Verification tokens are single-use — React's Strict Mode double-invokes
  // effects in dev, which would otherwise fire this twice: the first call
  // succeeds and consumes the token, the second then legitimately gets
  // "invalid/expired" and can clobber the success state if it settles
  // second. This ref guarantees exactly one call per token no matter how
  // many times the effect re-runs.
  const hasFired = useRef(false);
  useEffect(() => {
    if (token && !hasFired.current) {
      hasFired.current = true;
      mutate(token);
    }
    // Only ever needs to run once per token — mutate is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <StatusScreen
        icon={<XCircle size={28} />}
        title="Invalid link"
        message="This verification link is missing its token."
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader className="h-6 w-6 text-indigo-600" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <StatusScreen
        icon={<CheckCircle2 size={28} />}
        iconClassName="bg-green-50 text-green-600"
        title="Email verified"
        message="Your account is now active. You can log in."
        action={
          <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
            Continue to login
          </Link>
        }
      />
    );
  }

  if (isError) {
    return (
      <StatusScreen
        icon={<XCircle size={28} />}
        iconClassName="bg-red-50 text-red-600"
        title="Verification failed"
        message={error instanceof Error ? error.message : "This link is invalid or has expired."}
        action={
          <Link href="/resend-verification" className="text-sm font-medium text-indigo-600 hover:underline">
            Request a new link
          </Link>
        }
      />
    );
  }

  return null;
}

function StatusScreen({
  icon,
  iconClassName = "bg-indigo-50 text-indigo-600",
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span className={`flex h-14 w-14 items-center justify-center rounded-full ${iconClassName}`}>{icon}</span>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="max-w-sm text-gray-500">{message}</p>
      {action}
    </div>
  );
}
