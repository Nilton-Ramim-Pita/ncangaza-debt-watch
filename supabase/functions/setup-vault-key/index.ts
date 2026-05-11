import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

    // Remover entrada anterior (se existir) e criar nova
    await admin.rpc("exec_sql" as any, {}).catch(() => {});

    // Usar SQL direto via PostgREST não funciona — usar função vault diretamente
    const { data: existing } = await admin
      .from("vault.secrets" as any)
      .select("id")
      .eq("name", "service_role_key")
      .maybeSingle();

    if (existing) {
      const { error } = await admin.rpc("vault_update_secret" as any, {
        p_name: "service_role_key",
        p_secret: serviceKey,
      });
      if (error) throw error;
    } else {
      const { error } = await admin.rpc("vault_create_secret" as any, {
        p_name: "service_role_key",
        p_secret: serviceKey,
      });
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
