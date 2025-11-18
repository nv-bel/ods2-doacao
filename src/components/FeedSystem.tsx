import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Leaf, 
  Truck, 
  ChefHat, 
  Plus, 
  Clock, 
  MapPin, 
  Package, 
  User, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Tipos de dados
export type UserType = "produtor" | "distribuidor" | "cozinheiro";

export interface User {
  id: string;
  nome: string;
  tipo: UserType;
  cidade: string;
  avatar?: string;
}

export interface Doacao {
  id: string;
  produtorId: string;
  produtor: User;
  titulo: string;
  descricao: string;
  tipo: "frutas" | "vegetais" | "ambos";
  quantidade: string;
  unidade: "kg" | "caixas" | "unidades";
  dataColheita: string;
  dataLimite: string;
  imagem: string;
  status: "disponivel" | "coletada" | "entregue";
  distribuidorId?: string;
  distribuidor?: User;
  cozinheiroId?: string;
  cozinheiro?: User;
  createdAt: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    nome: "João Silva",
    tipo: "produtor",
    cidade: "Campinas, SP"
  },
  {
    id: "2",
    nome: "Maria Santos",
    tipo: "distribuidor",
    cidade: "São Paulo, SP"
  },
  {
    id: "3",
    nome: "Pedro Chef",
    tipo: "cozinheiro",
    cidade: "São Paulo, SP"
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    tipo: "produtor",
    cidade: "Holambra, SP"
  },
  {
    id: "5",
    nome: "Carlos Distribuidor",
    tipo: "distribuidor",
    cidade: "Santos, SP"
  }
];

const mockDoacoes: Doacao[] = [
  {
    id: "1",
    produtorId: "1",
    produtor: mockUsers[0],
    titulo: "Tomates Orgânicos",
    descricao: "Tomates frescos da colheita de hoje, perfeitos para molhos e saladas. Produção orgânica certificada.",
    tipo: "vegetais",
    quantidade: "15",
    unidade: "kg",
    dataColheita: "2024-01-20",
    dataLimite: "2024-01-22",
    imagem: "https://images.unsplash.com/photo-1586640167802-8af12bf651fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NTg1NTA4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "disponivel",
    createdAt: "2024-01-20T08:00:00Z"
  },
  {
    id: "2",
    produtorId: "4",
    produtor: mockUsers[3],
    titulo: "Maçãs Gala",
    descricao: "Maçãs doces e crocantes, ideais para sobremesas ou consumo in natura.",
    tipo: "frutas",
    quantidade: "8",
    unidade: "caixas",
    dataColheita: "2024-01-19",
    dataLimite: "2024-01-25",
    imagem: "https://images.unsplash.com/photo-1680835011462-d30471faf688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFwcGxlcyUyMGZydWl0c3xlbnwxfHx8fDE3NTg2NzAyODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "coletada",
    distribuidorId: "2",
    distribuidor: mockUsers[1],
    createdAt: "2024-01-19T10:30:00Z"
  },
  {
    id: "3",
    produtorId: "1",
    produtor: mockUsers[0],
    titulo: "Bananas Nanicas",
    descricao: "Bananas maduras no ponto ideal, perfeitas para vitaminas e bolos.",
    tipo: "frutas",
    quantidade: "20",
    unidade: "kg",
    dataColheita: "2024-01-18",
    dataLimite: "2024-01-21",
    imagem: "https://images.unsplash.com/photo-1573828235229-fb27fdc8da91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhbmFuYXMlMjBmcnVpdHxlbnwxfHx8fDE3NTg1ODQ0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "entregue",
    distribuidorId: "2",
    distribuidor: mockUsers[1],
    cozinheiroId: "3",
    cozinheiro: mockUsers[2],
    createdAt: "2024-01-18T14:15:00Z"
  }
];

