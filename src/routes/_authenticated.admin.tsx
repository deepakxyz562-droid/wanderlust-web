import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Pencil, Trash2, Loader2, ExternalLink, Copy, Image as ImageIcon, LayoutDashboard, Settings as SettingsIcon, FolderOpen, Map, MapPin, BookOpen, Inbox, Building2, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/etb-logo.png.asset.json";
import { SITE } from "@/lib/site";
import { ImageUploader, uploadToBucket } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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
        <Tabs defaultValue="dashboard">
          <TabsList className="bg-card flex-wrap h-auto">
            <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4 mr-1" />Dashboard</TabsTrigger>
            <TabsTrigger value="tours"><Map className="h-4 w-4 mr-1" />Tours</TabsTrigger>
            <TabsTrigger value="destinations"><MapPin className="h-4 w-4 mr-1" />Destinations</TabsTrigger>
            <TabsTrigger value="cities"><Building2 className="h-4 w-4 mr-1" />Cities</TabsTrigger>
            <TabsTrigger value="blogs"><BookOpen className="h-4 w-4 mr-1" />Blog</TabsTrigger>
            <TabsTrigger value="enquiries"><Inbox className="h-4 w-4 mr-1" />Enquiries</TabsTrigger>
            <TabsTrigger value="media"><FolderOpen className="h-4 w-4 mr-1" />Media</TabsTrigger>
            <TabsTrigger value="settings"><SettingsIcon className="h-4 w-4 mr-1" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6"><DashboardAdmin /></TabsContent>
          <TabsContent value="tours" className="mt-6"><ToursAdmin /></TabsContent>
          <TabsContent value="destinations" className="mt-6"><DestinationsAdmin /></TabsContent>
          <TabsContent value="cities" className="mt-6"><CitiesAdmin /></TabsContent>
          <TabsContent value="blogs" className="mt-6"><BlogsAdmin /></TabsContent>
          <TabsContent value="enquiries" className="mt-6"><EnquiriesAdmin /></TabsContent>
          <TabsContent value="media" className="mt-6"><MediaAdmin /></TabsContent>
          <TabsContent value="settings" className="mt-6"><SettingsAdmin /></TabsContent>
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
          <ImageUploader name="featured_image" bucket="tours" defaultUrl={tour?.featured_image} />
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
          <ImageUploader name="featured_image" bucket="destinations" defaultUrl={destination?.featured_image} />
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
          <Field label="Content"><RichTextEditor name="content" defaultValue={post?.content ?? ""} bucket="blogs" /></Field>
          <ImageUploader name="featured_image" bucket="blogs" defaultUrl={post?.featured_image} />
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
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => (await supabase.from("enquiries").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const list = useMemo(() => {
    const arr = (data ?? []) as any[];
    const ql = q.trim().toLowerCase();
    return arr.filter((e) => {
      if (filter !== "all" && (e.status ?? "new") !== filter) return false;
      if (!ql) return true;
      return [e.name, e.email, e.phone, e.subject, e.message].some((f) => String(f ?? "").toLowerCase().includes(ql));
    });
  }, [data, q, filter]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "contacted" ? "Marked as contacted" : "Reopened");
    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
  }

  return (
    <div className="rounded-2xl bg-card border shadow-card overflow-hidden">
      <div className="p-5 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl text-primary">Enquiries</h2>
          <span className="text-xs text-muted-foreground">{list.length} shown</span>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "new", "contacted"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 text-xs rounded-full border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 pl-7 w-56" />
          </div>
        </div>
      </div>
      {isLoading && <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>}
      <ul className="divide-y">
        {list.map((e: any) => {
          const contacted = e.status === "contacted";
          return (
            <li key={e.id} className="p-5 grid gap-2">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {e.name}
                    <span className="text-muted-foreground font-normal">· {e.email}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${contacted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{contacted ? "contacted" : "new"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()} · {e.phone ?? "no phone"}</div>
                  {e.subject && <div className="text-sm text-primary mt-1">{e.subject}</div>}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setStatus(e.id, contacted ? "new" : "contacted")}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />{contacted ? "Reopen" : "Contacted"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    if (!confirm("Delete enquiry?")) return;
                    const { error } = await supabase.from("enquiries").delete().eq("id", e.id);
                    if (error) return toast.error(error.message);
                    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
                  }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-line text-foreground/80">{e.message}</p>
            </li>
          );
        })}
        {!isLoading && list.length === 0 && <li className="p-8 text-center text-muted-foreground">No enquiries match.</li>}
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

/* ---------- CITIES ---------- */
function CitiesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: async () => (await supabase.from("cities").select("*, destinations(title)").order("sort_order").order("name")).data ?? [],
  });
  const destOptions = useQuery({
    queryKey: ["admin-dest-options"],
    queryFn: async () => (await supabase.from("destinations").select("id,title").order("title")).data ?? [],
  });
  return (
    <ListShell
      title="Cities (Explore the city)"
      isLoading={isLoading}
      action={<CityDialog destinations={destOptions.data ?? []} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-cities"] })} />}
    >
      {(data ?? []).map((c: any) => (
        <Row
          key={c.id}
          title={c.name}
          subtitle={`${c.destinations?.title ?? "—"} · /${c.slug} · ${c.is_published ? "Published" : "Draft"}`}
          image={c.featured_image}
          edit={<CityDialog city={c} destinations={destOptions.data ?? []} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-cities"] })} />}
          onDelete={async () => {
            if (!confirm(`Delete "${c.name}"?`)) return;
            const { error } = await supabase.from("cities").delete().eq("id", c.id);
            if (error) return toast.error(error.message);
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["admin-cities"] });
          }}
        />
      ))}
    </ListShell>
  );
}

