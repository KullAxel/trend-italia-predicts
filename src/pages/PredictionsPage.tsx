import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AssetSearch } from "@/components/AssetSearch";
import { PredictionForm } from "@/components/PredictionForm";
import { useNavigate } from "react-router-dom";

interface Asset {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export const PredictionsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('trend_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('trend_user');
    setUser(null);
    navigate('/');
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleBackToSearch = () => {
    setSelectedAsset(null);
  };

  const handleSubmitPrediction = (prediction: any) => {
    // In production, this would save to the database
    console.log('New prediction:', prediction);
    
    // Save to localStorage for now
    const existingPredictions = JSON.parse(localStorage.getItem('user_predictions') || '[]');
    const newPrediction = {
      ...prediction,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
    };
    
    existingPredictions.push(newPrediction);
    localStorage.setItem('user_predictions', JSON.stringify(existingPredictions));
    
    // Navigate back to home
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={!!user} 
        username={user?.fullName || user?.email} 
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Fai una Previsione</h1>
            <p className="text-muted-foreground">
              Seleziona un asset e fai la tua previsione sul movimento del prezzo
            </p>
          </div>

          {!selectedAsset ? (
            <AssetSearch onSelectAsset={handleSelectAsset} />
          ) : (
            <PredictionForm
              asset={selectedAsset}
              onBack={handleBackToSearch}
              onSubmit={handleSubmitPrediction}
            />
          )}
        </div>
      </main>
    </div>
  );
};