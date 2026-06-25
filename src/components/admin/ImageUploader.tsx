import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Bucket = "tours" | "destinations" | "blogs" | "banners";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadToBucket(file: File, bucket: Bucket, folder = "") {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder ? folder.replace(/\/$/, "") + "/" : ""}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, TEN_YEARS);
  if (signErr) throw signErr;
  return { url: data.signedUrl, path };
}

export function ImageUploader({
  name,
  bucket,
  defaultUrl,
  label = "Featured image",
}: {
  name: string;
  bucket: Bucket;
  defaultUrl?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(file: File) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Max 8MB");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadToBucket(file, bucket);
      setUrl(url);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url ? (
          <div className="relative group">
            <img src={url} alt="" className="h-20 w-32 rounded object-cover border" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="h-20 w-32 rounded border border-dashed bg-muted/30 grid place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
            {busy ? "Uploading…" : url ? "Replace" : "Upload"}
          </Button>
          <Input
            placeholder="…or paste image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