// Funções helper
const getStatusBadge = (status: Doacao["status"]) => {
  const statusConfig = {
    disponivel: { variant: "default" as const, text: "Disponível", icon: Package },
    coletada: { variant: "secondary" as const, text: "Coletada", icon: Truck },
    entregue: { variant: "outline" as const, text: "Entregue", icon: CheckCircle2 }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

const getTypeColor = (tipo: UserType) => {
  switch (tipo) {
    case "produtor": return "text-green-600";
    case "distribuidor": return "text-blue-600";
    case "cozinheiro": return "text-orange-600";
  }
};

const getTypeIcon = (tipo: UserType) => {
  switch (tipo) {
    case "produtor": return Leaf;
    case "distribuidor": return Truck;
    case "cozinheiro": return ChefHat;
  }
};

interface FeedSystemProps {
  currentUser: User;
  onNavigateBack: () => void;
}

export function FeedSystem({ currentUser, onNavigateBack }: FeedSystemProps) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);

  // Função para captar doação (distribuidor)
  const captarDoacao = (doacaoId: string) => {
    setDoacoes(prev => prev.map(doacao => {
      if (doacao.id === doacaoId && doacao.status === "disponivel") {
        return {
          ...doacao,
          status: "coletada" as const,
          distribuidorId: currentUser.id,
          distribuidor: currentUser
        };
      }
      return doacao;
    }));
  };

  // Função para entregar doação (distribuidor)
  const entregarDoacao = (doacaoId: string, cozinheiroId: string) => {
    const cozinheiro = mockUsers.find(u => u.id === cozinheiroId && u.tipo === "cozinheiro");
    if (!cozinheiro) return;

    setDoacoes(prev => prev.map(doacao => {
      if (doacao.id === doacaoId && doacao.status === "coletada") {
        return {
          ...doacao,
          status: "entregue" as const,
          cozinheiroId: cozinheiro.id,
          cozinheiro: cozinheiro
        };
      }
      return doacao;
    }));
  };

  // Função para criar nova doação (produtor)
  const criarDoacao = (novaDoacaoData: Partial<Doacao>) => {
    const novaDoacao: Doacao = {
      id: Date.now().toString(),
      produtorId: currentUser.id,
      produtor: currentUser,
      titulo: novaDoacaoData.titulo || "",
      descricao: novaDoacaoData.descricao || "",
      tipo: novaDoacaoData.tipo || "frutas",
      quantidade: novaDoacaoData.quantidade || "",
      unidade: novaDoacaoData.unidade || "kg",
      dataColheita: novaDoacaoData.dataColheita || "",
      dataLimite: novaDoacaoData.dataLimite || "",
      imagem: novaDoacaoData.imagem || "https://images.unsplash.com/photo-1700064165267-8fa68ef07167",
      status: "disponivel",
      createdAt: new Date().toISOString()
    };

    setDoacoes(prev => [novaDoacao, ...prev]);
    setIsCreatingDonation(false);
  };

  // Filtrar doações por tipo de usuário
  const getDoacoesFiltradas = () => {
    switch (currentUser.tipo) {
      case "produtor":
        return doacoes.filter(d => d.produtorId === currentUser.id);
      case "distribuidor":
        return doacoes;
      case "cozinheiro":
        return doacoes.filter(d => 
          d.status === "entregue" && d.cozinheiroId === currentUser.id ||
          d.status === "coletada" && d.distribuidorId
        );
      default:
        return doacoes;
    }
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onNavigateBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-medium">AlimentoSolidário</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getTypeIcon(currentUser.tipo);
                  return <Icon className={`h-4 w-4 ${getTypeColor(currentUser.tipo)}`} />;
                })()}
                <span className="font-medium">{currentUser.nome}</span>
                <span className="text-muted-foreground">({currentUser.tipo})</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar com informações do usuário */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getTypeIcon(currentUser.tipo);
                    return (
                      <div className={`w-12 h-12 ${
                        currentUser.tipo === "produtor" ? "bg-green-100" :
                        currentUser.tipo === "distribuidor" ? "bg-blue-100" : "bg-orange-100"
                      } rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${getTypeColor(currentUser.tipo)}`} />
                      </div>
                    );
                  })()}
                  <div>
                    <CardTitle>{currentUser.nome}</CardTitle>
                    <CardDescription className="capitalize">
                      {currentUser.tipo} • {currentUser.cidade}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.tipo === "produtor" && (
                  <Dialog open={isCreatingDonation} onOpenChange={setIsCreatingDonation}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Doação
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Nova Doação</DialogTitle>
                        <DialogDescription>
                          Compartilhe seus excedentes com a comunidade
                        </DialogDescription>
                      </DialogHeader>
                      <CreateDonationForm onSubmit={criarDoacao} />
                    </DialogContent>
                  </Dialog>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Estatísticas</h4>
                  <div className="space-y-2 text-sm">
                    {currentUser.tipo === "produtor" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Doações ativas:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.produtorId === currentUser.id && d.status === "disponivel").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total doado:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.produtorId === currentUser.id).length}
                          </span>
                        </div>
                      </>
                    )}
                    {currentUser.tipo === "distribuidor" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coletas realizadas:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.distribuidorId === currentUser.id).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entregas pendentes:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.distribuidorId === currentUser.id && d.status === "coletada").length}
                          </span>
                        </div>
                      </>
                    )}
                    {currentUser.tipo === "cozinheiro" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ingredientes recebidos:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.cozinheiroId === currentUser.id).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entregas em andamento:</span>
                          <span className="font-medium">
                            {doacoes.filter(d => d.status === "coletada").length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed principal */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-medium mb-2">
                  {currentUser.tipo === "produtor" && "Minhas Doações"}
                  {currentUser.tipo === "distribuidor" && "Feed de Doações"}
                  {currentUser.tipo === "cozinheiro" && "Ingredientes Disponíveis"}
                </h2>
                <p className="text-muted-foreground">
                  {currentUser.tipo === "produtor" && "Gerencie suas doações de alimentos"}
                  {currentUser.tipo === "distribuidor" && "Encontre doações para coletar e entregar"}
                  {currentUser.tipo === "cozinheiro" && "Veja ingredientes sendo entregues para você"}
                </p>
              </div>

              <div className="space-y-4">
                {getDoacoesFiltradas().map((doacao) => (
                  <DoacaoCard
                    key={doacao.id}
                    doacao={doacao}
                    currentUser={currentUser}
                    onCaptar={captarDoacao}
                    onEntregar={entregarDoacao}
                  />
                ))}
                
                {getDoacoesFiltradas().length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Nenhuma doação encontrada</h3>
                        <p className="text-muted-foreground">
                          {currentUser.tipo === "produtor" && "Crie sua primeira doação para começar"}
                          {currentUser.tipo === "distribuidor" && "Aguarde novas doações aparecerem"}
                          {currentUser.tipo === "cozinheiro" && "Aguarde distribuidores entregarem ingredientes"}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para o card de doação
function DoacaoCard({ 
  doacao, 
  currentUser, 
  onCaptar, 
  onEntregar 
}: { 
  doacao: Doacao;
  currentUser: User;
  onCaptar: (id: string) => void;
  onEntregar: (doacaoId: string, cozinheiroId: string) => void;
}) {
  const [selectedCozinheiro, setSelectedCozinheiro] = useState("");
  const cozinheiros = mockUsers.filter(u => u.tipo === "cozinheiro");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(doacao.dataLimite);
  const isExpiringSoon = daysUntilExpiry <= 2;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="aspect-video md:aspect-square overflow-hidden bg-muted">
          <ImageWithFallback
            src={doacao.imagem}
            alt={doacao.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:col-span-2 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{doacao.titulo}</h3>
                {getStatusBadge(doacao.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {doacao.produtor.nome}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {doacao.produtor.cidade}
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {doacao.quantidade} {doacao.unidade}
                </div>
              </div>
            </div>
            {isExpiringSoon && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {doacao.descricao}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Colheita: {formatDate(doacao.dataColheita)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Limite: {formatDate(doacao.dataLimite)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Botões específicos por tipo de usuário */}
              {currentUser.tipo === "distribuidor" && doacao.status === "disponivel" && (
                <Button 
                  onClick={() => onCaptar(doacao.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Captar
                </Button>
              )}

              {currentUser.tipo === "distribuidor" && 
               doacao.status === "coletada" && 
               doacao.distribuidorId === currentUser.id && (
                <div className="flex items-center gap-2">
                  <Select value={selectedCozinheiro} onValueChange={setSelectedCozinheiro}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Cozinheiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {cozinheiros.map(cozinheiro => (
                        <SelectItem key={cozinheiro.id} value={cozinheiro.id}>
                          {cozinheiro.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => selectedCozinheiro && onEntregar(doacao.id, selectedCozinheiro)}
                    disabled={!selectedCozinheiro}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Entregar
                  </Button>
                </div>
              )}

              {doacao.status === "coletada" && doacao.distribuidor && (
                <div className="text-sm text-muted-foreground">
                  Coletada por {doacao.distribuidor.nome}
                </div>
              )}

              {doacao.status === "entregue" && doacao.cozinheiro && (
                <div className="text-sm text-muted-foreground">
                  Entregue para {doacao.cozinheiro.nome}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Formulário para criar doação
function CreateDonationForm({ onSubmit }: { onSubmit: (data: Partial<Doacao>) => void }) {
  const [formData, setFormData] = useState<Partial<Doacao>>({
    tipo: "frutas",
    unidade: "kg"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const foodImages = {
    frutas: "https://images.unsplash.com/photo-1680835011462-d30471faf688",
    vegetais: "https://images.unsplash.com/photo-1586640167802-8af12bf651fe",
    ambos: "https://images.unsplash.com/photo-1700064165267-8fa68ef07167"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título da Doação</Label>
        <Input
          id="titulo"
          value={formData.titulo || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Tomates Orgânicos"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva os alimentos..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value: "frutas" | "vegetais" | "ambos") => 
              setFormData(prev => ({ 
                ...prev, 
                tipo: value,
                imagem: foodImages[value]
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frutas">Frutas</SelectItem>
              <SelectItem value="vegetais">Vegetais</SelectItem>
              <SelectItem value="ambos">Frutas e Vegetais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Unidade</Label>
          <Select 
            value={formData.unidade} 
            onValueChange={(value: "kg" | "caixas" | "unidades") => 
              setFormData(prev => ({ ...prev, unidade: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Quilos (kg)</SelectItem>
              <SelectItem value="caixas">Caixas</SelectItem>
              <SelectItem value="unidades">Unidades</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantidade">Quantidade</Label>
        <Input
          id="quantidade"
          type="number"
          value={formData.quantidade || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
          placeholder="0"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataColheita">Data da Colheita</Label>
          <Input
            id="dataColheita"
            type="date"
            value={formData.dataColheita || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, dataColheita: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataLimite">Data Limite</Label>
          <Input
            id="dataLimite"
            type="date"
            value={formData.dataLimite || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, dataLimite: e.target.value }))}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Criar Doação
      </Button>
    </form>
  );
}