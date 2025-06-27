export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[]; // <-- Changed from image: string
  rating: number;
  reviews: number;
  description: string;
  tag?: {
    text: string;
    color: string;
  };
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}