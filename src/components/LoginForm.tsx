import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Leaf } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  onNavigateHome: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onNavigateHome, onSuccess }: LoginFormProps) {
  const [error, setError] = useState("");
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      await login(formData.email, formData.password);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateHome}
            className="w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-medium">AlimentoSolidário</span>
          </div>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}