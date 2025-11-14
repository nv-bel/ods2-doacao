import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Leaf, Heart, Users, ArrowRight, Truck, ChefHat } from "lucide-react";
import { SignupForm } from "./components/SignupForm";
import { FeedSystem } from "./components/FeedSystem";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "signup" | "login" | "feed">("home");
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (currentPage === "signup") {
    return (
      <SignupForm 
        onNavigateHome={() => setCurrentPage("home")}
        onSuccess={() => setCurrentPage("feed")}
      />
    );
  }

  if (currentPage === "login") {
    return (
      <LoginForm 
        onNavigateHome={() => setCurrentPage("home")}
        onSuccess={() => setCurrentPage("feed")}
      />
    );
  }

  if ((currentPage === "feed" || user) && user) {
    return (
      <FeedSystem 
        currentUser={user} 
        onNavigateBack={() => {
          setCurrentPage("home");
          logout();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">FomeZero</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentPage("login")}>
              Entrar
            </Button>
            <Button onClick={() => setCurrentPage("signup")} className="bg-green-600 hover:bg-green-700">
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
          ODS 2 - Fome Zero e Agricultura Sustentável
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Conectando Alimentos a
          <span className="text-green-600"> Quem Precisa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Uma plataforma que une produtores, cozinheiros e distribuidores para combater o desperdício 
          de alimentos e alimentar comunidades.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => setCurrentPage("signup")} className="bg-green-600 hover:bg-green-700">
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline">
            Saiba Mais
          </Button>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Produtor</CardTitle>
              <CardDescription>
                Divulga alimentos disponíveis para doação, evitando desperdício
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-orange-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Cozinheiro</CardTitle>
              <CardDescription>
                Transforma alimentos doados em pratos nutritivos e saborosos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Distribuidor</CardTitle>
              <CardDescription>
                Leva os pratos prontos para quem mais precisa nas ruas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Impacto */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nosso Impacto</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Refeições Distribuídas</div>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Pessoas Ajudadas</div>
            </div>
            <div>
              <Leaf className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">2 ton</div>
              <div className="text-green-100">Alimentos Salvos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 FomeZero - Combatendo o desperdício, alimentando vidas</p>
        </div>
      </footer>
    </div>
  );
}

function LoginForm({ onNavigateHome, onSuccess }: { onNavigateHome: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Entre com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Entrar
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onNavigateHome}>
              Voltar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}