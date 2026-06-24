import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.asset.json";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${SITE.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}
function toArr(s: string) {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
}

function AdminPage() {
  const { user, isAdmin } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!isAdmin) toast.warning("You're signed in but don't have admin access.");
  }, [isAdmin]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-primary text-primary-foreground">
        <div className="container-page h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="" width={36} height={36} className="h-9 w-9 rounded bg-white p-0.5" />
            <span className="font-display text-lg">Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="opacity-80 hover:text-gold inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> View site</Link>
            <span className="opacity-70 hidden md:inline">{user?.email}</span>
            <Button onClick={signOut} variant="outline" size="sm" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-primary">
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        {!isAdmin && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
            Your account doesn't have admin privileges yet. Ask an existing admin to grant access, or remove all admins and sign up again as the first user.
          </div>
        )}
        <Tabs defaultValue="tours">
          <TabsList className="bg-card">
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="blogs">Blog posts</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          </TabsList>
          <TabsContent value="tours" className="mt-6"><ToursAdmin /></TabsContent>
          <TabsContent value="destinations" className="mt-6"><DestinationsAdmin /></TabsContent>
          <TabsContent value="blogs" className="mt-6"><BlogsAdmin /></TabsContent>
          <TabsContent value="enquiries" className="mt-6"><EnquiriesAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------- TOURS ---------- */
function ToursAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: async () => (await supabase.from("tours").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const destOptions = useQuery({
    queryKey: ["admin-dest-options"],
    queryFn: async () => (await supabase.from("destinations").select("id,title").order("title")).data ?? [],
  });

  return (
    <ListShell
      title="Tours"
      isLoading={isLoading}
      action={<TourDialog destinations={destOptions.data ?? []} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-tours"] })} />}
    >
      {(data ?? []).map((t) => (
        <Row
          key={t.id}
          title={t.title}
          subtitle={`/${t.slug} · ${t.duration_days ?? "?"} days · ${t.is_published ? "Published" : "Draft"}`}
          image={t.featured_image}
          edit={<TourDialog tour={t} destinations={destOptions.data ?? []} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-tours"] })} />}
          onDelete={async () => {
            if (!confirm(`Delete "${t.title}"?`)) return;
            const { error } = await supabase.from("tours").delete().eq("id", t.id);
            if (error) return toast.error(error.message);
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["admin-tours"] });
          }}
        />
      ))}
    </ListShell>
  );
}

