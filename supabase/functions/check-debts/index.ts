import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting debt check...");

    // Update debt status (call the existing SQL function)
    const { error: updateError } = await supabase.rpc('update_debt_status');
    
    if (updateError) {
      console.error("Error updating debt status:", updateError);
      throw updateError;
    }

    console.log("Debt status updated successfully");

    // Get overdue debts with client information
    const { data: overdueDebts, error: debtsError } = await supabase
      .from('dividas')
      .select(`
        id,
        valor,
        descricao,
        data_vencimento,
        cliente_id,
        clientes (
          nome,
          email
        )
      `)
      .eq('status', 'vencida');

    if (debtsError) {
      console.error("Error fetching overdue debts:", debtsError);
      throw debtsError;
    }

    console.log(`Found ${overdueDebts?.length || 0} overdue debts`);

    // Get notification templates
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('is_default', true);

    if (templatesError) {
      console.error("Error fetching templates:", templatesError);
      throw templatesError;
    }

    const emailTemplate = templates?.find(t => t.type === 'email');
    const inAppTemplate = templates?.find(t => t.type === 'in_app');

    let emailsSent = 0;
    let notificationsCreated = 0;

    // Process each overdue debt
    for (const debt of overdueDebts || []) {
      const clientName = debt.clientes?.nome || 'Cliente';
      const clientEmail = debt.clientes?.email;

      // Replace template variables
      const replaceVars = (text: string) => {
        return text
          .replace(/{{cliente_nome}}/g, clientName)
          .replace(/{{valor}}/g, debt.valor.toLocaleString('pt-MZ'))
          .replace(/{{data_vencimento}}/g, new Date(debt.data_vencimento).toLocaleDateString('pt-MZ'))
          .replace(/{{descricao}}/g, debt.descricao);
      };

      // Send email if client has email
      if (clientEmail && emailTemplate) {
        try {
          const emailSubject = replaceVars(emailTemplate.subject);
          const emailBody = replaceVars(emailTemplate.body);

          const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              to: clientEmail,
              subject: emailSubject,
              message: emailBody,
            }),
          });

          if (emailResponse.ok) {
            console.log(`Email sent to ${clientEmail}`);
            emailsSent++;

            // Record email notification
            await supabase.from('notificacoes').insert({
              divida_id: debt.id,
              tipo: 'email',
              status: 'enviada',
              mensagem: emailBody,
              data_envio: new Date().toISOString(),
              data_agendamento: new Date().toISOString(),
            });
          } else {
            const errorText = await emailResponse.text();
            console.error(`Failed to send email to ${clientEmail}:`, errorText);
            
            // Record failed notification
            await supabase.from('notificacoes').insert({
              divida_id: debt.id,
              tipo: 'email',
              status: 'erro',
              mensagem: emailBody,
              erro: errorText,
              data_agendamento: new Date().toISOString(),
            });
          }
        } catch (error: any) {
          console.error(`Error sending email to ${clientEmail}:`, error.message);
          
          // Record failed notification
          await supabase.from('notificacoes').insert({
            divida_id: debt.id,
            tipo: 'email',
            status: 'erro',
            mensagem: emailTemplate.body,
            erro: error.message,
            data_agendamento: new Date().toISOString(),
          });
        }
      }

      // Create in-app notification
      if (inAppTemplate) {
        try {
          const notificationMessage = replaceVars(inAppTemplate.body);

          await supabase.from('notificacoes').insert({
            divida_id: debt.id,
            tipo: 'in_app',
            status: 'enviada',
            mensagem: notificationMessage,
            data_envio: new Date().toISOString(),
            data_agendamento: new Date().toISOString(),
          });

          notificationsCreated++;
          console.log(`In-app notification created for debt ${debt.id}`);
        } catch (error: any) {
          console.error(`Error creating in-app notification:`, error.message);
        }
      }
    }

    const result = {
      success: true,
      debtsChecked: overdueDebts?.length || 0,
      emailsSent,
      notificationsCreated,
      timestamp: new Date().toISOString(),
    };

    console.log("Debt check completed:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in check-debts function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
