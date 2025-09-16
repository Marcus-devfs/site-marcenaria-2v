export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications?: {
    material: string;
    dimensions: string;
    color: string;
    finish: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  _id: string;
  url: string;
  section: string;
  category: string;
  title?: string;
  description?: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  message: string;
  rating: number;
  project?: string;
  createdAt: string;
}

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  project: string;
  budget: string;
  timeline: string;
  message: string;
  images?: File[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram: string;
    whatsapp: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Stats {
  projects: number;
  years: number;
  clients: number;
  satisfaction: number;
}
