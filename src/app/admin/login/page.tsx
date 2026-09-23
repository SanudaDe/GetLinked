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
    <div className="min-h-screen bg-[#E0DDAE] text-[#336467] flex items-center justify-center p-4">
      <div className="bg-[#ECE9C4] rounded-2xl border border-[#C8C488] p-8 max-w-md w-full shadow-warm space-y-6">
        <div className="text-center space-y-3">
          <Logo variant="dark" height={38} className="mx-auto" showSubtext subtext="Staff Portal" />
          <p className="text-xs text-[#336467]/80">
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
            <label className="block text-xs font-semibold text-[#336467] uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#336467]/50 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter staff password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#C8C488] bg-white text-sm text-[#336467] focus:outline-none focus:ring-2 focus:ring-[#336467]"
              />
            </div>
            <span className="text-[11px] text-[#336467]/70 mt-1 block">
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
            className="text-xs text-[#336467] hover:text-[#D7400B] font-medium transition-colors"
          >
            ← Back to Get Linked Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
