import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DOMAIN_ID = "3617b41b-0242-42e2-bbcc-6bc6842f7776";
const DOMAIN_NAME = "ncangaza.mz";
const NOTIFY_EMAIL = "ramimpita65@gmail.com";

interface ResendRecord {
  record: string;
  name: string;
  type: string;
  value: string;
  status: string;
  priority?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY ausente");

    // 1. Triggers a re-verification on Resend
    await fetch(`https://api.resend.com/domains/${DOMAIN_ID}/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    }).catch(() => null);

    // 2. Read current status
    const res = await fetch(`https://api.resend.com/domains/${DOMAIN_ID}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    const domain = await res.json();
    const records: ResendRecord[] = domain.records || [];
    const allVerified = domain.status === "verified" &&
      records.every((r) => r.status === "verified");

    console.log(`🔍 Estado domínio ${DOMAIN_NAME}:`, domain.status, records.map((r) => `${r.record}=${r.status}`).join(", "));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (!allVerified) {
      return new Response(
        JSON.stringify({ verified: false, status: domain.status, records: records.map((r) => ({ record: r.record, name: r.name, status: r.status })) }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // 3. Already notified? Check notificacoes for marker
    const { data: existing } = await supabase
      .from("notificacoes")
      .select("id")
      .eq("tipo", "dominio_verificado")
      .limit(1)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ verified: true, alreadyNotified: true }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // 4. Switch the from address automatically by writing a flag (we'll also email the admin)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; border-radius: 12px; color: white; text-align: center;">
          <h1 style="margin: 0;">✅ Domínio Verificado</h1>
          <p style="margin: 10px 0 0;">${DOMAIN_NAME}</p>
        </div>
        <div style="padding: 20px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
          <p>Todos os registos DNS (DKIM, SPF, MX) de <strong>${DOMAIN_NAME}</strong> ficaram <strong>verdes</strong> no Resend.</p>
          <p>O sistema já pode enviar emails como <strong>noreply@${DOMAIN_NAME}</strong> para qualquer destinatário.</p>
          <ul>
            ${records.map((r) => `<li>${r.record} (${r.type}) — ✅ ${r.status}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;

    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ncangaza Multiservices <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `✅ Domínio ${DOMAIN_NAME} verificado no Resend`,
        html,
      }),
    });
    const sendData = await sendRes.json();
    console.log("📧 Email de aviso:", sendData);

    // 5. Mark as notified
    await supabase.from("notificacoes").insert({
      tipo: "dominio_verificado",
      mensagem: `Domínio ${DOMAIN_NAME} verificado no Resend. Emails podem agora ser enviados de noreply@${DOMAIN_NAME}.`,
      data_agendamento: new Date().toISOString(),
      data_envio: new Date().toISOString(),
      status: "enviada",
    });

    return new Response(
      JSON.stringify({ verified: true, notified: true, sendData }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err: any) {
    console.error("❌ check-domain-status erro:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
