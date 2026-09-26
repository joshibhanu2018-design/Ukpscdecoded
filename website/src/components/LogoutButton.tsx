"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/student/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-graphite-700 px-4 py-2 text-sm font-medium text-graphite-300 transition-colors hover:border-danger-500/40 hover:text-danger-300 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" /> Log Out
    </button>
  );
}
