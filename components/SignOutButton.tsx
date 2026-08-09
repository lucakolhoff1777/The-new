"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm font-medium text-brand-100 hover:text-white"
    >
      Abmelden
    </button>
  );
}
