import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Mail, Lock, User } from "lucide-react";

interface AuthProps {
  mode: 'login' | 'signup';
}

export const Auth = ({ mode }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non corrispondono",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Mock authentication - in production this would use Supabase
      const userData = {
        email,
        fullName: mode === 'signup' ? fullName : 'Usuario',
        id: Math.random().toString(36).substr(2, 9)
      };
      
      localStorage.setItem('trend_user', JSON.stringify(userData));
      
      toast({
        title: mode === 'login' ? "Accesso effettuato!" : "Registrazione completata!",
        description: mode === 'login' ? "Benvenuto su Trend" : "Il tuo account è stato creato con successo",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Trend</h1>
          </div>
          <h2 className="text-xl font-semibold">
            {mode === 'login' ? 'Accedi al tuo account' : 'Crea il tuo account'}
          </h2>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' 
              ? 'Bentornato! Accedi per continuare a fare previsioni.' 
              : 'Unisciti alla community e inizia a fare previsioni sui mercati finanziari.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Il tuo nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="La tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Conferma la tua password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-primary shadow-primary"
            disabled={loading}
          >
            {loading 
              ? (mode === 'login' ? 'Accesso...' : 'Registrazione...') 
              : (mode === 'login' ? 'Accedi' : 'Registrati')
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' 
              ? "Non hai un account? " 
              : "Hai già un account? "
            }
            <button
              onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'login' ? 'Registrati' : 'Accedi'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};