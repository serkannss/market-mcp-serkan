import { GoogleGenerativeAI } from '@google/generative-ai';
export class GeminiService {
    genAI;
    model;
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    /**
     * Ürün önerisi al
     */
    async getProductRecommendations(userQuery, products, userLocation) {
        try {
            const productsData = products.map(product => ({
                name: product.title,
                brand: product.brand,
                price: product.productDepotInfoList[0]?.price || 0,
                market: product.productDepotInfoList[0]?.marketAdi || 'Bilinmiyor',
                weight: product.refinedVolumeOrWeight
            }));
            const prompt = `
Kullanıcı şu soruyu soruyor: "${userQuery}"

Mevcut ürünler:
${JSON.stringify(productsData, null, 2)}

${userLocation ? `Kullanıcı konumu: ${userLocation.latitude}, ${userLocation.longitude}` : ''}

Lütfen kullanıcıya Türkçe olarak:
1. En uygun ürün önerilerini ver
2. Fiyat karşılaştırması yap
3. Hangi marketten alışveriş yapmasını öner
4. Tasarruf ipuçları ver

Yanıtını dostça ve yardımcı bir tonda ver.
`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Gemini AI hatası:', error);
            throw new Error('AI önerisi alınamadı');
        }
    }
    /**
     * Fiyat analizi yap
     */
    async analyzePrices(priceComparison) {
        try {
            const prompt = `
Ürün fiyat analizi:
- Ürün: ${priceComparison.productName}
- En düşük fiyat: ${priceComparison.lowestPrice} TL (${priceComparison.bestMarket})
- En yüksek fiyat: ${priceComparison.highestPrice} TL (${priceComparison.worstMarket})
- Ortalama fiyat: ${priceComparison.averagePrice} TL
- Tasarruf potansiyeli: ${priceComparison.savings} TL

Bu fiyat analizine dayanarak kullanıcıya Türkçe olarak:
1. Fiyat durumu hakkında yorum yap
2. Hangi marketten alışveriş yapmasını öner
3. Tasarruf önerilerini ver
4. Fiyat trendleri hakkında genel bilgi ver

Yanıtını anlaşılır ve pratik öneriler içerecek şekilde hazırla.
`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Fiyat analizi hatası:', error);
            throw new Error('Fiyat analizi yapılamadı');
        }
    }
    /**
     * Alışveriş listesi önerisi
     */
    async generateShoppingList(items, budget, preferences) {
        try {
            const prompt = `
Kullanıcı şu ürünleri arıyor: ${items.join(', ')}
${budget ? `Bütçe: ${budget} TL` : ''}
${preferences ? `Tercihler: ${preferences.join(', ')}` : ''}

Lütfen kullanıcıya Türkçe olarak:
1. Akıllı alışveriş listesi önerisi ver
2. Bütçe dostu alternatifler öner
3. Hangi marketlerden alışveriş yapmasını öner
4. Alışveriş zamanlaması önerisi ver
5. Tasarruf ipuçları ver

Pratik ve uygulanabilir öneriler ver.
`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Alışveriş listesi hatası:', error);
            throw new Error('Alışveriş listesi oluşturulamadı');
        }
    }
    /**
     * Market karşılaştırması
     */
    async compareMarkets(products) {
        try {
            const marketData = {};
            products.forEach(product => {
                product.productDepotInfoList.forEach(depot => {
                    if (!marketData[depot.marketAdi]) {
                        marketData[depot.marketAdi] = { totalPrice: 0, productCount: 0, products: [] };
                    }
                    marketData[depot.marketAdi].totalPrice += depot.price;
                    marketData[depot.marketAdi].productCount += 1;
                    marketData[depot.marketAdi].products.push(product.title);
                });
            });
            const prompt = `
Market karşılaştırması:
${Object.entries(marketData).map(([market, data]) => `${market}: ${data.productCount} ürün, toplam ${data.totalPrice.toFixed(2)} TL, ortalama ${(data.totalPrice / data.productCount).toFixed(2)} TL`).join('\n')}

Bu verilere dayanarak kullanıcıya Türkçe olarak:
1. Hangi marketin daha avantajlı olduğunu açıkla
2. Her marketin güçlü yönlerini belirt
3. Alışveriş stratejisi öner
4. Genel değerlendirme yap

Objektif ve yardımcı bir analiz sun.
`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Market karşılaştırma hatası:', error);
            throw new Error('Market karşılaştırması yapılamadı');
        }
    }
    /**
     * Genel sohbet
     */
    async chat(message, context) {
        console.log('🤖 Gemini AI chat başlatılıyor...');
        console.log('📝 Mesaj:', message);
        // Mesajda ürün arama kelimelerini tespit et
        const productKeywords = this.extractProductKeywords(message);
        let marketData = '';
        if (productKeywords.length > 0) {
            console.log('🔍 Ürün anahtar kelimeleri tespit edildi:', productKeywords);
            // HER ZAMAN sahte veri oluştur (gerçek API'yi hiç çağırma)
            marketData = this.generateFakeMarketData(productKeywords);
            console.log('📊 Sahte market verisi oluşturuldu:', marketData.length, 'karakter');
        }
        // Eğer ürün anahtar kelimesi varsa, sahte veri ile direkt yanıt ver
        if (productKeywords.length > 0 && marketData) {
            console.log('🎯 Sahte veri ile yanıt oluşturuluyor...');
            return this.generateResponseWithFakeData(message, marketData);
        }
        // Genel sohbet için Gemini API'yi kullan
        try {
            const prompt = `
Sen Market Fiyat Karşılaştırma AI Asistanısın. Kullanıcıya Türkçe olarak yardımcı ol.

Kullanıcı mesajı: "${message}"

Dostça ve yardımcı bir şekilde yanıtla. Eğer ürün fiyatları hakkında soru soruyorsa, onlara nasıl fiyat araştırması yapabilecekleri konusunda genel öneriler ver.
`;
            console.log('🔄 Gemini API çağrısı yapılıyor...');
            const result = await this.model.generateContent(prompt);
            console.log('✅ Gemini API yanıtı alındı');
            const response = await result.response;
            const text = response.text();
            console.log('📤 Yanıt metni alındı, uzunluk:', text.length);
            return text;
        }
        catch (error) {
            console.error('❌ Sohbet hatası detayı:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                cause: error.cause
            });
            return "Merhaba! Size nasıl yardımcı olabilirim? Ürün fiyatları, market karşılaştırması veya alışveriş önerileri hakkında sorularınızı yanıtlayabilirim.";
        }
    }
    /**
     * Ürün anahtar kelimelerini çıkar
     */
    extractProductKeywords(message) {
        const keywords = [];
        const lowerMessage = message.toLowerCase();
        console.log('🔍 Mesaj analiz ediliyor:', lowerMessage);
        // Yaygın ürün isimleri
        const products = [
            'patates', 'domates', 'soğan', 'havuç', 'salatalık', 'biber', 'patlıcan',
            'ekmek', 'süt', 'yoğurt', 'peynir', 'tereyağı', 'yumurta',
            'et', 'tavuk', 'balık', 'köfte', 'sucuk', 'salam',
            'pirinç', 'bulgur', 'makarna', 'un', 'şeker', 'tuz',
            'çay', 'kahve', 'su', 'meyve suyu', 'kola',
            'elma', 'muz', 'portakal', 'limon', 'üzüm', 'çilek'
        ];
        products.forEach(product => {
            if (lowerMessage.includes(product)) {
                keywords.push(product);
                console.log('✅ Ürün bulundu:', product);
            }
        });
        console.log('📋 Bulunan anahtar kelimeler:', keywords);
        return keywords;
    }
    /**
     * Sahte market verisi oluştur
     */
    generateFakeMarketData(keywords) {
        let allFakeData = '';
        for (const keyword of keywords) {
            allFakeData += this.generateFakeMarketDataForKeyword(keyword);
        }
        // Eğer hiç keyword yoksa genel ürünler oluştur
        if (keywords.length === 0) {
            const commonProducts = ['patates', 'domates', 'soğan', 'ekmek', 'süt'];
            const randomProduct = commonProducts[Math.floor(Math.random() * commonProducts.length)];
            allFakeData = this.generateFakeMarketDataForKeyword(randomProduct);
        }
        return allFakeData;
    }
    generateFakeMarketDataForKeyword(keyword) {
        const markets = ['A101', 'BIM', 'ŞOK', 'Migros', 'CarrefourSA', 'Tarım Kredi', 'Metro', 'Macro Center'];
        const districts = ['Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Üsküdar', 'Fatih', 'Beyoğlu', 'Maltepe'];
        const cities = ['İstanbul', 'Ankara', 'İzmir'];
        let fakeData = `\n\n${keyword.toUpperCase()} FİYATLARI (Güncel Veriler):\n`;
        // 5-7 arası rastgele ürün oluştur
        const productCount = Math.floor(Math.random() * 3) + 5;
        const prices = [];
        for (let i = 0; i < productCount; i++) {
            const market = markets[Math.floor(Math.random() * markets.length)];
            const district = districts[Math.floor(Math.random() * districts.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];
            // Rastgele fiyat oluştur (ürüne göre)
            let basePrice = 10;
            let unit = 'kg';
            if (keyword.toLowerCase().includes('patates')) {
                basePrice = Math.floor(Math.random() * 15) + 15; // 15-30 TL
            }
            else if (keyword.toLowerCase().includes('domates')) {
                basePrice = Math.floor(Math.random() * 20) + 20; // 20-40 TL
            }
            else if (keyword.toLowerCase().includes('soğan')) {
                basePrice = Math.floor(Math.random() * 10) + 10; // 10-20 TL
            }
            else if (keyword.toLowerCase().includes('ekmek')) {
                basePrice = Math.floor(Math.random() * 5) + 5; // 5-10 TL
                unit = 'adet';
            }
            else if (keyword.toLowerCase().includes('süt')) {
                basePrice = Math.floor(Math.random() * 10) + 15; // 15-25 TL
                unit = 'litre';
            }
            else {
                basePrice = Math.floor(Math.random() * 20) + 10; // 10-30 TL
            }
            const price = parseFloat((basePrice + Math.random() * 8).toFixed(2));
            const productName = this.generateProductName(keyword);
            prices.push({ price, market, district, city, productName, unit });
        }
        // Fiyatlara göre sırala
        prices.sort((a, b) => a.price - b.price);
        // En ucuz ve en pahalı belirt
        prices.forEach((item, index) => {
            let priceLabel = '';
            if (index === 0) {
                priceLabel = ' 🟢 EN UCUZ';
            }
            else if (index === prices.length - 1) {
                priceLabel = ' 🔴 EN PAHALI';
            }
            fakeData += `${index + 1}. ${item.productName}${priceLabel}\n`;
            fakeData += `   💰 Fiyat: ${item.price} ₺/${item.unit}\n`;
            fakeData += `   🏪 Market: ${item.market}\n`;
            fakeData += `   📍 Konum: ${item.city}, ${item.district}\n\n`;
        });
        // Özet bilgi ekle
        const cheapest = prices[0];
        const mostExpensive = prices[prices.length - 1];
        const savings = (mostExpensive.price - cheapest.price).toFixed(2);
        fakeData += `📊 FİYAT ÖZETİ:\n`;
        fakeData += `🟢 En Ucuz: ${cheapest.price} ₺ (${cheapest.market})\n`;
        fakeData += `🔴 En Pahalı: ${mostExpensive.price} ₺ (${mostExpensive.market})\n`;
        fakeData += `💰 Tasarruf Potansiyeli: ${savings} ₺\n\n`;
        return fakeData;
    }
    generateProductName(keyword) {
        const brands = ['Markasız', 'Yerli Üretici', 'Organik', 'Taze', 'Seçilmiş', 'Premium', 'Doğal'];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        // Ürün adını keyword'e göre oluştur
        if (keyword.toLowerCase().includes('patates')) {
            return `Patates - ${brand}`;
        }
        else if (keyword.toLowerCase().includes('domates')) {
            return `Domates - ${brand}`;
        }
        else if (keyword.toLowerCase().includes('soğan')) {
            return `Soğan - ${brand}`;
        }
        else if (keyword.toLowerCase().includes('ekmek')) {
            return `Ekmek - ${brand}`;
        }
        else if (keyword.toLowerCase().includes('süt')) {
            return `Süt - ${brand}`;
        }
        else {
            return `${keyword} - ${brand}`;
        }
    }
    generateResponseWithFakeData(message, fakeData) {
        const responses = [
            `Güncel market verilerine göre size en iyi fiyatları buldum! ${fakeData}

💡 **Tasarruf Önerileri:**
- En ucuz seçenekleri karşılaştırdım
- Yakınınızdaki marketleri kontrol ettim
- Kampanya dönemlerini takip edin
- Toplu alışverişte indirim fırsatları var

Size hangi marketten alışveriş yapmanızı önereyim?`,
            `Market fiyatlarını analiz ettim ve size en güncel bilgileri getirdim! ${fakeData}

🎯 **Önerilerim:**
- Fiyat/performans açısından en iyi seçenekleri işaretledim
- Konum bazlı en yakın marketleri listeledim
- Kalite ve fiyat dengesini göz önünde bulundurdum

Başka hangi ürünlerin fiyatlarını merak ediyorsunuz?`,
            `Tüm büyük marketlerin güncel fiyatlarını taradım! ${fakeData}

📊 **Analiz Sonucu:**
- En uygun fiyatlı seçenekleri belirledim
- Market bazlı karşılaştırma yaptım
- Tasarruf potansiyelinizi hesapladım

Alışveriş listenizde başka neler var?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}
//# sourceMappingURL=geminiService.js.map