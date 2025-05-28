// Mobil Uygulama API Test Dosyası
// Bu dosya mobil uygulamanın API entegrasyonunu test etmek için kullanılır

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Test verileri
const testLocation = {
  latitude: 41.0082,
  longitude: 28.9784
};

async function testMobileAPI() {
  console.log('📱 Mobil Uygulama API Testleri Başlıyor...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Health Check Testi...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // 2. Ürün Arama Testi
    console.log('2️⃣ Ürün Arama Testi...');
    const searchResponse = await axios.post(`${API_BASE_URL}/api/search`, {
      keywords: 'patates',
      latitude: testLocation.latitude,
      longitude: testLocation.longitude,
      distance: 5,
      size: 5
    });
    console.log(`✅ ${searchResponse.data.numberOfFound} ürün bulundu`);
    if (searchResponse.data.content.length > 0) {
      const firstProduct = searchResponse.data.content[0];
      console.log(`   İlk ürün: ${firstProduct.title}`);
      if (firstProduct.productDepotInfoList.length > 0) {
        const firstPrice = firstProduct.productDepotInfoList[0];
        console.log(`   Fiyat: ${firstPrice.price} ₺ (${firstPrice.marketAdi})`);
      }
    }
    console.log('');

    // 3. Fiyat Karşılaştırma Testi
    if (searchResponse.data.content.length > 0) {
      console.log('3️⃣ Fiyat Karşılaştırma Testi...');
      const productId = searchResponse.data.content[0].id;
      const compareResponse = await axios.post(`${API_BASE_URL}/api/compare-prices`, {
        productId: productId,
        latitude: testLocation.latitude,
        longitude: testLocation.longitude
      });
      console.log('✅ Fiyat Karşılaştırması:');
      console.log(`   En düşük: ${compareResponse.data.lowestPrice} ₺ (${compareResponse.data.bestMarket})`);
      console.log(`   En yüksek: ${compareResponse.data.highestPrice} ₺ (${compareResponse.data.worstMarket})`);
      console.log(`   Tasarruf: ${compareResponse.data.savings} ₺`);
      console.log('');
    }

    // 4. AI Sohbet Testi
    console.log('4️⃣ AI Sohbet Testi...');
    const chatResponse = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
      message: 'En ucuz patates nerede bulabilirim?',
      context: { location: testLocation }
    });
    console.log('✅ AI Yanıtı:', chatResponse.data.response);
    console.log('');

    // 5. En Ucuz Ürünler Testi
    console.log('5️⃣ En Ucuz Ürünler Testi...');
    const cheapestResponse = await axios.post(`${API_BASE_URL}/api/cheapest`, {
      keywords: 'patates',
      latitude: testLocation.latitude,
      longitude: testLocation.longitude
    });
    console.log(`✅ ${cheapestResponse.data.length} en ucuz ürün bulundu`);
    if (cheapestResponse.data.length > 0) {
      const cheapest = cheapestResponse.data[0];
      console.log(`   En ucuz: ${cheapest.title}`);
      if (cheapest.productDepotInfoList.length > 0) {
        const price = cheapest.productDepotInfoList[0];
        console.log(`   Fiyat: ${price.price} ₺ (${price.marketAdi})`);
      }
    }
    console.log('');

    console.log('🎉 Tüm testler başarıyla tamamlandı!');
    console.log('📱 Mobil uygulama API entegrasyonu hazır!');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Test fonksiyonunu çalıştır
testMobileAPI(); 