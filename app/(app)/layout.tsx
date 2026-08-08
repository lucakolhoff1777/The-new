import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-800 bg-brand-600">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-baseline gap-2">
              <span className="font-semibold tracking-tight text-white">
                {session.user.practiceName}
              </span>
              <span className="text-xs font-light text-brand-200">Zahnarzt Berichte</span>
            </Link>
            <nav className="flex gap-4 text-sm text-brand-100">
              <Link href="/dashboard" className="hover:text-white">Übersicht</Link>
              <Link href="/patients" className="hover:text-white">Patienten</Link>
              <Link href="/reports" className="hover:text-white">Berichte</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-brand-100">
            <span>{session.user.name}</span>
            <Link href="/settings" className="hover:text-white">Einstellungen</Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
