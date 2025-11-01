import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import logoNcangaza from '@/assets/logo-ncangaza-full.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, user, loading } = useAuth();

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-lg relative z-10 shadow-2xl border-primary/20 backdrop-blur-sm bg-card/95 animate-fade-in">
        <CardHeader className="text-center space-y-6 pb-8 pt-8">
          {/* Logo */}
          <div className="mx-auto mb-4">
            <img 
              src={logoNcangaza} 
              alt="Ncangaza Multiservices Logo" 
              className="h-40 mx-auto object-contain drop-shadow-2xl animate-scale-in"
            />
          </div>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-primary/80">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Acesso Seguro</span>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-base">
              Insira as suas credenciais para aceder ao sistema
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <span className="text-primary">●</span> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base border-2 focus:border-primary transition-all"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <span className="text-primary">●</span> Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Insira a sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-2 focus:border-primary transition-all pr-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-primary/30 text-primary focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">Lembrar-me</span>
              </label>
            </div>
            
            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover-scale" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  A autenticar...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Entrar no Sistema
                </>
              )}
            </Button>

            {/* Footer */}
            <div className="pt-6 space-y-3 border-t">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Conexão segura e encriptada</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Acesso restrito a utilizadores autorizados
              </p>
              <p className="text-xs text-center text-muted-foreground/70 font-medium">
                © 2025 Ncangaza Multiservices - Qualidade & Excelência
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;