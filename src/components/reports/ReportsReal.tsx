import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useStats } from "@/hooks/useStats";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, downloadPDF, previewPDF } from "@/utils/pdfGenerator";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  PieChart,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface ReportData {
  period: string;
  reportType: string;
  status: string;
  format: string;
}

export const ReportsReal = () => {
  const [reportData, setReportData] = useState<ReportData>({
    period: "",
    reportType: "",
    status: "all",
    format: "pdf"
  });
  const [generating, setGenerating] = useState(false);
  
  const { stats } = useStats();
  const { debts } = useDebts();
  const { clients } = useClients();
  const { toast } = useToast();

  const currentMonth = new Date().toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' });

  const reportSummary = useMemo(() => {
    const filteredDebts = debts.filter(debt => {
      if (reportData.status === 'all') return true;
      return debt.status === reportData.status;
    });

    const totalValue = filteredDebts.reduce((sum, debt) => sum + Number(debt.valor), 0);
    const count = filteredDebts.length;

    return { totalValue, count, debts: filteredDebts };
  }, [debts, reportData.status]);

  const generateReport = async () => {
    if (!reportData.period || !reportData.reportType) {
      toast({
        title: "Erro",
        description: "Selecione o período e tipo de relatório",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    
    try {
      if (reportData.format === 'pdf') {
        await generatePDFReport();
      } else if (reportData.format === 'csv') {
        generateCSVReport();
      } else {
        generateTextReport();
      }
      
      toast({
        title: "✅ Relatório gerado",
        description: `Relatório ${getReportTypeName(reportData.reportType)} em formato ${reportData.format.toUpperCase()} foi gerado com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateReportContent = () => {
    const { totalValue, count, debts: filteredDebts } = reportSummary;
    
    return `
RELATÓRIO NCANGAZA MULTISERVICES
===============================

Período: ${reportData.period}
Tipo: ${reportData.reportType}
Status: ${reportData.status === 'all' ? 'Todos' : reportData.status}
Data de Geração: ${new Date().toLocaleString('pt-MZ')}

RESUMO EXECUTIVO
================
Total de Registos: ${count}
Valor Total: ${formatCurrency(totalValue)}

ESTATÍSTICAS GERAIS
==================
Total de Clientes: ${stats.totalClients}
Total de Dívidas: ${stats.totalDebts}
Valor Total em Carteira: ${formatCurrency(stats.totalValue)}
Dívidas Pagas: ${stats.paidCount} (${formatCurrency(stats.paidValue)})
Dívidas Pendentes: ${stats.pendingCount} (${formatCurrency(stats.pendingValue)})
Dívidas Vencidas: ${stats.overdueCount} (${formatCurrency(stats.overdueValue)})

DETALHES DOS REGISTOS
====================
${filteredDebts.map((debt, index) => `
${index + 1}. ID: ${debt.id}
   Valor: ${formatCurrency(Number(debt.valor))}
   Status: ${debt.status}
   Data Vencimento: ${new Date(debt.data_vencimento).toLocaleDateString('pt-MZ')}
   Descrição: ${debt.descricao}
`).join('')}

---
Relatório gerado automaticamente pelo Sistema de Gestão de Dívidas
Ncangaza Multiservices - ${new Date().getFullYear()}
    `;
  };

  const getReportTypeName = (type: string) => {
    const names: Record<string, string> = {
      debts: 'Dívidas',
      clients: 'Clientes',
      payments: 'Pagamentos',
      overdue: 'Dívidas Vencidas',
      summary: 'Resumo Executivo',
      notifications: 'Notificações'
    };
    return names[type] || type;
  };

  const getPeriodName = (period: string) => {
    const names: Record<string, string> = {
      week: 'Última Semana',
      month: 'Último Mês',
      quarter: 'Último Trimestre',
      year: 'Último Ano',
      all: 'Todo o Período'
    };
    return names[period] || period;
  };

  const generatePDFReport = async () => {
    const { totalValue, count, debts: filteredDebts } = reportSummary;
    
    let headers: string[] = [];
    let data: any[][] = [];
    let summaryData = [
      { label: 'Total de Registos', value: count.toString() },
      { label: 'Valor Total', value: formatCurrency(totalValue) },
      { label: 'Período', value: getPeriodName(reportData.period) },
      { label: 'Status', value: reportData.status === 'all' ? 'Todos' : reportData.status }
    ];

    if (reportData.reportType === 'debts' || reportData.reportType === 'overdue') {
      headers = ['ID', 'Cliente', 'Descrição', 'Valor', 'Vencimento', 'Status'];
      data = filteredDebts.map(debt => {
        const client = clients.find(c => c.id === debt.cliente_id);
        return [
          debt.id.slice(0, 8),
          client?.nome || 'N/A',
          debt.descricao,
          formatCurrency(Number(debt.valor)),
          new Date(debt.data_vencimento).toLocaleDateString('pt-PT'),
          debt.status
        ];
      });
    } else if (reportData.reportType === 'clients') {
      headers = ['Nome', 'NUIT', 'Email', 'Telefone', 'Status'];
      data = clients.map(client => [
        client.nome,
        client.nuit || 'N/A',
        client.email || 'N/A',
        client.telefone || 'N/A',
        client.ativo ? 'Ativo' : 'Inativo'
      ]);
      summaryData = [
        { label: 'Total de Clientes', value: clients.length.toString() },
        { label: 'Clientes Ativos', value: clients.filter(c => c.ativo).length.toString() },
        { label: 'Período', value: getPeriodName(reportData.period) }
      ];
    } else if (reportData.reportType === 'summary') {
      headers = ['Métrica', 'Valor'];
      data = [
        ['Total de Clientes', stats.totalClients.toString()],
        ['Total de Dívidas', stats.totalDebts.toString()],
        ['Valor Total em Carteira', formatCurrency(stats.totalValue)],
        ['Dívidas Pagas', `${stats.paidCount} (${formatCurrency(stats.paidValue)})`],
        ['Dívidas Pendentes', `${stats.pendingCount} (${formatCurrency(stats.pendingValue)})`],
        ['Dívidas Vencidas', `${stats.overdueCount} (${formatCurrency(stats.overdueValue)})`],
      ];
      summaryData = [
        { label: 'Período de Análise', value: getPeriodName(reportData.period) },
        { label: 'Total em Carteira', value: formatCurrency(stats.totalValue) }
      ];
    }

    const doc = generatePDF(
      {
        title: `Relatório de ${getReportTypeName(reportData.reportType)}`,
        subtitle: `Período: ${getPeriodName(reportData.period)}`,
        orientation: headers.length > 4 ? 'landscape' : 'portrait',
        showLogo: true,
        filename: `relatorio_${reportData.reportType}`
      },
      headers,
      data,
      summaryData
    );

    downloadPDF(doc, `relatorio_${reportData.reportType}`);
  };

  const generateCSVReport = () => {
    const { debts: filteredDebts } = reportSummary;
    
    let csvContent = '';
    
    if (reportData.reportType === 'debts' || reportData.reportType === 'overdue') {
      csvContent = 'ID,Cliente,Descrição,Valor,Vencimento,Status\n';
      filteredDebts.forEach(debt => {
        const client = clients.find(c => c.id === debt.cliente_id);
        csvContent += `${debt.id},${client?.nome || 'N/A'},"${debt.descricao}",${debt.valor},${debt.data_vencimento},${debt.status}\n`;
      });
    } else if (reportData.reportType === 'clients') {
      csvContent = 'Nome,NUIT,Email,Telefone,Status\n';
      clients.forEach(client => {
        csvContent += `${client.nome},${client.nuit || 'N/A'},${client.email || 'N/A'},${client.telefone || 'N/A'},${client.ativo ? 'Ativo' : 'Inativo'}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${reportData.reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${reportData.reportType}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewReport = () => {
    if (reportData.format === 'pdf') {
      const { totalValue, count, debts: filteredDebts } = reportSummary;
      
      let headers: string[] = [];
      let data: any[][] = [];
      let summaryData = [
        { label: 'Total de Registos', value: count.toString() },
        { label: 'Valor Total', value: formatCurrency(totalValue) }
      ];

      if (reportData.reportType === 'debts' || reportData.reportType === 'overdue') {
        headers = ['ID', 'Cliente', 'Descrição', 'Valor', 'Vencimento', 'Status'];
        data = filteredDebts.slice(0, 10).map(debt => {
          const client = clients.find(c => c.id === debt.cliente_id);
          return [
            debt.id.slice(0, 8),
            client?.nome || 'N/A',
            debt.descricao,
            formatCurrency(Number(debt.valor)),
            new Date(debt.data_vencimento).toLocaleDateString('pt-PT'),
            debt.status
          ];
        });
      } else if (reportData.reportType === 'clients') {
        headers = ['Nome', 'NUIT', 'Email', 'Telefone'];
        data = clients.slice(0, 10).map(client => [
          client.nome,
          client.nuit || 'N/A',
          client.email || 'N/A',
          client.telefone || 'N/A'
        ]);
      }

      const doc = generatePDF(
        {
          title: `Pré-visualização: ${getReportTypeName(reportData.reportType)}`,
          subtitle: 'Mostrando primeiros 10 registos',
          orientation: 'portrait',
          showLogo: true
        },
        headers,
        data,
        summaryData
      );

      previewPDF(doc);
    } else {
      const content = generateReportContent();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Pré-visualização do Relatório</title>
              <style>
                body { 
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                  padding: 40px; 
                  line-height: 1.6;
                  background: #f5f5f5;
                }
                pre { 
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  white-space: pre-wrap;
                }
              </style>
            </head>
            <body>
              <pre>${content}</pre>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Relatórios</h2>
        <p className="text-muted-foreground">
          Relatórios detalhados e análises de performance da Ncangaza Multiservices
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Relatório Mensal
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalDebts} dívidas por status
            </p>
            <p className="text-sm font-medium mt-2">
              Total: {formatCurrency(stats.totalValue)}
            </p>
            <Button 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => {
                setReportData(prev => ({ ...prev, period: 'month', reportType: 'debts' }));
                generateReport();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Análise de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients} Clientes</div>
            <p className="text-xs text-muted-foreground">
              Performance e histórico
            </p>
            <p className="text-sm font-medium mt-2">
              Média: {formatCurrency(stats.totalValue / (stats.totalClients || 1))}
            </p>
            <Button 
              size="sm" 
              className="mt-3 w-full" 
              variant="outline"
              onClick={() => {
                setReportData(prev => ({ ...prev, period: 'month', reportType: 'clients' }));
                generateReport();
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status Overview
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Pagas
                </span>
                <span>{stats.paidCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-yellow-500" />
                  Pendentes
                </span>
                <span>{stats.pendingCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
                  Vencidas
                </span>
                <span>{stats.overdueCount}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="mt-3 w-full" 
              variant="secondary"
              onClick={() => {
                setReportData(prev => ({ ...prev, period: 'month', reportType: 'overdue' }));
                generateReport();
              }}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Análise
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Período</label>
                <Select value={reportData.period} onValueChange={(value) => setReportData(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                    <SelectItem value="quarter">Último trimestre</SelectItem>
                    <SelectItem value="year">Último ano</SelectItem>
                    <SelectItem value="all">Todo período</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={reportData.reportType} onValueChange={(value) => setReportData(prev => ({ ...prev, reportType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debts">Relatório de Dívidas</SelectItem>
                    <SelectItem value="clients">Relatório de Clientes</SelectItem>
                    <SelectItem value="payments">Relatório de Pagamentos</SelectItem>
                    <SelectItem value="overdue">Dívidas Vencidas</SelectItem>
                    <SelectItem value="summary">Resumo Executivo</SelectItem>
                    <SelectItem value="notifications">Histórico de Notificações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={reportData.status} onValueChange={(value) => setReportData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="paga">Pagas</SelectItem>
                    <SelectItem value="vencida">Vencidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Formato</label>
                <Select value={reportData.format} onValueChange={(value) => setReportData(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="PDF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {reportData.reportType && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Pré-visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p><strong>Registos encontrados:</strong> {reportSummary.count}</p>
                  <p><strong>Valor total:</strong> {formatCurrency(reportSummary.totalValue)}</p>
                  <p><strong>Período:</strong> {reportData.period || 'Não selecionado'}</p>
                  <p><strong>Tipo:</strong> {reportData.reportType}</p>
                  <p><strong>Status:</strong> {reportData.status === 'all' ? 'Todos' : reportData.status}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex space-x-2 mt-6">
            <Button 
              className="flex-1" 
              onClick={generateReport}
              disabled={generating || !reportData.period || !reportData.reportType}
            >
              <Download className="mr-2 h-4 w-4" />
              {generating ? "Gerando..." : "Gerar Relatório"}
            </Button>
            <Button 
              variant="outline"
              onClick={previewReport}
              disabled={!reportData.reportType}
            >
              <FileText className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};