import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { finnhubService, FinnhubAsset } from "@/services/finnhub";

interface Asset {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

interface AssetSearchProps {
  onSelectAsset: (asset: Asset) => void;
}

export const AssetSearch = ({ onSelectAsset }: AssetSearchProps) => {
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularAssets] = useState<Asset[]>([
    { symbol: "AAPL", description: "Apple Inc", displaySymbol: "AAPL", type: "stock" },
    { symbol: "TSLA", description: "Tesla Inc", displaySymbol: "TSLA", type: "stock" },
    { symbol: "NVDA", description: "NVIDIA Corporation", displaySymbol: "NVDA", type: "stock" },
    { symbol: "BTC", description: "Bitcoin", displaySymbol: "BTC", type: "crypto" },
    { symbol: "ETH", description: "Ethereum", displaySymbol: "ETH", type: "crypto" },
    { symbol: "GOOGL", description: "Alphabet Inc", displaySymbol: "GOOGL", type: "stock" },
  ]);

  const searchAssets = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setAssets([]);
      return;
    }

    setLoading(true);
    try {
      // First try to search via Finnhub API
      const finnhubResults = await finnhubService.searchAssets(searchQuery);
      
      // Filter popular assets as fallback
      const popularFiltered = popularAssets.filter(asset => 
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Combine results, prioritizing Finnhub data but including popular assets
      const combinedResults = [...finnhubResults, ...popularFiltered]
        .filter((asset, index, self) => 
          index === self.findIndex(a => a.symbol === asset.symbol)
        )
        .slice(0, 10); // Limit to 10 results
      
      setAssets(combinedResults);
    } catch (error) {
      console.error('Error searching assets:', error);
      // Fallback to popular assets only
      const filtered = popularAssets.filter(asset => 
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAssets(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchAssets(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca un'azione o criptovaluta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {!query && (
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Asset Popolari</h3>
          <div className="grid gap-2">
            {popularAssets.map((asset) => (
              <Card 
                key={asset.symbol} 
                className="p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.description}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-muted rounded">
                    {asset.type === 'stock' ? 'Azione' : 'Crypto'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="space-y-2">
          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Ricerca in corso...
            </div>
          )}
          
          {!loading && assets.length === 0 && query && (
            <div className="text-center py-4 text-muted-foreground">
              Nessun asset trovato per "{query}"
            </div>
          )}

          {!loading && assets.map((asset) => (
            <Card 
              key={asset.symbol} 
              className="p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary"
              onClick={() => onSelectAsset(asset)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-sm text-muted-foreground">{asset.description}</div>
                </div>
                <div className="text-xs px-2 py-1 bg-muted rounded">
                  {asset.type === 'stock' ? 'Azione' : 'Crypto'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};