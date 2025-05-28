import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response Types
export interface Product {
  id: string;
  title: string;
  brand: string;
  imageUrl: string;
  refinedQuantityUnit: string | null;
  refinedVolumeOrWeight: string;
  categories: string[];
  productDepotInfoList: ProductDepotInfo[];
}

export interface ProductDepotInfo {
  depotId: string;
  depotName: string;
  price: number;
  unitPrice: string;
  marketAdi: string;
  percentage: number;
  longitude: number;
  latitude: number;
  indexTime: string;
}

export interface SearchResponse {
  numberOfFound: number;
  searchResultType: number;
  content: Product[];
  facetMap: any;
}

export interface PriceComparison {
  productId: string;
  productName: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceRange: number;
  bestMarket: string;
  worstMarket: string;
  savings: number;
}

export interface AIResponse {
  response?: string;
  recommendation?: string;
  analysis?: string;
  shoppingList?: string;
  comparison?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://10.0.2.2:3000'; // Android emulator için
    // iOS simulator için: 'http://localhost:3000'
    // Gerçek cihaz için: 'http://YOUR_IP:3000'
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.status, error.message);
        
        // Network error handling
        if (!error.response) {
          throw new Error('Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.');
        }
        
        // Server error handling
        if (error.response.status >= 500) {
          throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        }
        
        // Client error handling
        if (error.response.status >= 400) {
          throw new Error(error.response.data?.message || 'İstek hatası');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async healthCheck(): Promise<any> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Sistem durumu kontrol edilemedi');
    }
  }

  // Ürün Arama
  async searchProducts(
    keywords: string,
    location: Location,
    options: {
      distance?: number;
      size?: number;
    } = {}
  ): Promise<SearchResponse> {
    try {
      const response = await this.api.post('/api/search', {
        keywords,
        latitude: location.latitude,
        longitude: location.longitude,
        distance: options.distance || 5,
        size: options.size || 24,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Ürün arama başarısız');
    }
  }

  // AI Sohbet
  async chatWithAI(
    message: string,
    context?: any
  ): Promise<AIResponse> {
    try {
      const response = await this.api.post('/api/ai/chat', {
        message,
        context,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'AI ile iletişim kurulamadı');
    }
  }

  // Hata Yönetimi
  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error(defaultMessage);
  }

  // Base URL güncelleme (geliştirme için)
  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
    this.api.defaults.baseURL = newBaseURL;
  }
}

export default new ApiService(); 