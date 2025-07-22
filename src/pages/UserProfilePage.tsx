import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";

// Mock user data
const mockUser = {
  id: "1",
  username: "TradingPro2024",
  email: "user@example.com",
  avatar: null,
  reputation: 1250,
  joinedDate: "2024-01-15",
  totalPredictions: 47,
  correctPredictions: 32,
  incorrectPredictions: 12,
  pendingPredictions: 3
};

// Mock badges data
const mockBadges = [
  { id: "1", name: "First Prediction", icon: Target, earned: true, description: "Made your first prediction" },
  { id: "2", name: "Lucky Seven", icon: Star, earned: true, description: "7 correct predictions in a row" },
  { id: "3", name: "Market Expert", icon: Trophy, earned: true, description: "Achieved 80% accuracy" },
  { id: "4", name: "Bull Runner", icon: TrendingUp, earned: true, description: "10 successful bullish predictions" },
  { id: "5", name: "Bear Hunter", icon: TrendingDown, earned: false, description: "10 successful bearish predictions" },
  { id: "6", name: "Diamond Hands", icon: Medal, earned: false, description: "Hold predictions for 30+ days" },
  { id: "7", name: "Speed Trader", icon: Clock, earned: true, description: "10 daily predictions" },
  { id: "8", name: "Legendary", icon: Award, earned: false, description: "Reach 2000 reputation points" }
];

// Mock recent predictions
const mockRecentPredictions = [
  { id: "1", asset: "AAPL", direction: "up", timeframe: "7d", status: "correct", createdAt: "2024-01-20", currentPrice: 189.25 },
  { id: "2", asset: "TSLA", direction: "down", timeframe: "1d", status: "incorrect", createdAt: "2024-01-19", currentPrice: 248.75 },
  { id: "3", asset: "BTC", direction: "up", timeframe: "30d", status: "pending", createdAt: "2024-01-18", currentPrice: 43250.50 },
  { id: "4", asset: "NVDA", direction: "up", timeframe: "7d", status: "correct", createdAt: "2024-01-17", currentPrice: 875.30 },
  { id: "5", asset: "GOOGL", direction: "down", timeframe: "1d", status: "correct", createdAt: "2024-01-16", currentPrice: 138.90 }
];

export const UserProfilePage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch user data from an API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser({ ...JSON.parse(userData), ...mockUser });
    } else {
      setUser(mockUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Prepare chart data
  const chartData = [
    { name: 'Correct', value: user.correctPredictions, color: 'hsl(142, 76%, 36%)' },
    { name: 'Incorrect', value: user.incorrectPredictions, color: 'hsl(0, 84%, 60%)' },
    { name: 'Pending', value: user.pendingPredictions, color: 'hsl(43, 89%, 38%)' }
  ];

  const total = user.correctPredictions + user.incorrectPredictions + user.pendingPredictions;
  const accuracy = user.totalPredictions > 0 
    ? ((user.correctPredictions / (user.correctPredictions + user.incorrectPredictions)) * 100).toFixed(1)
    : "0.0";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'incorrect':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Loader className="h-4 w-4 text-yellow-600 animate-spin" />;
      default:
        return null;
    }
  };

  // Simple SVG pie chart component
  const SimplePieChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No prediction data yet
        </div>
      );
    }

    let cumulativePercentage = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" className="mb-4">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            cumulativePercentage += percentage;
            
            if (percentage === 0) return null;
            
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            return (
              <path
                key={item.name}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={!!user} 
        username={user?.username} 
        onLogout={handleLogout} 
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* User Info Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>{user.reputation} reputation points</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>{user.totalPredictions} total predictions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Medal className="h-4 w-4 text-primary" />
                      <span>{accuracy}% accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Achievement Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex space-x-4 pb-4">
                  {mockBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all hover:shadow-md min-w-[120px] text-center ${
                          badge.earned 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-muted bg-muted/20 opacity-60'
                        }`}
                      >
                        <IconComponent 
                          className={`h-8 w-8 mx-auto mb-2 ${
                            badge.earned ? 'text-primary' : 'text-muted-foreground'
                          }`} 
                        />
                        <h4 className={`font-medium text-xs ${
                          badge.earned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {badge.name}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prediction Summary Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Prediction Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={chartData} />
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                  <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Recent Predictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(prediction.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{prediction.asset}</span>
                            {prediction.direction === 'up' ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {prediction.timeframe} • {new Date(prediction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={prediction.status === 'correct' ? 'default' : 
                                  prediction.status === 'incorrect' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {prediction.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${prediction.currentPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};