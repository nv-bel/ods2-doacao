import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  nome: string;
  telefone: string;
  cidade: string;
  estado: string;
  tipo: 'produtor' | 'cozinheiro' | 'distribuidor';
}

export interface Donation {
  id: number;
  produtor_id: number;
  produtor_nome: string;
  titulo: string;
  descricao: string;
  quantidade: string;
  status: string;
  cozinheiro_id?: number;
  cozinheiro_nome?: string;
  created_at: string;
  accepted_at?: string;
}

export interface Dish {
  id: number;
  cozinheiro_id: number;
  cozinheiro_nome: string;
  donation_id: number;
  titulo: string;
  descricao: string;
  status: string;
  distribuidor_id?: number;
  distribuidor_nome?: string;
  created_at: string;
  ready_at?: string;
  distributed_at?: string;
}

export interface Stats {
  total_doacoes?: number;
  doacoes_aceitas?: number;
  doacoes_finalizadas?: number;
  doacoes_disponiveis?: number;
  pratos_criados?: number;
  pratos_distribuidos?: number;
  pratos_disponiveis?: number;
}

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    nome: string;
    telefone: string;
    cidade: string;
    estado: string;
    tipo: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const donationsAPI = {
  getAll: async (status = 'disponivel') => {
    const response = await api.get<Donation[]>(`/donations/?status=${status}`);
    return response.data;
  },

  create: async (data: { titulo: string; descricao: string; quantidade: string }) => {
    const response = await api.post<Donation>('/donations/', data);
    return response.data;
  },

  accept: async (donationId: number) => {
    const response = await api.post<Donation>(`/donations/${donationId}/accept`);
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get<Donation[]>('/donations/my-donations');
    return response.data;
  },

  getAccepted: async () => {
    const response = await api.get<Donation[]>('/donations/accepted');
    return response.data;
  },
};

export const dishesAPI = {
  getAll: async (status = 'pronto') => {
    const response = await api.get<Dish[]>(`/dishes/?status=${status}`);
    return response.data;
  },

  create: async (data: { donation_id: number; titulo: string; descricao: string }) => {
    const response = await api.post<Dish>('/dishes/', data);
    return response.data;
  },

  accept: async (dishId: number) => {
    const response = await api.post<Dish>(`/dishes/${dishId}/accept`);
    return response.data;
  },

  getMyDishes: async () => {
    const response = await api.get<Dish[]>('/dishes/my-dishes');
    return response.data;
  },

  getDistributed: async () => {
    const response = await api.get<Dish[]>('/dishes/distributed');
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get<Stats>('/dashboard/stats');
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/dashboard/history');
    return response.data;
  },
};

export default api;