function TourDialog({ tour, destinations, onSaved }: { tour?: any; destinations: { id: string; title: string }[]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const editing = !!tour;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return toast.error("Title required");
    const payload: any = {
      title,
      slug: String(fd.get("slug") ?? slugify(title)) || slugify(title),
      destination_id: String(fd.get("destination_id") ?? "") || null,
      short_description: String(fd.get("short_description") ?? ""),
      description: String(fd.get("description") ?? ""),
      duration_days: Number(fd.get("duration_days")) || null,
      price_from: Number(fd.get("price_from")) || null,
      currency: String(fd.get("currency") ?? "EUR"),
      highlights: toArr(String(fd.get("highlights") ?? "")),
      inclusions: toArr(String(fd.get("inclusions") ?? "")),
      exclusions: toArr(String(fd.get("exclusions") ?? "")),
      featured_image: String(fd.get("featured_image") ?? "") || null,
      seo_title: String(fd.get("seo_title") ?? "") || null,
      seo_description: String(fd.get("seo_description") ?? "") || null,
      is_published: fd.get("is_published") === "on",
      is_featured: fd.get("is_featured") === "on",
    };
    setBusy(true);
    const res = editing
      ? await supabase.from("tours").update(payload).eq("id", tour.id)
      : await supabase.from("tours").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing
          ? <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button>
          : <Button className="bg-primary text-primary-foreground hover:bg-primary-glow"><Plus className="h-4 w-4 mr-1" /> New tour</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit tour" : "New tour"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title *"><Input name="title" required defaultValue={tour?.title} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug"><Input name="slug" defaultValue={tour?.slug} placeholder="auto from title" /></Field>
            <Field label="Destination">
              <select name="destination_id" defaultValue={tour?.destination_id ?? ""} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                <option value="">— None —</option>
                {destinations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Short description"><Input name="short_description" defaultValue={tour?.short_description ?? ""} maxLength={300} /></Field>
          <Field label="Full description"><Textarea name="description" rows={5} defaultValue={tour?.description ?? ""} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Duration (days)"><Input name="duration_days" type="number" min="1" defaultValue={tour?.duration_days ?? ""} /></Field>
            <Field label="Price from"><Input name="price_from" type="number" min="0" step="0.01" defaultValue={tour?.price_from ?? ""} /></Field>
            <Field label="Currency"><Input name="currency" defaultValue={tour?.currency ?? "EUR"} maxLength={3} /></Field>
          </div>
          <Field label="Highlights (one per line)"><Textarea name="highlights" rows={3} defaultValue={(tour?.highlights ?? []).join("\n")} /></Field>
          <Field label="Inclusions (one per line)"><Textarea name="inclusions" rows={3} defaultValue={(tour?.inclusions ?? []).join("\n")} /></Field>
          <Field label="Exclusions (one per line)"><Textarea name="exclusions" rows={2} defaultValue={(tour?.exclusions ?? []).join("\n")} /></Field>
          <Field label="Featured image URL"><Input name="featured_image" defaultValue={tour?.featured_image ?? ""} placeholder="https://..." /></Field>
          <Field label="SEO title"><Input name="seo_title" defaultValue={tour?.seo_title ?? ""} /></Field>
          <Field label="SEO description"><Textarea name="seo_description" rows={2} defaultValue={tour?.seo_description ?? ""} /></Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch name="is_published" defaultChecked={tour?.is_published ?? true} /> Published</label>
            <label className="flex items-center gap-2 text-sm"><Switch name="is_featured" defaultChecked={tour?.is_featured ?? false} /> Featured</label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary-glow">
              {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} {editing ? "Save changes" : "Create tour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- DESTINATIONS ---------- */
function DestinationsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: async () => (await supabase.from("destinations").select("*").order("title")).data ?? [],
  });
  return (
    <ListShell title="Destinations" isLoading={isLoading} action={<DestinationDialog onSaved={() => qc.invalidateQueries({ queryKey: ["admin-destinations"] })} />}>
      {(data ?? []).map((d) => (
        <Row key={d.id}
          title={d.title}
          subtitle={`${d.country ?? ""} · /${d.slug} · ${d.is_published ? "Published" : "Draft"}`}
          image={d.featured_image}
          edit={<DestinationDialog destination={d} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-destinations"] })} />}
          onDelete={async () => {
            if (!confirm(`Delete "${d.title}"?`)) return;
            const { error } = await supabase.from("destinations").delete().eq("id", d.id);
            if (error) return toast.error(error.message);
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["admin-destinations"] });
          }}
        />
      ))}
    </ListShell>
  );
}

function DestinationDialog({ destination, onSaved }: { destination?: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const editing = !!destination;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return toast.error("Title required");
    const payload: any = {
      title,
      slug: String(fd.get("slug") ?? "") || slugify(title),
      country: String(fd.get("country") ?? ""),
      short_description: String(fd.get("short_description") ?? ""),
      description: String(fd.get("description") ?? ""),
      featured_image: String(fd.get("featured_image") ?? "") || null,
      seo_title: String(fd.get("seo_title") ?? "") || null,
      seo_description: String(fd.get("seo_description") ?? "") || null,
      is_published: fd.get("is_published") === "on",
      is_featured: fd.get("is_featured") === "on",
    };
    setBusy(true);
    const res = editing
      ? await supabase.from("destinations").update(payload).eq("id", destination.id)
      : await supabase.from("destinations").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false); onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing ? <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button> : <Button className="bg-primary text-primary-foreground hover:bg-primary-glow"><Plus className="h-4 w-4 mr-1" /> New destination</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit destination" : "New destination"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title *"><Input name="title" required defaultValue={destination?.title} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug"><Input name="slug" defaultValue={destination?.slug} /></Field>
            <Field label="Country"><Input name="country" defaultValue={destination?.country ?? ""} /></Field>
          </div>
          <Field label="Short description"><Input name="short_description" defaultValue={destination?.short_description ?? ""} /></Field>
          <Field label="Full description"><Textarea name="description" rows={5} defaultValue={destination?.description ?? ""} /></Field>
          <Field label="Featured image URL"><Input name="featured_image" defaultValue={destination?.featured_image ?? ""} /></Field>
          <Field label="SEO title"><Input name="seo_title" defaultValue={destination?.seo_title ?? ""} /></Field>
          <Field label="SEO description"><Textarea name="seo_description" rows={2} defaultValue={destination?.seo_description ?? ""} /></Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch name="is_published" defaultChecked={destination?.is_published ?? true} /> Published</label>
            <label className="flex items-center gap-2 text-sm"><Switch name="is_featured" defaultChecked={destination?.is_featured ?? false} /> Featured</label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary-glow">
              {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} {editing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- BLOGS ---------- */
function BlogsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => (await supabase.from("blogs").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <ListShell title="Blog posts" isLoading={isLoading} action={<BlogDialog onSaved={() => qc.invalidateQueries({ queryKey: ["admin-blogs"] })} />}>
      {(data ?? []).map((b) => (
        <Row key={b.id}
          title={b.title}
          subtitle={`/${b.slug} · ${b.is_published ? "Published" : "Draft"} · ${b.author_name ?? "—"}`}
          image={b.featured_image}
          edit={<BlogDialog post={b} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-blogs"] })} />}
          onDelete={async () => {
            if (!confirm(`Delete "${b.title}"?`)) return;
            const { error } = await supabase.from("blogs").delete().eq("id", b.id);
            if (error) return toast.error(error.message);
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["admin-blogs"] });
          }}
        />
      ))}
    </ListShell>
  );
}

