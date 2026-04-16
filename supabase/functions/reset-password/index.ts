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

    const { email, password } = await req.json();

    // List users and find by email
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = listData.users.find((u: any) => u.email === email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Utilizador não encontrado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
      });
    }

    // Delete and recreate user with new password
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: user.user_metadata
    });
    if (createError) throw createError;

    // Update profile to point to new user id
    await supabaseAdmin.from('profiles').update({ user_id: newUser.user.id }).eq('user_id', user.id);
    await supabaseAdmin.from('user_roles').update({ user_id: newUser.user.id }).eq('user_id', user.id);

    return new Response(JSON.stringify({ message: 'Senha atualizada com sucesso', user_id: newUser.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
    });
  }
});
