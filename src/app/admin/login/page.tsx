"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { ShieldCheck, Lock, Compass } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(password);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1A3739] dark:text-white flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <Logo variant="dark" height={38} className="mx-auto" showSubtext subtext="Staff Portal" />
          <p className="text-xs text-[#1A3739]/80 dark:text-neutral-400">
            Authorized admin access for verification and matchmaking.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-medium text-center">
            Invalid credentials. Use demo password: <code className="font-mono font-bold">admin123</code>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A3739] dark:text-neutral-200 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#1A3739]/50 dark:text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter staff password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50/50 dark:bg-neutral-900 text-sm text-[#1A3739] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#1A3739] dark:focus:ring-neutral-500"
              />
            </div>
            <span className="text-[11px] text-[#1A3739]/70 dark:text-neutral-400 mt-1 block">
              Demo access: use <code className="font-mono text-[#D7400B] font-bold">admin123</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider shadow-warm transition-all cursor-pointer"
          >
            Sign In with Password
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-[#1A3739] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] font-medium transition-colors"
          >
            ← Back to Get Linked Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
