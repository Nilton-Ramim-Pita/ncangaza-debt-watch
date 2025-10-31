import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  Calendar,
  Loader2,
  FileDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientForm, type ClientFormData } from "@/components/forms/ClientForm";
import { useClients, Client } from "@/hooks/useClients";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { generatePDF, downloadPDF } from "@/utils/pdfGenerator";

export const ClientsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();

  // Filtrar clientes baseado no termo de pesquisa
  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.nuit && client.nuit.includes(searchTerm)) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClient = async (clientData: ClientFormData) => {
    const result = await createClient(clientData);
    if (result.success) {
      setShowClientForm(false);
    }
  };

  const handleEditClient = async (clientData: ClientFormData) => {
    if (!editingClient) return;
    const result = await updateClient(editingClient.id, clientData);
    if (result.success) {
      setShowClientForm(false);
      setEditingClient(null);
    }
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo 
      ? <Badge className="bg-success text-success-foreground">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  const handleExportPDF = () => {
    const headers = ['Nome', 'NUIT', 'Email', 'Telefone', 'Status'];
    const data = filteredClients.map(client => [
      client.nome,
      client.nuit || 'N/A',
      client.email || 'N/A',
      client.telefone || 'N/A',
      client.ativo ? 'Ativo' : 'Inativo'
    ]);

    const doc = generatePDF(
      {
        title: 'Relatório de Clientes',
        subtitle: `Total de clientes: ${filteredClients.length}`,
        orientation: 'portrait'
      },
      headers,
      data
    );

    downloadPDF(doc, 'relatorio_clientes');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h2>
          <p className="text-muted-foreground">
            Gestão completa da base de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={filteredClients.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowClientForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Clientes
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, NUIT ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>NUIT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">Carregando clientes...</p>
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{client.nome}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{client.nuit || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        {client.telefone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {new Date(client.created_at).toLocaleDateString("pt-MZ")}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.ativo)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingClient(client);
                            setShowClientForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar Cliente</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja eliminar o cliente "{client.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClient(client.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <ClientForm 
        open={showClientForm}
        onOpenChange={(open) => {
          setShowClientForm(open);
          if (!open) setEditingClient(null);
        }}
        onSubmit={editingClient ? handleEditClient : handleAddClient}
        initialData={editingClient ? {
          nome: editingClient.nome,
          nuit: editingClient.nuit || '',
          email: editingClient.email || '',
          telefone: editingClient.telefone || '',
          endereco: editingClient.endereco || '',
          ativo: editingClient.ativo,
        } : undefined}
      />
    </div>
  );
};