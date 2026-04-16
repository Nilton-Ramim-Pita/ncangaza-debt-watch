import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { action, email, password, fullName, role } = await req.json();

    if (action === 'setup-user') {
      // Find or create user, ensure profile and role exist
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      let user = listData?.users?.find((u: any) => u.email === email);
      
      if (!user) {
        // Create user
        const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
          email, password, email_confirm: true,
          user_metadata: { full_name: fullName }
        });
        if (error) throw error;
        user = newUser.user;
      }

      // Ensure profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      
      if (!existingProfile) {
        await supabaseAdmin.from('profiles').insert({
          user_id: user.id, full_name: fullName || user.user_metadata?.full_name || email, active: true
        });
      }

      // Ensure role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles').select('id').eq('user_id', user.id).maybeSingle();
      
      if (!existingRole) {
        await supabaseAdmin.from('user_roles').insert({
          user_id: user.id, role: role || 'user'
        });
      }

      return new Response(JSON.stringify({ message: 'Utilizador configurado', user_id: user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
    });
  }
});
