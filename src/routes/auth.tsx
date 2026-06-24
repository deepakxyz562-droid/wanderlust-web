import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Admin Sign in — ${SITE.name}` },
      { name: "description", content: "Admin sign in for the Europe Tourism Bureau dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setBusy(true);
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success(mode === "signin" ? "Welcome back!" : "Account created — signing in...");
    navigate({ to: "/admin", replace: true });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (result.error) toast.error(result.error.message);
  }

  return (
    <SiteLayout>
      <section className="container-page py-20 max-w-md">
        <div className="rounded-2xl bg-card p-8 shadow-elegant border">
          <h1 className="font-display text-3xl text-primary text-center">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">Admin dashboard access.</p>
          <Button type="button" onClick={google} variant="outline" className="w-full mt-6">
            Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" /></div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary-glow">
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>New here? <button onClick={() => setMode("signup")} className="text-primary underline">Create account</button></>
            ) : (
              <>Have an account? <button onClick={() => setMode("signin")} className="text-primary underline">Sign in</button></>
            )}
          </div>
          <p className="mt-6 text-[11px] text-center text-muted-foreground">The first account created automatically becomes the site administrator.</p>
          <Link to="/" className="block mt-4 text-center text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
