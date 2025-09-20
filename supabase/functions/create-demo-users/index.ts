import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@ncangaza.co.mz',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador Sistema'
      }
    })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
    } else {
      // Create admin profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: adminUser.user.id,
          full_name: 'Administrador Sistema',
          role: 'admin',
          active: true
        })
      
      if (profileError) {
        console.error('Error creating admin profile:', profileError)
      }
    }

    // Create regular user
    const { data: regularUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@ncangaza.co.mz',
      password: 'user123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuário Teste'
      }
    })

    if (userError) {
      console.error('Error creating regular user:', userError)
    } else {
      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: regularUser.user.id,
          full_name: 'Usuário Teste',
          role: 'user',
          active: true
        })
      
      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users created successfully',
        admin: adminUser?.user?.email,
        user: regularUser?.user?.email
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})