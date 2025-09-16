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
  key: string;
  category: string;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface Environment {
  type: 'cozinha' | 'quarto' | 'sala' | 'banheiro' | 'escritorio' | 'area_externa' | 'outro';
  name?: string;
  measurements: {
    width: number;
    height: number;
    depth: number;
    area: number;
  };
  description: string;
  woodType: 'branca' | 'madeirada' | 'laminada' | 'mdf' | 'outro';
  thickness: '15mm' | '18mm' | '25mm';
  estimatedValue?: number;
}

export interface ReferenceImage {
  url: string;
  description: string;
  uploadedAt: Date;
}

export interface QuoteComplete {
  _id?: string;
  client: {
    name: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
  };
  environments: Environment[];
  projectDetails: {
    description: string;
    budget: 'ate_10k' | '10k_25k' | '25k_50k' | '50k_100k' | 'acima_100k' | 'nao_definido';
    timeline: 'urgente' | '1_mes' | '2_3_meses' | '3_6_meses' | 'sem_pressa';
    specialRequirements?: string;
  };
  referenceImages: ReferenceImage[];
  calculations: {
    totalArea: number;
    estimatedTotalValue: number;
    averagePricePerM2: number;
    breakdown: Array<{
      environment: string;
      area: number;
      pricePerM2: number;
      totalValue: number;
    }>;
  };
  status: 'pending' | 'reviewed' | 'sent' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  sentAt?: Date;
  notes?: string;
}

export interface PriceConfig {
  _id?: string;
  environment: string;
  woodType: string;
  thickness: string;
  pricePerM2: number;
  complexityMultipliers: {
    basic: number;
    medium: number;
    complex: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  notes?: string;
}
