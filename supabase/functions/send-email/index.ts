import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message }: EmailRequest = await req.json();

    console.log("📧 Tentando enviar email para:", to);
    console.log("📋 Assunto:", subject);

    // Validar dados obrigatórios
    if (!to || !subject || !message) {
      console.error("❌ Dados incompletos:", { to, subject, hasMessage: !!message });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Dados incompletos: to, subject e message são obrigatórios" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error("❌ Email inválido:", to);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Email inválido" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Ncangaza Multiservices <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9fafb; padding: 30px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Ncangaza Multiservices</h1>
              </div>
              <div class="content">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <div class="footer">
                <p>Este é um email automático do sistema de gestão de dívidas.</p>
                <p>© ${new Date().getFullYear()} Ncangaza Multiservices. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("✅ Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      id: emailResponse.data?.id,
      message: "Email enviado com sucesso"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("❌ Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erro desconhecido ao enviar email"
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
