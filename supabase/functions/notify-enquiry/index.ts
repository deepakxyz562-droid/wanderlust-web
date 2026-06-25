// Sends an email notification when a new enquiry comes in.
// Uses Resend via the built-in RESEND_API_KEY secret provisioned by Lovable Cloud Emails.
// Requires a verified email domain — set one up at Cloud → Email.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const payload = (await req.json()) as EnquiryPayload;
    if (!payload?.name || !payload?.email || !payload?.message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: settings } = await supabase.from("settings").select("notify_email, email, company_name").limit(1).maybeSingle();
    const to = settings?.notify_email || settings?.email;
    const company = settings?.company_name || "Travel website";

    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipping email send. Set up Cloud → Email.");
      return new Response(JSON.stringify({ skipped: true, reason: "no_resend_key" }), { headers: { ...cors, "content-type": "application/json" } });
    }
    if (!to) {
      return new Response(JSON.stringify({ skipped: true, reason: "no_notify_email" }), { headers: { ...cors, "content-type": "application/json" } });
    }

    const resend = new Resend(resendKey);
    const fromDomain = Deno.env.get("RESEND_FROM") || "onboarding@resend.dev";

    const html = `
      <h2>New enquiry — ${company}</h2>
      <p><strong>${payload.name}</strong> &lt;${payload.email}&gt;${payload.phone ? ` · ${payload.phone}` : ""}</p>
      ${payload.subject ? `<p><em>${payload.subject}</em></p>` : ""}
      <p style="white-space:pre-line">${payload.message.replace(/</g, "&lt;")}</p>
    `;

    const { error } = await resend.emails.send({
      from: `${company} <${fromDomain}>`,
      to: [to],
      reply_to: payload.email,
      subject: `New enquiry: ${payload.name}${payload.subject ? ` — ${payload.subject}` : ""}`,
      html,
    });

    if (error) {
      console.error("Resend error", error);
      return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }
});
