import { Button } from "@/components/ui/button";
import { TrendingUp, User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  onLogout?: () => void;
}

export const Header = ({ isLoggedIn = false, username, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-header border-b border-white/10 shadow-lg"
    >
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
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-white hover:bg-white/10 p-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{username}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profilo')}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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