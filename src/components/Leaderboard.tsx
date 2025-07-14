import { Trophy, Medal, Award, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  totalPredictions: number;
  accuracy: number;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  title?: string;
  showTop?: number;
}

export const Leaderboard = ({ data, title = "Classifica", showTop }: LeaderboardProps) => {
  const displayData = showTop ? data.slice(0, showTop) : data;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-warning" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">{position}</div>;
    }
  };

  const getRankBackground = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-gold";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-orange-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      
      <div className="space-y-2">
        {displayData.map((entry, index) => {
          const position = index + 1;
          const isTopThree = position <= 3;
          
          return (
            <Card
              key={entry.id}
              className={`p-4 transition-all hover:shadow-md ${
                isTopThree ? getRankBackground(position) : ""
              } ${isTopThree ? "text-white" : ""}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(position)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">{entry.username}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm">
                    <span className={isTopThree ? "text-white/80" : "text-muted-foreground"}>
                      {entry.totalPredictions} previsioni
                    </span>
                    <Badge 
                      variant={isTopThree ? "outline" : "secondary"}
                      className={isTopThree ? "border-white/30 text-white" : ""}
                    >
                      {entry.accuracy.toFixed(1)}% accurato
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {entry.score.toFixed(1)}
                  </div>
                  <div className={`text-sm ${isTopThree ? "text-white/80" : "text-muted-foreground"}`}>
                    punti
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {displayData.length === 0 && (
        <Card className="p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nessun dato nella classifica
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Fai la tua prima previsione per apparire nella classifica!
          </p>
        </Card>
      )}
    </div>
  );
};