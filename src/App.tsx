import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { FeedSystem } from "./components/FeedSystem";
import HomePage from "./components/HomePage";

export default function App() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2FAF5]">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="h-12 w-12 text-green-600 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/feed" /> : <HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <LoginForm />} />
        <Route path="/cadastro" element={user ? <Navigate to="/feed" /> : <SignupForm />} />
        <Route path="/feed" element={user ? <FeedSystem currentUser={user} onNavigateBack={logout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}