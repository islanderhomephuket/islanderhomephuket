"use client";

import { useActionState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { loginAction } from "../actions";
import { Logo } from "@/components/brand/logo";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo markClassName="h-24 w-24" />
        </div>
        <form
          action={action}
          className="border border-charcoal-light bg-charcoal p-8"
        >
          <div className="flex items-center gap-2 text-gold">
            <Lock className="h-5 w-5" />
            <h1 className="font-display text-2xl font-semibold text-paper">
              Admin Access
            </h1>
          </div>
          <p className="mt-2 text-sm text-paper/50">
            Enter your password to manage properties, leads and the journal.
          </p>

          <label className="mt-6 block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-paper/60">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="••••••••"
              className="mt-2 h-12 w-full border border-charcoal-light bg-ink px-4 text-sm text-paper outline-none focus:border-gold"
            />
          </label>

          {state.error && (
            <p className="mt-4 text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-gold text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-paper/30">
            Default password is <code className="text-paper/50">changeme</code> —
            set <code className="text-paper/50">ADMIN_PASSWORD</code> in your env.
          </p>
        </form>
      </div>
    </div>
  );
}
