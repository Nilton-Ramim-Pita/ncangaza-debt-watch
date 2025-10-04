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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Creating admin user...');

    // Check if admin already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUser?.users?.some(u => u.email === 'admin@ncangaza.co.mz');

    if (adminExists) {
      console.log('Admin user already exists');
      return new Response(
        JSON.stringify({ message: 'Admin user already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@ncangaza.co.mz',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador'
      }
    });

    if (adminError) {
      console.error('Error creating admin user:', adminError);
      throw adminError;
    }

    console.log('Admin user created:', adminUser.user.id);

    // Create profile for admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: adminUser.user.id,
        full_name: 'Administrador',
        active: true
      });

    if (profileError) {
      console.error('Error creating admin profile:', profileError);
      throw profileError;
    }

    console.log('Admin profile created');

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: adminUser.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      throw roleError;
    }

    console.log('Admin role assigned successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully',
        email: 'admin@ncangaza.co.mz',
        password: 'Admin@123'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in create-admin function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});