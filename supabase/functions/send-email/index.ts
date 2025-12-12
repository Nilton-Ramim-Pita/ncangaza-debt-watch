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
  clientName?: string;
  debts?: Array<{
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
  }>;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'vencida': return '#DC2626';
    case 'pendente': return '#F59E0B';
    case 'paga': return '#10B981';
    default: return '#6B7280';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'vencida': return 'VENCIDA';
    case 'pendente': return 'PENDENTE';
    case 'paga': return 'PAGA';
    default: return status.toUpperCase();
  }
};

const generateDebtTableRows = (debts: EmailRequest['debts']): string => {
  if (!debts || debts.length === 0) return '';
  
  return debts.map(debt => `
    <tr>
      <td style="padding: 12px 15px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
        ${debt.descricao}
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right; font-weight: 600;">
        ${formatCurrency(debt.valor)}
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: center;">
        ${formatDate(debt.data_vencimento)}
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #f0f0f0; text-align: center;">
        <span style="
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
          background-color: ${getStatusColor(debt.status)};
        ">${getStatusLabel(debt.status)}</span>
      </td>
    </tr>
  `).join('');
};

const calculateTotal = (debts: EmailRequest['debts']): number => {
  if (!debts) return 0;
  return debts.reduce((sum, debt) => sum + debt.valor, 0);
};

const generateEmailTemplate = (data: EmailRequest): string => {
  const hasDebts = data.debts && data.debts.length > 0;
  const total = calculateTotal(data.debts);
  const overdueDebts = data.debts?.filter(d => d.status === 'vencida').length || 0;
  const pendingDebts = data.debts?.filter(d => d.status === 'pendente').length || 0;
  
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ncangaza Multiservices - Notificação</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          
          <!-- Header com Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #E53935 0%, #C62828 100%); padding: 40px 30px; text-align: center;">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
                border-radius: 16px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
              ">
                <div style="
                  width: 80px;
                  height: 80px;
                  background: white;
                  border-radius: 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <span style="font-size: 42px; font-weight: 900; color: #E53935; font-family: Arial Black, sans-serif;">N</span>
                </div>
              </div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                NCANGAZA MULTISERVICES
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-style: italic; letter-spacing: 1px;">
                Qualidade & Excelência
              </p>
            </td>
          </tr>
          
          <!-- Saudação -->
          <tr>
            <td style="padding: 35px 30px 20px;">
              <h2 style="margin: 0 0 10px; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                Prezado(a) ${data.clientName || 'Cliente'},
              </h2>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #E53935, #FF5252); border-radius: 2px;"></div>
            </td>
          </tr>
          
          <!-- Mensagem Principal -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <p style="margin: 0; color: #444; font-size: 15px; line-height: 1.7;">
                ${data.message.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>
          
          ${hasDebts ? `
          <!-- Resumo de Dívidas -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <div style="display: flex; gap: 15px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    ${overdueDebts > 0 ? `
                    <td style="width: 33%; padding-right: 10px;">
                      <div style="background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%); border-radius: 12px; padding: 15px; text-align: center; border-left: 4px solid #DC2626;">
                        <p style="margin: 0; font-size: 24px; font-weight: 700; color: #DC2626;">${overdueDebts}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #B71C1C; text-transform: uppercase; letter-spacing: 0.5px;">Vencidas</p>
                      </div>
                    </td>
                    ` : ''}
                    ${pendingDebts > 0 ? `
                    <td style="width: 33%; padding: 0 5px;">
                      <div style="background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); border-radius: 12px; padding: 15px; text-align: center; border-left: 4px solid #F59E0B;">
                        <p style="margin: 0; font-size: 24px; font-weight: 700; color: #F59E0B;">${pendingDebts}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">Pendentes</p>
                      </div>
                    </td>
                    ` : ''}
                    <td style="width: 33%; padding-left: 10px;">
                      <div style="background: linear-gradient(135deg, #E53935 0%, #C62828 100%); border-radius: 12px; padding: 15px; text-align: center;">
                        <p style="margin: 0; font-size: 18px; font-weight: 700; color: white;">${formatCurrency(total)}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.5px;">Total</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Tabela de Dívidas -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                📋 Detalhes das Dívidas
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #e5e5e5;">
                <thead>
                  <tr style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                    <th style="padding: 14px 15px; text-align: left; font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">Descrição</th>
                    <th style="padding: 14px 15px; text-align: right; font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">Valor</th>
                    <th style="padding: 14px 15px; text-align: center; font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">Vencimento</th>
                    <th style="padding: 14px 15px; text-align: center; font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateDebtTableRows(data.debts)}
                </tbody>
                <tfoot>
                  <tr style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);">
                    <td colspan="2" style="padding: 14px 15px; font-size: 14px; font-weight: 700; color: white;">
                      TOTAL A PAGAR
                    </td>
                    <td colspan="2" style="padding: 14px 15px; text-align: right; font-size: 18px; font-weight: 700; color: #FF5252;">
                      ${formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="margin: 0 0 20px; color: #666; font-size: 14px;">
                Para regularizar a sua situação, entre em contacto connosco:
              </p>
              <a href="tel:+258876450559" style="
                display: inline-block;
                background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
                color: white;
                text-decoration: none;
                padding: 14px 35px;
                border-radius: 30px;
                font-size: 15px;
                font-weight: 600;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);
              ">
                📞 Contactar Agora
              </a>
            </td>
          </tr>
          
          <!-- Linha Divisória -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #ddd, transparent);"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px; color: #888; font-size: 13px;">
                      <strong style="color: #E53935;">Ncangaza Multiservices</strong>
                    </p>
                    <p style="margin: 0 0 5px; color: #999; font-size: 12px;">
                      📍 B. Francisco Manyanga, Tete - Moçambique
                    </p>
                    <p style="margin: 0 0 5px; color: #999; font-size: 12px;">
                      📞 +258 87 645 0559 | ✉️ info@ncangaza.co.mz
                    </p>
                    <p style="margin: 15px 0 0; color: #bbb; font-size: 11px;">
                      © ${new Date().getFullYear()} Ncangaza Multiservices. Todos os direitos reservados.
                    </p>
                    <p style="margin: 8px 0 0; color: #ccc; font-size: 10px;">
                      Este é um email automático do Sistema de Gestão de Dívidas.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: EmailRequest = await req.json();

    console.log("📧 Tentando enviar email para:", requestData.to);
    console.log("📋 Assunto:", requestData.subject);
    console.log("👤 Cliente:", requestData.clientName);
    console.log("💰 Dívidas:", requestData.debts?.length || 0);

    // Validar dados obrigatórios
    if (!requestData.to || !requestData.subject || !requestData.message) {
      console.error("❌ Dados incompletos:", { to: requestData.to, subject: requestData.subject, hasMessage: !!requestData.message });
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
    if (!emailRegex.test(requestData.to)) {
      console.error("❌ Email inválido:", requestData.to);
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
      to: [requestData.to],
      subject: requestData.subject,
      html: generateEmailTemplate(requestData),
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
