import { Button } from "@/components/ui/button";
import { TrendingUp, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  onLogout?: () => void;
}

export const Header = ({ isLoggedIn = false, username, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-primary border-b shadow-primary">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Trend</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white/80 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/classifica" 
            className="text-white/80 hover:text-white transition-colors"
          >
            Classifica
          </Link>
          <Link 
            to="/previsioni" 
            className="text-white/80 hover:text-white transition-colors"
          >
            Fai una Previsione
          </Link>
          {isLoggedIn && (
            <Link 
              to="/profilo" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Profilo
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Esci</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/login')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Accedi
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/signup')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Registrati
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};