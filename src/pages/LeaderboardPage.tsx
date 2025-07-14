import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - expanded leaderboard
const mockLeaderboard = [
  { id: '1', username: 'MarcoTrader', score: 847.3, totalPredictions: 52, accuracy: 78.5 },
  { id: '2', username: 'CryptoLuigi', score: 723.8, totalPredictions: 41, accuracy: 75.2 },
  { id: '3', username: 'InvestorSara', score: 692.1, totalPredictions: 38, accuracy: 82.1 },
  { id: '4', username: 'TechAnalyst', score: 645.7, totalPredictions: 45, accuracy: 71.8 },
  { id: '5', username: 'BullMatteo', score: 598.2, totalPredictions: 33, accuracy: 79.3 },
  { id: '6', username: 'BearGiulia', score: 567.9, totalPredictions: 29, accuracy: 86.2 },
  { id: '7', username: 'DayTraderAlex', score: 534.5, totalPredictions: 67, accuracy: 65.4 },
  { id: '8', username: 'SwingAnna', score: 498.7, totalPredictions: 24, accuracy: 83.3 },
  { id: '9', username: 'ValueFranco', score: 456.2, totalPredictions: 31, accuracy: 74.2 },
  { id: '10', username: 'TrendFollower', score: 423.8, totalPredictions: 28, accuracy: 78.6 },
  { id: '11', username: 'SmartMoney', score: 398.1, totalPredictions: 22, accuracy: 81.8 },
  { id: '12', username: 'RiskTaker', score: 376.4, totalPredictions: 45, accuracy: 66.7 },
  { id: '13', username: 'Conservative', score: 354.9, totalPredictions: 19, accuracy: 89.5 },
  { id: '14', username: 'NewbieLuca', score: 298.7, totalPredictions: 15, accuracy: 73.3 },
  { id: '15', username: 'LearnerMaria', score: 267.3, totalPredictions: 12, accuracy: 75.0 },
];

export const LeaderboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('trend_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('trend_user');
    setUser(null);
    navigate('/');
  };

  // Calculate some stats
  const totalUsers = mockLeaderboard.length;
  const avgAccuracy = mockLeaderboard.reduce((acc, user) => acc + user.accuracy, 0) / totalUsers;
  const totalPredictions = mockLeaderboard.reduce((acc, user) => acc + user.totalPredictions, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={!!user} 
        username={user?.fullName || user?.email} 
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Classifica Completa</h1>
          <p className="text-muted-foreground">
            Vedi come si posizionano tutti i trader della community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trader Totali</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previsioni Totali</p>
                <p className="text-2xl font-bold">{totalPredictions.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuratezza Media</p>
                <p className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Championship Info */}
        <Card className="p-6 mb-8 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">🏆 Campionato Mensile</h2>
              <p className="text-white/90">
                Compete per diventare il trader del mese! Il vincitore riceve riconoscimento speciale.
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              15 giorni rimasti
            </Badge>
          </div>
        </Card>

        {/* Full Leaderboard */}
        <Leaderboard data={mockLeaderboard} title="Classifica Generale" />
      </main>
    </div>
  );
};