function CityDialog({ city, destinations, onSaved }: { city?: any; destinations: { id: string; title: string }[]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const editing = !!city;
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const destination_id = String(fd.get("destination_id") ?? "");
    if (!name) return toast.error("Name required");
    if (!destination_id) return toast.error("Destination required");
    const payload: any = {
      name,
      destination_id,
      slug: String(fd.get("slug") ?? "") || slugify(name),
      short_description: String(fd.get("short_description") ?? ""),
      description: String(fd.get("description") ?? ""),
      featured_image: String(fd.get("featured_image") ?? "") || null,
      sort_order: Number(fd.get("sort_order")) || 0,
      is_published: fd.get("is_published") === "on",
    };
    setBusy(true);
    const res = editing
      ? await supabase.from("cities").update(payload).eq("id", city.id)
      : await supabase.from("cities").insert(payload);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false); onSaved();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing ? <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button> : <Button className="bg-primary text-primary-foreground hover:bg-primary-glow"><Plus className="h-4 w-4 mr-1" /> New city</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "Edit city" : "New city"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input name="name" required defaultValue={city?.name} /></Field>
            <Field label="Destination *">
              <select name="destination_id" required defaultValue={city?.destination_id ?? ""} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                <option value="">— Select —</option>
                {destinations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug"><Input name="slug" defaultValue={city?.slug} placeholder="auto from name" /></Field>
            <Field label="Sort order"><Input name="sort_order" type="number" defaultValue={city?.sort_order ?? 0} /></Field>
          </div>
          <Field label="Short description"><Input name="short_description" defaultValue={city?.short_description ?? ""} /></Field>
          <Field label="Full description"><Textarea name="description" rows={5} defaultValue={city?.description ?? ""} /></Field>
          <ImageUploader name="featured_image" bucket="destinations" defaultUrl={city?.featured_image} label="City image" />
          <label className="flex items-center gap-2 text-sm"><Switch name="is_published" defaultChecked={city?.is_published ?? true} /> Published</label>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary-glow">
              {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} {editing ? "Save changes" : "Create city"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- DASHBOARD ---------- */
function DashboardAdmin() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [tours, dests, blogs, enq, recent] = await Promise.all([
        supabase.from("tours").select("id", { count: "exact", head: true }),
        supabase.from("destinations").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(8),
      ]);
      return {
        tours: tours.count ?? 0,
        destinations: dests.count ?? 0,
        blogs: blogs.count ?? 0,
        enquiries: enq.count ?? 0,
        recent: recent.data ?? [],
      };
    },
  });
  const cards = [
    { label: "Tours", value: data?.tours ?? 0, icon: Map, to: "tours" as const },
    { label: "Destinations", value: data?.destinations ?? 0, icon: MapPin, to: "destinations" as const },
    { label: "Blog Posts", value: data?.blogs ?? 0, icon: BookOpen, to: "blogs" as const },
    { label: "Enquiries", value: data?.enquiries ?? 0, icon: Inbox, to: "enquiries" as const },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-card border shadow-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{c.label}</div>
              <c.icon className="h-5 w-5 text-gold" />
            </div>
            <div className="font-display text-3xl text-primary mt-2">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-card border shadow-card overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-display text-xl text-primary">Recent enquiries</h2>
        </div>
        <ul className="divide-y">
          {(data?.recent ?? []).map((e: any) => (
            <li key={e.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium truncate">{e.name} <span className="text-xs text-muted-foreground">· {e.email}</span></div>
                <div className="text-xs text-muted-foreground truncate">{e.subject || e.message}</div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{new Date(e.created_at).toLocaleDateString()}</span>
            </li>
          ))}
          {(data?.recent ?? []).length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No enquiries yet.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ---------- SETTINGS ---------- */
function SettingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => (await supabase.from("settings").select("*").limit(1).maybeSingle()).data,
  });
  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      company_name: String(fd.get("company_name") ?? "Europe Tourism Bureau"),
      tagline: String(fd.get("tagline") ?? "") || null,
      description: String(fd.get("description") ?? "") || null,
      email: String(fd.get("email") ?? "") || null,
      phone: String(fd.get("phone") ?? "") || null,
      whatsapp_number: String(fd.get("whatsapp_number") ?? "") || null,
      address: String(fd.get("address") ?? "") || null,
      logo_url: String(fd.get("logo_url") ?? "") || null,
      instagram_url: String(fd.get("instagram_url") ?? "") || null,
      facebook_url: String(fd.get("facebook_url") ?? "") || null,
      twitter_url: String(fd.get("twitter_url") ?? "") || null,
      youtube_url: String(fd.get("youtube_url") ?? "") || null,
      linkedin_url: String(fd.get("linkedin_url") ?? "") || null,
      notify_email: String(fd.get("notify_email") ?? "") || null,
    };
    setBusy(true);
    const res = data?.id
      ? await supabase.from("settings").update(payload).eq("id", data.id)
      : await supabase.from("settings").insert({ ...payload, singleton: true });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-card border shadow-card p-6 space-y-5 max-w-3xl">
      <h2 className="font-display text-xl text-primary">Site settings</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company name"><Input name="company_name" defaultValue={data?.company_name ?? ""} required /></Field>
        <Field label="Tagline"><Input name="tagline" defaultValue={data?.tagline ?? ""} /></Field>
      </div>
      <Field label="Description"><Textarea name="description" rows={2} defaultValue={data?.description ?? ""} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email"><Input name="email" type="email" defaultValue={data?.email ?? ""} /></Field>
        <Field label="Notify email (new enquiries)"><Input name="notify_email" type="email" defaultValue={data?.notify_email ?? ""} placeholder="ops@yoursite.com" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone"><Input name="phone" defaultValue={data?.phone ?? ""} /></Field>
        <Field label="WhatsApp number (intl, no +)"><Input name="whatsapp_number" defaultValue={data?.whatsapp_number ?? ""} placeholder="447700000000" /></Field>
      </div>
      <Field label="Address"><Input name="address" defaultValue={data?.address ?? ""} /></Field>
      <ImageUploader name="logo_url" bucket="banners" defaultUrl={data?.logo_url} label="Logo" />
      <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t">
        <Field label="Instagram URL"><Input name="instagram_url" defaultValue={data?.instagram_url ?? ""} /></Field>
        <Field label="Facebook URL"><Input name="facebook_url" defaultValue={data?.facebook_url ?? ""} /></Field>
        <Field label="Twitter / X URL"><Input name="twitter_url" defaultValue={data?.twitter_url ?? ""} /></Field>
        <Field label="YouTube URL"><Input name="youtube_url" defaultValue={data?.youtube_url ?? ""} /></Field>
        <Field label="LinkedIn URL"><Input name="linkedin_url" defaultValue={data?.linkedin_url ?? ""} /></Field>
      </div>
      <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary-glow">
        {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Save settings
      </Button>
    </form>
  );
}

