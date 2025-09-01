import { useState } from "react";
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
  CreditCard, 
  Phone, 
  Mail,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  nuit: string;
  phone: string;
  email: string;
  registrationDate: string;
  totalDebt: number;
  paidDebt: number;
  overdueDebt: number;
  status: "ativo" | "inativo";
}

const mockClients: Client[] = [
  {
    id: "C001",
    name: "João Mutema Silva",
    nuit: "123456789",
    phone: "+258 84 123 4567",
    email: "joao.silva@email.com",
    registrationDate: "2023-06-15",
    totalDebt: 345000,
    paidDebt: 270000,
    overdueDebt: 75000,
    status: "ativo"
  },
  {
    id: "C002",
    name: "Maria Joaquina Banda",
    nuit: "987654321",
    phone: "+258 87 987 6543",
    email: "maria.banda@email.com",
    registrationDate: "2023-08-22",
    totalDebt: 128000,
    paidDebt: 86000,
    overdueDebt: 0,
    status: "ativo"
  },
  {
    id: "C003",
    name: "Carlos Mandlate Nhongo",
    nuit: "456789123",
    phone: "+258 82 456 7890",
    email: "carlos.nhongo@email.com",
    registrationDate: "2023-09-10",
    totalDebt: 287000,
    paidDebt: 159000,
    overdueDebt: 128000,
    status: "ativo"
  },
  {
    id: "C004",
    name: "Ana Cristina Macome",
    nuit: "789123456",
    phone: "+258 85 321 6540",
    email: "ana.macome@email.com",  
    registrationDate: "2023-07-03",
    totalDebt: 89500,
    paidDebt: 89500,
    overdueDebt: 0,
    status: "ativo"
  },
  {
    id: "C005",
    name: "Pedro Antônio Machel",
    nuit: "321654987",
    phone: "+258 86 654 3210",
    email: "pedro.machel@email.com",
    registrationDate: "2023-05-18",
    totalDebt: 412000,
    paidDebt: 256000,
    overdueDebt: 156000,
    status: "inativo"
  }
];

export const ClientsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockClients.filter(client =>
      client.name.toLowerCase().includes(value.toLowerCase()) ||
      client.nuit.includes(value) ||
      client.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const getStatusBadge = (status: Client["status"]) => {
    return status === "ativo" 
      ? <Badge className="bg-success text-success-foreground">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
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
                  onChange={(e) => handleSearch(e.target.value)}
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
                <TableHead>Dívida Total</TableHead>
                <TableHead>Dívida Vencida</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{client.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{client.nuit}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                      {client.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      {new Date(client.registrationDate).toLocaleDateString("pt-MZ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      MZN {client.totalDebt.toLocaleString()}
                    </div>
                    <div className="text-xs text-success">
                      Pago: MZN {client.paidDebt.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "font-medium",
                      client.overdueDebt > 0 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {client.overdueDebt > 0 
                        ? `MZN ${client.overdueDebt.toLocaleString()}`
                        : "Sem atraso"
                      }
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};