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
    <div className="min-h-screen bg-teal-950 flex items-center justify-center p-4">
      <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 max-w-md w-full shadow-elevated space-y-6">
        <div className="text-center space-y-3">
          <Logo variant="dark" height={38} className="mx-auto" showSubtext subtext="Staff Portal" />
          <p className="text-xs text-ink-600">
            Authorized admin access for verification and matchmaking.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center">
            Invalid credentials. Use demo password: <code className="font-mono font-bold">admin123</code>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter staff password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>
            <span className="text-[11px] text-ink-500 mt-1 block">
              Demo access: use <code className="font-mono text-teal-900">admin123</code> or <code className="font-mono text-teal-900">getlinked2026</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
          >
            Sign In to Staff Workspace
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-teal-900 hover:text-gold-600 font-medium"
          >
            ← Back to Get Linked Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
