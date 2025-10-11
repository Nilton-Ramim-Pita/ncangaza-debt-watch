import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  console.log('🔍 ProtectedRoute - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin);

  if (loading) {
    console.log('🔍 ProtectedRoute - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔍 ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('🔍 ProtectedRoute - User is not admin');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  console.log('🔍 ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;