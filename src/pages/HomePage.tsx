import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PopularPredictions } from "@/components/PopularPredictions";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { finnhubService } from "@/services/finnhub";

// Base predictions with real market assets
const basePopularPredictions = [
  { asset: "BTC", symbol: "BTC", direction: 'up' as const, timeframe: '7d', count: 89, currentPrice: 0 },
  { asset: "AAPL", symbol: "AAPL", direction: 'up' as const, timeframe: '1d', count: 67, currentPrice: 0 },
  { asset: "TSLA", symbol: "TSLA", direction: 'down' as const, timeframe: '30d', count: 45, currentPrice: 0 },
  { asset: "ETH", symbol: "ETH", direction: 'up' as const, timeframe: '7d', count: 72, currentPrice: 0 },
  { asset: "NVDA", symbol: "NVDA", direction: 'up' as const, timeframe: '1d', count: 58, currentPrice: 0 },
  { asset: "GOOGL", symbol: "GOOGL", direction: 'down' as const, timeframe: '7d', count: 41, currentPrice: 0 },
];

const mockLeaderboard = [
  { id: '1', username: 'MarcoTrader', score: 847.3, totalPredictions: 52, accuracy: 78.5 },
  { id: '2', username: 'CryptoLuigi', score: 723.8, totalPredictions: 41, accuracy: 75.2 },
  { id: '3', username: 'InvestorSara', score: 692.1, totalPredictions: 38, accuracy: 82.1 },
  { id: '4', username: 'TechAnalyst', score: 645.7, totalPredictions: 45, accuracy: 71.8 },
  { id: '5', username: 'BullMatteo', score: 598.2, totalPredictions: 33, accuracy: 79.3 },
];

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [popularPredictions, setPopularPredictions] = useState(basePopularPredictions);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('trend_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchRealPrices = async () => {
      const updatedPredictions = await Promise.all(
        basePopularPredictions.map(async (prediction) => {
          try {
            let quote = null;
            
            // Handle crypto assets
            if (prediction.symbol === 'BTC' || prediction.symbol === 'ETH') {
              quote = await finnhubService.getCryptoQuote(prediction.symbol);
            } else {
              // Handle stock assets
              quote = await finnhubService.getQuote(prediction.symbol);
            }
            
            return {
              ...prediction,
              currentPrice: quote?.c || 0
            };
          } catch (error) {
            console.error(`Error fetching price for ${prediction.symbol}:`, error);
            return prediction;
          }
        })
      );
      
      setPopularPredictions(updatedPredictions);
    };

    fetchRealPrices();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('trend_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={!!user} 
        username={user?.fullName || user?.email} 
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Costruisci la tua Reputazione Finanziaria
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Fai previsioni sui mercati finanziari e dimostra le tue competenze senza rischi monetari
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/previsioni')}
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Fai una Previsione
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/classifica')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Vedi Classifica
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">1,247</h3>
              <p className="text-muted-foreground">Previsioni Totali</p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">156</h3>
              <p className="text-muted-foreground">Utenti Attivi</p>
            </Card>
            <Card className="p-6 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">72%</h3>
              <p className="text-muted-foreground">Accuratezza Media</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Predictions */}
          <div className="lg:col-span-2">
            <PopularPredictions predictions={popularPredictions} />
          </div>

          {/* Top Investors Preview */}
          <div>
            <Leaderboard 
              data={mockLeaderboard} 
              title="Top Investitori" 
              showTop={5}
            />
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/classifica')}
              >
                Vedi Classifica Completa
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Call to Action */}
      {!user && (
        <section className="bg-gradient-primary py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto a iniziare?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Unisciti alla community e dimostra le tue capacità di previsione
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Registrati Gratis
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};