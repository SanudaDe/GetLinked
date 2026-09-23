"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (data.session) {
          // Redirect authenticated creator or stay to their status / portal
          router.replace("/status");
        } else {
          router.replace("/");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setErrorMsg(message);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#E0DDAE] text-[#336467] flex items-center justify-center p-6">
      <div className="bg-[#ECE9C4] rounded-2xl border border-[#C8C488] p-8 max-w-sm w-full text-center space-y-4 shadow-warm">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto font-bold text-xl">
              ✕
            </div>
            <h3 className="font-serif text-lg text-[#336467]">Sign In Error</h3>
            <p className="text-xs text-[#336467]/80">{errorMsg}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#D7400B] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Return Home
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-3 border-[#336467] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-serif text-lg text-[#336467]">Signing you in...</h3>
            <p className="text-xs text-[#336467]/75">Connecting with your Google Account</p>
          </>
        )}
      </div>
    </div>
  );
}
