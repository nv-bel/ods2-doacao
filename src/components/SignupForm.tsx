import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Leaf, Truck, ChefHat, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type UserType = "produtor" | "distribuidor" | "cozinheiro" | null;

interface SignupFormProps {
  onNavigateHome: () => void;
  onSuccess: () => void;
}

export function SignupForm({ onNavigateHome, onSuccess }: SignupFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    telefone: "",
    cidade: "",
    estado: "",
  });

  const userTypes = [
    {
      type: "produtor" as const,
      title: "Produtor",
      description: "Doe seus excedentes de frutas e vegetais",
      icon: Leaf,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      type: "distribuidor" as const,
      title: "Distribuidor",
      description: "Distribua alimentos para quem precisa",
      icon: Truck,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      type: "cozinheiro" as const,
      title: "Cozinheiro",
      description: "Transforme alimentos em refeições nutritivas",
      icon: ChefHat,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nome || !formData.email || !formData.password || !formData.telefone || !formData.cidade || !formData.estado) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      await register({
        ...formData,
        tipo: userType
      });
      setStep(3);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar");
    }
  };

  if (step === 3) {
    const selectedType = userTypes.find(type => type.type === userType);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 ${selectedType?.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Check className={`h-8 w-8 ${selectedType?.textColor}`} />
            </div>
            <CardTitle>Cadastro Realizado!</CardTitle>
            <CardDescription>
              Bem-vindo ao FomeZero como {selectedType?.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Seu cadastro foi realizado com sucesso. Redirecionando...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12">
            <div></div>
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Como você quer participar?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Escolha seu papel no FomeZero e faça parte da transformação contra o desperdício de alimentos.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onNavigateHome}
              className="self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {userTypes.map((userTypeData) => {
              const Icon = userTypeData.icon;
              return (
                <Card
                  key={userTypeData.type}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500"
                  onClick={() => handleUserTypeSelect(userTypeData.type)}
                >
                  <CardHeader className="p-0 mb-6 text-center">
                    <div className={`w-16 h-16 ${userTypeData.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-8 w-8 ${userTypeData.textColor}`} />
                    </div>
                    <CardTitle>{userTypeData.title}</CardTitle>
                    <CardDescription className="text-center">
                      {userTypeData.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Button 
                      className={`w-full ${userTypeData.buttonColor}`}
                    >
                      Cadastrar como {userTypeData.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedType = userTypes.find(type => type.type === userType);
  const Icon = selectedType?.icon!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${selectedType?.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${selectedType?.textColor}`} />
              </div>
              <h1 className="text-2xl font-bold">
                Cadastro como {selectedType?.title}
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
              <CardDescription>
                Preencha as informações para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      placeholder="São Paulo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      placeholder="SP"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${selectedType?.buttonColor}`}
                >
                  Cadastrar como {selectedType?.title}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}