/* ---------- MEDIA LIBRARY ---------- */
const MEDIA_BUCKETS = ["tours", "destinations", "blogs", "banners"] as const;
type MediaBucket = (typeof MEDIA_BUCKETS)[number];

function MediaAdmin() {
  const [bucket, setBucket] = useState<MediaBucket>("tours");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {MEDIA_BUCKETS.map((b) => (
          <button key={b} onClick={() => setBucket(b)} className={`px-3 py-1.5 text-sm rounded-full border ${bucket === b ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>
            {b}
          </button>
        ))}
      </div>
      <MediaBucketView bucket={bucket} />
    </div>
  );
}

function MediaBucketView({ bucket }: { bucket: MediaBucket }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["media", bucket],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(bucket).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      const files = (data ?? []).filter((f) => f.name && !f.name.endsWith("/"));
      const signed = await Promise.all(
        files.map(async (f) => {
          const { data: s } = await supabase.storage.from(bucket).createSignedUrl(f.name, 60 * 60 * 24 * 365);
          return { name: f.name, url: s?.signedUrl ?? "", size: (f as any).metadata?.size as number | undefined };
        }),
      );
      return signed;
    },
  });

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        await uploadToBucket(f, bucket);
      }
      toast.success(`Uploaded ${files.length} file(s)`);
      qc.invalidateQueries({ queryKey: ["media", bucket] });
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["media", bucket] });
  }

  return (
    <div className="rounded-2xl bg-card border shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-primary capitalize">{bucket}</h2>
        <label className="inline-flex items-center gap-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary-glow px-3 py-2 cursor-pointer">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Upload
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { onPick(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {(data ?? []).map((f) => (
            <div key={f.name} className="group relative rounded-lg overflow-hidden border bg-muted/30">
              <img src={f.url} alt={f.name} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => { navigator.clipboard.writeText(f.url); toast.success("URL copied"); }} className="bg-white text-primary p-2 rounded-full" title="Copy URL"><Copy className="h-4 w-4" /></button>
                <a href={f.url} target="_blank" rel="noreferrer" className="bg-white text-primary p-2 rounded-full" title="Open"><ExternalLink className="h-4 w-4" /></a>
                <button type="button" onClick={() => remove(f.name)} className="bg-white text-destructive p-2 rounded-full" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="p-1.5 text-[10px] text-muted-foreground truncate" title={f.name}>{f.name}</div>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-8 flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 opacity-40" />
              No files yet. Upload your first image.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
