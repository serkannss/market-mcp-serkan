# Market Fiyatı MCP Server

Market Fiyatı API'si için Model Context Protocol (MCP) server ve Gemini AI entegrasyonu.

## 🚀 Özellikler

- **MCP Server**: Model Context Protocol desteği
- **Gemini AI**: Google Gemini AI entegrasyonu
- **Market API**: Market Fiyatı API entegrasyonu
- **Express API**: Mobil uygulama için REST API
- **TypeScript**: Tam tip güvenliği
- **Akıllı Öneriler**: AI destekli ürün önerileri

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Gemini AI API Key

### Adımlar

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Çevre değişkenlerini ayarla:**
```bash

3. **Projeyi derle:**
```bash
npm run build
```

4. **Server'ı başlat:**
```bash
# MCP Server
npm start

# Express API Server (mobil uygulama için)
npm run dev
```

## 🛠️ MCP Araçları

### 1. search_products
Ürün arama işlemi yapar.

**Parametreler:**
- `keywords` (string): Aranacak ürün anahtar kelimeleri
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı
- `distance` (number, opsiyonel): Arama mesafesi (km)
- `size` (number, opsiyonel): Sonuç sayısı

### 2. search_by_id
Ürün ID'si ile arama yapar.

**Parametreler:**
- `productId` (string): Ürün ID'si
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 3. compare_prices
Ürün fiyatlarını karşılaştırır.

**Parametreler:**
- `productId` (string): Karşılaştırılacak ürün ID'si
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 4. find_cheapest
En ucuz ürünleri bulur.

**Parametreler:**
- `keywords` (string): Aranacak ürün anahtar kelimeleri
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 5. filter_by_market
Belirli markete göre ürünleri filtreler.

**Parametreler:**
- `keywords` (string): Aranacak ürün anahtar kelimeleri
- `marketName` (string): Market adı (bim, sok, a101, migros, vb.)
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 6. get_ai_recommendations
AI destekli ürün önerileri alır.

**Parametreler:**
- `userQuery` (string): Kullanıcının sorusu veya isteği
- `keywords` (string): Aranacak ürün anahtar kelimeleri
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 7. analyze_prices
Fiyat analizi yapar ve AI önerisi verir.

**Parametreler:**
- `productId` (string): Analiz edilecek ürün ID'si
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 8. generate_shopping_list
AI destekli alışveriş listesi oluşturur.

**Parametreler:**
- `items` (array): Alışveriş listesindeki ürünler
- `budget` (number, opsiyonel): Bütçe (TL)
- `preferences` (array, opsiyonel): Kullanıcı tercihleri

### 9. compare_markets
Marketleri karşılaştırır ve AI analizi verir.

**Parametreler:**
- `keywords` (string): Karşılaştırma için ürün anahtar kelimeleri
- `latitude` (number): Kullanıcı enlem koordinatı
- `longitude` (number): Kullanıcı boylam koordinatı

### 10. chat
AI ile genel sohbet.

**Parametreler:**
- `message` (string): Kullanıcı mesajı
- `context` (object, opsiyonel): Ek bağlam bilgisi

## 🌐 REST API Endpoints

### Ürün İşlemleri
- `POST /api/search` - Ürün arama
- `POST /api/search-by-id` - ID ile ürün arama
- `POST /api/compare-prices` - Fiyat karşılaştırma
- `POST /api/cheapest` - En ucuz ürünler
- `POST /api/filter-by-market` - Market filtresi
- `POST /api/nearby-markets` - Yakın marketler

### AI İşlemleri
- `POST /api/ai/recommendations` - AI önerileri
- `POST /api/ai/analyze-prices` - Fiyat analizi
- `POST /api/ai/shopping-list` - Alışveriş listesi
- `POST /api/ai/compare-markets` - Market karşılaştırması
- `POST /api/ai/chat` - AI sohbet

### Sistem
- `GET /health` - Sistem durumu

## 📱 Mobil Uygulama Entegrasyonu

### Örnek Kullanım

```javascript
// Ürün arama
const searchProducts = async (keywords, latitude, longitude) => {
  const response = await fetch('http://localhost:3000/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      keywords,
      latitude,
      longitude,
      distance: 5,
      size: 24
    })
  });
  
  return await response.json();
};

// AI önerisi alma
const getAIRecommendations = async (userQuery, keywords, latitude, longitude) => {
  const response = await fetch('http://localhost:3000/api/ai/recommendations', {
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
  
  return await response.json();
};

// Fiyat karşılaştırması
const comparePrices = async (productId, latitude, longitude) => {
  const response = await fetch('http://localhost:3000/api/compare-prices', {
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
  
  return await response.json();
};
```

## 🤖 AI Özellikleri

### Gemini AI Entegrasyonu
- **Ürün Önerileri**: Kullanıcı ihtiyaçlarına göre akıllı öneriler
- **Fiyat Analizi**: Detaylı fiyat analizi ve tasarruf önerileri
- **Alışveriş Listesi**: Bütçe dostu alışveriş listesi oluşturma
- **Market Karşılaştırması**: Marketlerin avantaj/dezavantaj analizi
- **Sohbet**: Genel market ve alışveriş danışmanlığı

### AI Prompt Örnekleri
- "En ucuz patates nerede?"
- "100 TL bütçeyle haftalık alışveriş listesi oluştur"
- "BIM ve A101'i karşılaştır"
- "Hangi marketten alışveriş yapmalıyım?"

## 🏗️ Proje Yapısı

```
src/
├── types/           # TypeScript tip tanımları
│   └── market.ts
├── services/        # Servis sınıfları
│   ├── marketApi.ts
│   └── geminiService.ts
├── mcp/            # MCP server
│   └── server.ts
├── api/            # Express API
│   └── express-server.ts
└── index.ts        # Ana giriş dosyası
```

## 🔧 Geliştirme

### Scripts
```bash
npm run build      # TypeScript derleme
npm run dev        # Geliştirme modu
npm start          # Üretim modu
npm test           # Testleri çalıştır
```

### Linting ve Formatting
```bash
npm run lint       # ESLint kontrolü
npm run format     # Prettier formatting
```

## 📊 Örnek Veri Yapıları

### Ürün Arama Sonucu
```json
{
  "numberOfFound": 52,
  "searchResultType": 1,
  "content": [
    {
      "id": "00000000010CO",
      "title": "Patates",
      "brand": "Markasız",
      "imageUrl": "https://cdn.cimri.io/market/500x500/-_185267.jpg",
      "refinedVolumeOrWeight": "1 kg",
      "productDepotInfoList": [
        {
          "depotId": "tarim_kredi-6761",
          "depotName": "Samsun Atakum Körfez",
          "price": 19.9,
          "unitPrice": "19,90 ₺/kg",
          "marketAdi": "tarim_kredi",
          "longitude": 36.2287,
          "latitude": 41.36649
        }
      ]
    }
  ]
}
```

### AI Önerisi
```json
{
  "recommendation": "Size en uygun patates seçenekleri...",
  "products": [...]
}
```

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key
MARKET_API_BASE_URL=https://api.marketfiyati.org.tr/api/v2
PORT=3000
NODE_ENV=production
```

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**Market Fiyatı MCP Server** - Akıllı alışveriş deneyimi için AI destekli market fiyat karşılaştırma sistemi. 
