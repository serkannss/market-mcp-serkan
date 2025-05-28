# 📱 Market Fiyat Karşılaştırma - Mobil Uygulama

Modern ve kullanıcı dostu React Native uygulaması ile market fiyatlarını karşılaştırın!

## 🚀 Özellikler

### ✅ Mevcut Özellikler
- 🏠 **Ana Sayfa**: Sistem durumu, konum bilgisi, hızlı işlemler
- 🔍 **Ürün Arama**: Gerçek zamanlı ürün arama
- ⚖️ **Fiyat Karşılaştırma**: Marketler arası fiyat karşılaştırma
- 🤖 **AI Asistan**: Gemini AI ile akıllı alışveriş önerileri
- 📍 **Konum Servisi**: GPS tabanlı yakın market bulma
- 🎨 **Modern UI**: Material Design 3 ile şık arayüz
- 🌙 **Karanlık Mod**: Otomatik tema değişimi

### 🔄 Geliştirme Aşamasında
- 📊 **Detaylı Analiz**: Fiyat trendleri ve grafikler
- 📝 **Alışveriş Listesi**: AI destekli liste oluşturma
- ⭐ **Favoriler**: Favori ürün ve marketler
- 🔔 **Bildirimler**: Fiyat düşüş bildirimleri
- 👤 **Kullanıcı Profili**: Kişiselleştirilmiş deneyim

## 🛠️ Teknoloji Stack

### Frontend
- **React Native** 0.79.2 - Cross-platform mobil geliştirme
- **TypeScript** - Tip güvenliği
- **React Navigation** 6.x - Navigasyon yönetimi
- **React Native Paper** - Material Design bileşenleri
- **React Query** - Veri yönetimi ve cache
- **Zustand** - State yönetimi

### Backend Entegrasyonu
- **Axios** - HTTP client
- **Market Fiyatı API** - Ürün ve fiyat verileri
- **Gemini AI** - Yapay zeka önerileri
- **Geolocation** - Konum servisleri

### UI/UX
- **Material Design 3** - Modern tasarım sistemi
- **React Native Vector Icons** - İkon seti
- **React Native Animatable** - Animasyonlar
- **Lottie** - Gelişmiş animasyonlar

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için)

### Adımlar

1. **Bağımlılıkları yükle**
   ```bash
   npm install
   ```

2. **iOS için (sadece macOS)**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android için**
   ```bash
   npx react-native run-android
   ```

4. **iOS için**
   ```bash
   npx react-native run-ios
   ```

## 🔧 Geliştirme

### API Konfigürasyonu

`src/services/ApiService.ts` dosyasında API base URL'ini güncelleyin:

```typescript
// Android Emulator için
this.baseURL = 'http://10.0.2.2:3000';

// iOS Simulator için
this.baseURL = 'http://localhost:3000';

// Gerçek cihaz için (IP adresinizi yazın)
this.baseURL = 'http://192.168.1.100:3000';
```

### Konum İzinleri

#### Android
`android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### iOS
`ios/MarketFiyatApp/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Market fiyatlarını karşılaştırmak için konumunuza ihtiyacımız var.</string>
```

## 📱 Ekran Görüntüleri

### Ana Sayfa
- ✅ Sistem durumu kontrolü
- 📍 Konum bilgisi
- 🚀 Hızlı işlem butonları
- 📦 Popüler ürünler

### Özellikler
- 🔍 **Arama**: Ürün adı ile arama
- ⚖️ **Karşılaştırma**: Fiyat karşılaştırma
- 🤖 **AI**: Akıllı öneriler
- 👤 **Profil**: Kullanıcı ayarları

## 🎨 Tema Sistemi

### Renkler
```typescript
// Ana renkler
primary: '#007bff'      // Mavi
secondary: '#28a745'    // Yeşil
tertiary: '#ffc107'     // Sarı

// Market renkleri
bim: '#0066cc'
a101: '#e31e24'
sok: '#ff6600'
migros: '#ff8c00'
tarim_kredi: '#228b22'
```

### Karanlık Mod
Otomatik sistem teması algılama ve manuel değiştirme seçeneği.

## 🔗 API Entegrasyonu

### Mevcut Endpoint'ler
- `GET /health` - Sistem durumu
- `POST /api/search` - Ürün arama
- `POST /api/compare-prices` - Fiyat karşılaştırma
- `POST /api/ai/chat` - AI sohbet
- `POST /api/ai/recommendations` - AI önerileri

### Örnek Kullanım
```typescript
// Ürün arama
const products = await ApiService.searchProducts(
  'patates',
  { latitude: 41.0082, longitude: 28.9784 }
);

// AI sohbet
const response = await ApiService.chatWithAI(
  'En ucuz patates nerede?'
);
```

## 🧪 Test

```bash
# Unit testler
npm test

# E2E testler (Detox)
npm run test:e2e

# Lint kontrolü
npm run lint
```

## 📦 Build

### Android
```bash
# Debug APK
npm run build:android

# Release APK
cd android && ./gradlew assembleRelease
```

### iOS
```bash
# Release build
npm run build:ios
```

## 🚀 Deployment

### Android
1. Google Play Console'a APK yükle
2. Metadata ve ekran görüntüleri ekle
3. Yayınla

### iOS
1. App Store Connect'e IPA yükle
2. App Store Review'a gönder
3. Onay bekle

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Geliştirici**: Market Fiyat Ekibi
- **Email**: info@marketfiyat.com
- **Website**: https://marketfiyat.com

---

**🎉 Market Fiyat Karşılaştırma ile akıllı alışveriş yapın!** 🛒 