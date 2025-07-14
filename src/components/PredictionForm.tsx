import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

interface PredictionFormProps {
  asset: Asset;
  onBack: () => void;
  onSubmit: (prediction: any) => void;
}

const timeframes = [
  { value: '1d', label: '1 Giorno' },
  { value: '7d', label: '7 Giorni' },
  { value: '30d', label: '1 Mese' },
];

export const PredictionForm = ({ asset, onBack, onSubmit }: PredictionFormProps) => {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [timeframe, setTimeframe] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentPrice = Math.random() * 1000 + 100; // Mock price

  const handleSubmit = async () => {
    if (!direction || !timeframe) {
      toast({
        title: "Errore",
        description: "Seleziona una direzione e un periodo di tempo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const prediction = {
        asset,
        direction,
        timeframe,
        initialPrice: currentPrice,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      onSubmit(prediction);
      
      toast({
        title: "Previsione Creata!",
        description: `La tua previsione per ${asset.symbol} è stata registrata`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della previsione",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Indietro
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{asset.symbol}</h2>
              <p className="text-muted-foreground">{asset.description}</p>
            </div>
            <Badge variant={asset.type === 'stock' ? 'default' : 'secondary'}>
              {asset.type === 'stock' ? 'Azione' : 'Crypto'}
            </Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Prezzo Attuale</span>
            </div>
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fai la tua previsione</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Quale direzione prevedi?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={direction === 'up' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setDirection('up')}
                className={`${direction === 'up' ? 'bg-gradient-bull' : ''} h-16`}
              >
                <TrendingUp className="h-6 w-6 mr-2" />
                Su
              </Button>
              <Button
                variant={direction === 'down' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setDirection('down')}
                className={`${direction === 'down' ? 'bg-gradient-bear' : ''} h-16`}
              >
                <TrendingDown className="h-6 w-6 mr-2" />
                Giù
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">
              Periodo di tempo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? 'default' : 'outline'}
                  onClick={() => setTimeframe(tf.value)}
                  className="h-12"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!direction || !timeframe || loading}
            size="lg"
            className="w-full bg-gradient-primary shadow-primary"
          >
            {loading ? 'Creazione...' : 'Crea Previsione'}
          </Button>
        </div>
      </Card>
    </div>
  );
};