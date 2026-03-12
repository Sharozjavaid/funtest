"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar } from "@/components/ui/Avatar";

export function Navbar() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;
  if (pathname === "/" && (loading || !user)) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-sand shadow-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-honey">
          <img src="/mascot.png" alt="" className="h-8 w-auto rounded-lg" />
          BarkBoard
        </Link>

        {!loading && user && (
          <div className="flex items-center gap-3">
            <Link
              href="/new"
              className="bg-honey text-white px-3 py-1.5 rounded-2xl text-sm font-heading font-semibold hover:bg-honey-dark transition-colors"
            >
              + Post
            </Link>
            <Link
              href="/spots"
              className="text-bark-light hover:text-bark text-sm font-semibold transition-colors"
            >
              Spots
            </Link>
            <Link href={`/profile/${user.uid}`}>
              <Avatar
                src={user.avatarUrl}
                alt={user.displayName}
                size="sm"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="text-bark-light hover:text-bark text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
