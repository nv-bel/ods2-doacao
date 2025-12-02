import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Leaf, Heart, Users, ArrowRight, Truck, ChefHat } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { FeedSystem } from "./components/FeedSystem";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "signup" | "login" | "feed">("home");
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (user && currentPage !== "feed") {
      setCurrentPage("feed");
    } else if (!user && currentPage === "feed") {
      setCurrentPage("home");
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2FAF5]">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="h-12 w-12 text-green-600 animate-bounce" />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <FeedSystem 
        currentUser={user} 
        onNavigateBack={() => {
          logout();
          setCurrentPage("home");
        }}
      />
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-medium">AlimentoSolidário</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#usuarios" className="text-muted-foreground hover:text-foreground transition-colors">
              Para Você
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setCurrentPage("login")}>Entrar</Button>
            <Button onClick={() => setCurrentPage("signup")}>Cadastrar-se</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="sobre" className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Heart className="h-3 w-3 mr-1" />
                  Contra o Desperdício
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-medium leading-tight">
                  Transformando{" "}
                  <span className="text-green-600">excesso</span> em{" "}
                  <span className="text-orange-600">refeições</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Conectamos pequenos produtores, distribuidores e cozinheiros para combater o desperdício de alimentos e promover uma alimentação saudável e solidária.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setCurrentPage("signup")}
                >
                  Começar Agora
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Saiba Mais
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-medium text-green-600">500+</div>
                  <div className="text-sm text-muted-foreground">Produtores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-orange-600">1.2k</div>
                  <div className="text-sm text-muted-foreground">Refeições</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-600">95%</div>
                  <div className="text-sm text-muted-foreground">Menos Desperdício</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBmcnVpdHMlMjBoZWFsdGh5JTIwZm9vZHxlbnwxfHx8fDE3NTg2NjkxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Frutas e vegetais frescos"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-4">
              Como o AlimentoSolidário Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um ecossistema simples e eficiente que conecta quem tem excesso de alimentos com quem pode transformá-los em refeições nutritivas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">1. Produtor Doa</h3>
              <p className="text-muted-foreground">
                Pequenos produtores postam seus excedentes de frutas e vegetais no feed da plataforma
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium">2. Distribuidor Coleta</h3>
              <p className="text-muted-foreground">
                Distribuidores pegam os alimentos e fazem a logística até os cozinheiros parceiros
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-medium">3. Cozinheiro Transforma</h3>
              <p className="text-muted-foreground">
                Cozinheiros criam refeições saudáveis e nutritivas com os alimentos recebidos
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-medium mb-4">
                  Feed de Doações em Tempo Real
                </h3>
                <p className="text-muted-foreground mb-6">
                  Nossa plataforma funciona como uma rede social para doações de alimentos. Os produtores publicam seus excedentes, distribuidores visualizam e coletam, e os cozinheiros recebem ingredientes frescos para suas criações.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Atualizações em tempo real</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Geolocalização para otimizar rotas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Sistema de avaliações e confiança</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1744870416768-25139537d856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwd2FzdGUlMjBkb25hdGlvbiUyMGNvbW11bml0eXxlbnwxfHx8fDE3NTg2NjkxNzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Comunidade trabalhando contra desperdício de alimentos"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Cada Tipo de Usuário */}
      <section id="usuarios" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-4">
              Para Cada Participante
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada papel é essencial no nosso ecossistema. Descubra como você pode fazer parte desta transformação.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Para Produtores</CardTitle>
                <CardDescription>
                  Pequenos produtores rurais e urbanos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Evite o desperdício dos seus excedentes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Contribua para uma causa social</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Ganhe reconhecimento da comunidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Interface simples para publicar doações</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setCurrentPage("signup")}
                >
                  Começar a Doar
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Para Distribuidores</CardTitle>
                <CardDescription>
                  Logística solidária e eficiente
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Rotas otimizadas por geolocalização</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Faça parte de uma rede de impacto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Sistema de agendamento flexível</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Histórico de entregas e avaliações</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setCurrentPage("signup")}
                >
                  Ser Distribuidor
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Para Cozinheiros</CardTitle>
                <CardDescription>
                  Transforme ingredientes em refeições
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Ingredientes frescos e gratuitos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Crie refeições para a comunidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Compartilhe suas criações culinárias</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Feed personalizado de ingredientes</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setCurrentPage("signup")}
                >
                  Cozinhar Solidário
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-medium mb-6">
                Nosso Impacto Coletivo
              </h2>
              <p className="text-lg text-green-100 mb-8">
                Cada doação, cada entrega, cada refeição faz a diferença. Juntos, estamos construindo um futuro mais sustentável e solidário.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-medium mb-2">2.5 ton</div>
                  <div className="text-green-200">Alimentos salvos</div>
                </div>
                <div>
                  <div className="text-3xl font-medium mb-2">3.2k</div>
                  <div className="text-green-200">Refeições criadas</div>
                </div>
                <div>
                  <div className="text-3xl font-medium mb-2">850</div>
                  <div className="text-green-200">Famílias beneficiadas</div>
                </div>
                <div>
                  <div className="text-3xl font-medium mb-2">-65%</div>
                  <div className="text-green-200">Desperdício reduzido</div>
                </div>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2hlZiUyMGtpdGNoZW4lMjBwcmVwYXJhdGlvbnxlbnwxfHx8fDE3NTg2NjkxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Chef preparando refeição na cozinha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-medium mb-6">
              Pronto para Fazer a Diferença?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a centenas de produtores, distribuidores e cozinheiros que já estão transformando excesso em oportunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentPage("signup")}
              >
                <Users className="h-4 w-4 mr-2" />
                Começar Agora
              </Button>
              </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      
      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-medium">AlimentoSolidário</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando comunidades para um futuro sem desperdício de alimentos.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#como-funciona" className="hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#usuarios" className="hover:text-foreground transition-colors">Para Produtores</a></li>
                <li><a href="#usuarios" className="hover:text-foreground transition-colors">Para Distribuidores</a></li>
                <li><a href="#usuarios" className="hover:text-foreground transition-colors">Para Cozinheiros</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Guias</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Comunidade</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Impacto</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Parceiros</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AlimentoSolidário. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}