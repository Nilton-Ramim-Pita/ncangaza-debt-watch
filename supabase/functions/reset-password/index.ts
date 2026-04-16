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

    const { email, password, fullName, role, action } = await req.json();

    if (action === 'reset') {
      // Find user by email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      
      const user = users.find(u => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Utilizador não encontrado' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUser(user.id, { password: password });
      if (error) throw error;

      return new Response(JSON.stringify({ message: 'Senha atualizada', user_id: user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'create') {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { full_name: fullName }
      });
      if (createError) throw createError;

      await supabaseAdmin.from('profiles').insert({
        user_id: newUser.user.id, full_name: fullName, active: true
      });

      await supabaseAdmin.from('user_roles').insert({
        user_id: newUser.user.id, role: role || 'user'
      });

      return new Response(JSON.stringify({ message: 'Utilizador criado', user_id: newUser.user.id }), {
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
