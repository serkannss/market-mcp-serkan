# Mobil Uygulama Entegrasyonu

Bu dosya, Market Fiyatı MCP Server'ının mobil uygulamalarla nasıl entegre edileceğini gösterir.

## 🚀 Hızlı Başlangıç

### 1. Server'ı Başlatın
```bash
# Mobil API server'ı başlat
npm run mobile

# Veya geliştirme modu
npm run dev
```

### 2. API Base URL
```
http://localhost:3000
```

## 📱 React Native Entegrasyonu

### API Service Sınıfı
```javascript
// services/MarketApiService.js
class MarketApiService {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async searchProducts(keywords, latitude, longitude, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords,
          latitude,
          longitude,
          distance: options.distance || 5,
          size: options.size || 24
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ürün arama hatası:', error);
      throw error;
    }
  }

  async getAIRecommendations(userQuery, keywords, latitude, longitude) {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery,
          keywords,
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI öneri hatası:', error);
      throw error;
    }
  }

  async comparePrices(productId, latitude, longitude) {
    try {
      const response = await fetch(`${this.baseUrl}/api/compare-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fiyat karşılaştırma hatası:', error);
      throw error;
    }
  }

  async chatWithAI(message, context = null) {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI sohbet hatası:', error);
      throw error;
    }
  }
}

export default MarketApiService;
```

### React Native Hook
```javascript
// hooks/useMarketApi.js
import { useState, useEffect } from 'react';
import MarketApiService from '../services/MarketApiService';

export const useMarketApi = () => {
  const [apiService] = useState(() => new MarketApiService());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = async (keywords, location, options) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.searchProducts(
        keywords,
        location.latitude,
        location.longitude,
        options
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendations = async (userQuery, keywords, location) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getAIRecommendations(
        userQuery,
        keywords,
        location.latitude,
        location.longitude
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchProducts,
    getAIRecommendations,
    comparePrices: apiService.comparePrices.bind(apiService),
    chatWithAI: apiService.chatWithAI.bind(apiService),
    loading,
    error
  };
};
```

### Konum Servisi
```javascript
// services/LocationService.js
import Geolocation from '@react-native-geolocation/geolocation';

class LocationService {
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }

  static async requestLocationPermission() {
    // Android ve iOS için konum izni isteme
    // Platform-specific implementation
  }
}

export default LocationService;
```

## 📱 Örnek Ekranlar

### 1. Ürün Arama Ekranı
```javascript
// screens/ProductSearchScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useMarketApi } from '../hooks/useMarketApi';
import LocationService from '../services/LocationService';

const ProductSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState(null);
  const { searchProducts, loading, error } = useMarketApi();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
    } catch (error) {
      console.error('Konum alınamadı:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !location) return;

    try {
      const result = await searchProducts(searchQuery, location);
      setProducts(result.content || []);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productWeight}>{item.refinedVolumeOrWeight}</Text>
      {item.productDepotInfoList.map((depot, index) => (
        <View key={index} style={styles.depotInfo}>
          <Text style={styles.marketName}>{depot.marketAdi}</Text>
          <Text style={styles.price}>{depot.unitPrice}</Text>
          <Text style={styles.depotName}>{depot.depotName}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Ürün ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Ara</Text>
      </TouchableOpacity>

      {loading && <Text>Aranıyor...</Text>}
      {error && <Text style={styles.error}>Hata: {error}</Text>}

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white'
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  productWeight: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8
  },
  depotInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  marketName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745'
  },
  depotName: {
    fontSize: 12,
    color: '#666'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16
  }
};

export default ProductSearchScreen;
```

### 2. AI Sohbet Ekranı
```javascript
// screens/AIChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useMarketApi } from '../hooks/useMarketApi';

const AIChatScreen = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { chatWithAI, loading } = useMarketApi();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', text: message, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    
    const currentMessage = message;
    setMessage('');

    try {
      const response = await chatWithAI(currentMessage);
      const aiMessage = { 
        type: 'ai', 
        text: response.response, 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        type: 'error', 
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.', 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const renderMessage = (msg, index) => (
    <View key={index} style={[
      styles.messageContainer,
      msg.type === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.messageText}>{msg.text}</Text>
      <Text style={styles.timestamp}>
        {msg.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map(renderMessage)}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text>AI düşünüyor...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  chatContainer: {
    flex: 1,
    padding: 16
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%'
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end'
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 16,
    color: 'white'
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center'
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16
  }
};

export default AIChatScreen;
```

## 🔧 Konfigürasyon

### Environment Variables
```javascript
// config/environment.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000',
    TIMEOUT: 10000
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com',
    TIMEOUT: 15000
  }
};

export default config[__DEV__ ? 'development' : 'production'];
```

### API Client Konfigürasyonu
```javascript
// config/apiClient.js
import axios from 'axios';
import config from './environment';

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 📊 State Management (Redux Toolkit)

### Store Konfigürasyonu
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './slices/productsSlice';
import chatSlice from './slices/chatSlice';
import locationSlice from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    chat: chatSlice,
    location: locationSlice
  }
});
```

### Products Slice
```javascript
// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MarketApiService from '../../services/MarketApiService';

const apiService = new MarketApiService();

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ keywords, location, options }) => {
    const response = await apiService.searchProducts(
      keywords,
      location.latitude,
      location.longitude,
      options
    );
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: ''
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearProducts: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSearchQuery, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
```

## 🧪 Test Örnekleri

### API Service Testleri
```javascript
// __tests__/MarketApiService.test.js
import MarketApiService from '../services/MarketApiService';

describe('MarketApiService', () => {
  let apiService;

  beforeEach(() => {
    apiService = new MarketApiService('http://localhost:3000');
  });

  test('should search products successfully', async () => {
    const mockResponse = {
      numberOfFound: 1,
      content: [
        {
          id: '123',
          title: 'Test Product',
          brand: 'Test Brand'
        }
      ]
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const result = await apiService.searchProducts(
      'test',
      41.0,
      29.0
    );

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/search',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  });
});
```

## 🚀 Deployment

### React Native Build
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios

# Release build
npx react-native build-android --mode=release
```

### API Server Deployment
```bash
# Production build
npm run build

# Start production server
npm start

# PM2 ile deployment
pm2 start dist/index.js --name "market-api"
```

Bu entegrasyon örneği, Market Fiyatı MCP Server'ının mobil uygulamalarla nasıl kullanılabileceğini göstermektedir. Gerçek projede, hata yönetimi, güvenlik, performans optimizasyonları ve kullanıcı deneyimi iyileştirmeleri eklenmelidir. 