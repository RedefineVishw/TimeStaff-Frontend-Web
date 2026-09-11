"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";

export default function RegisterSuccessPage() {
  const email = useSearchParams().get("email");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <MailCheck size={28} />
      </span>
      <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
      <p className="max-w-sm text-gray-500">
        We&apos;ve sent a verification link
        {email ? (
          <>
            {" "}
            to <span className="font-medium text-gray-900">{email}</span>
          </>
        ) : null}
        . Click it to activate your account.
      </p>
      <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
        Back to login
      </Link>
    </div>
  );
}
