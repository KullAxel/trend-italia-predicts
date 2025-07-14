import { TrendingUp, TrendingDown, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PopularPrediction {
  asset: string;
  direction: 'up' | 'down';
  timeframe: string;
  count: number;
  currentPrice: number;
}

interface PopularPredictionsProps {
  predictions: PopularPrediction[];
}

export const PopularPredictions = ({ predictions }: PopularPredictionsProps) => {
  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '1d': return '1 Giorno';
      case '7d': return '7 Giorni';
      case '30d': return '1 Mese';
      default: return timeframe;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Previsioni Popolari</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{prediction.asset}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${prediction.currentPrice.toFixed(2)}
                  </p>
                </div>
                <Badge 
                  variant={prediction.direction === 'up' ? 'default' : 'destructive'}
                  className={prediction.direction === 'up' ? 'bg-bull' : 'bg-bear'}
                >
                  {prediction.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {prediction.direction === 'up' ? 'Su' : 'Giù'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeframeLabel(prediction.timeframe)}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-primary">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{prediction.count} utenti</span>
                </div>
              </div>

              <div className="bg-muted p-2 rounded text-center">
                <div className="text-xs text-muted-foreground">Popolarità</div>
                <div className="font-semibold">
                  {((prediction.count / 100) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {predictions.length === 0 && (
        <Card className="p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nessuna previsione popolare
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Sii il primo a fare una previsione!
          </p>
        </Card>
      )}
    </div>
  );
};