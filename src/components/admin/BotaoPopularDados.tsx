import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { popularDadosTeste } from '@/utils/popularDadosTeste';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const BotaoPopularDados = () => {
  const [carregando, setCarregando] = useState(false);

  const handlePopularDados = async () => {
    setCarregando(true);
    await popularDadosTeste();
    setCarregando(false);
    
    // Recarregar a página após 2 segundos para mostrar os novos dados
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={carregando}
        >
          {carregando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A popular...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Popular Dados de Teste
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Popular Base de Dados com Dados de Teste?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá criar:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>25 clientes</strong> (18 ativos, 7 inativos)</li>
              <li><strong>~27 dívidas</strong> distribuídas entre:</li>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>5 dívidas <span className="text-destructive font-medium">vencidas</span> (30-90 dias atrás)</li>
                <li>7 dívidas <span className="text-yellow-600 font-medium">pendentes</span> (próximos 5-35 dias)</li>
                <li>8 dívidas <span className="text-green-600 font-medium">pagas</span></li>
                <li>Alguns clientes terão múltiplas dívidas</li>
              </ul>
              <li>5 clientes sem nenhuma dívida</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Ideal para testar todas as funcionalidades do sistema: relatórios, notificações, filtros, etc.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handlePopularDados}>
            Confirmar e Popular
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