function BlogDialog({ post, onSaved }: { post?: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const editing = !!post;
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return toast.error("Title required");
    const payload: any = {
      title,
      slug: String(fd.get("slug") ?? "") || slugify(title),
      excerpt: String(fd.get("excerpt") ?? ""),
      content: String(fd.get("content") ?? ""),
      author_name: String(fd.get("author_name") ?? "") || null,
      featured_image: String(fd.get("featured_image") ?? "") || null,
      seo_title: String(fd.get("seo_title") ?? "") || null,
      seo_description: String(fd.get("seo_description") ?? "") || null,
      is_published: fd.get("is_published") === "on",
    };
    setBusy(true);
    const res = editing
      ? await supabase.from("blogs").update(payload).eq("id", post.id)
      : await supabase.from("blogs").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false); onSaved();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing ? <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button> : <Button className="bg-primary text-primary-foreground hover:bg-primary-glow"><Plus className="h-4 w-4 mr-1" /> New post</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title *"><Input name="title" required defaultValue={post?.title} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug"><Input name="slug" defaultValue={post?.slug} /></Field>
            <Field label="Author"><Input name="author_name" defaultValue={post?.author_name ?? ""} /></Field>
          </div>
          <Field label="Excerpt"><Textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} /></Field>
          <Field label="Content"><Textarea name="content" rows={10} defaultValue={post?.content ?? ""} /></Field>
          <Field label="Featured image URL"><Input name="featured_image" defaultValue={post?.featured_image ?? ""} /></Field>
          <Field label="SEO title"><Input name="seo_title" defaultValue={post?.seo_title ?? ""} /></Field>
          <Field label="SEO description"><Textarea name="seo_description" rows={2} defaultValue={post?.seo_description ?? ""} /></Field>
          <label className="flex items-center gap-2 text-sm"><Switch name="is_published" defaultChecked={post?.is_published ?? true} /> Published</label>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary-glow">
              {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} {editing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- ENQUIRIES ---------- */
function EnquiriesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => (await supabase.from("enquiries").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const list = useMemo(() => data ?? [], [data]);
  return (
    <div className="rounded-2xl bg-card border shadow-card overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="font-display text-xl text-primary">Enquiries</h2>
        <span className="text-xs text-muted-foreground">{list.length} total</span>
      </div>
      {isLoading && <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>}
      <ul className="divide-y">
        {list.map((e) => (
          <li key={e.id} className="p-5 grid gap-2">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-semibold">{e.name} <span className="text-muted-foreground font-normal">· {e.email}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()} · {e.phone ?? "no phone"}</div>
                {e.subject && <div className="text-sm text-primary mt-1">{e.subject}</div>}
              </div>
              <Button size="sm" variant="ghost" onClick={async () => {
                if (!confirm("Delete enquiry?")) return;
                const { error } = await supabase.from("enquiries").delete().eq("id", e.id);
                if (error) return toast.error(error.message);
                qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
              }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <p className="text-sm whitespace-pre-line text-foreground/80">{e.message}</p>
          </li>
        ))}
        {!isLoading && list.length === 0 && <li className="p-8 text-center text-muted-foreground">No enquiries yet.</li>}
      </ul>
    </div>
  );
}

/* ---------- shared ---------- */
function ListShell({ title, children, action, isLoading }: { title: string; children: React.ReactNode; action: React.ReactNode; isLoading?: boolean }) {
  return (
    <div className="rounded-2xl bg-card border shadow-card overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="font-display text-xl text-primary">{title}</h2>
        {action}
      </div>
      {isLoading ? <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div> : <ul className="divide-y">{children}</ul>}
    </div>
  );
}
function Row({ title, subtitle, image, edit, onDelete }: { title: string; subtitle: string; image?: string | null; edit: React.ReactNode; onDelete: () => void }) {
  return (
    <li className="p-4 flex items-center gap-4">
      <div className="h-14 w-20 rounded bg-muted overflow-hidden shrink-0">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2">
        {edit}
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </li>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
