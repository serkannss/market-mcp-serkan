import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MarketApiService } from '../services/marketApi.js';
import { GeminiService } from '../services/geminiService.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
// Servisler
const marketApi = new MarketApiService();
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Market Fiyatı API'
    });
});
// Ürün arama
app.post('/api/search', async (req, res) => {
    try {
        const { keywords, latitude, longitude, distance = 5, size = 24 } = req.body;
        if (!keywords || !latitude || !longitude) {
            return res.status(400).json({
                error: 'keywords, latitude ve longitude parametreleri gerekli'
            });
        }
        const result = await marketApi.searchProducts({
            keywords,
            latitude,
            longitude,
            distance,
            size
        });
        res.json(result);
    }
    catch (error) {
        console.error('Arama hatası:', error);
        res.status(500).json({
            error: 'Ürün arama başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// ID ile ürün arama
app.post('/api/search-by-id', async (req, res) => {
    try {
        const { productId, latitude, longitude } = req.body;
        if (!productId || !latitude || !longitude) {
            return res.status(400).json({
                error: 'productId, latitude ve longitude parametreleri gerekli'
            });
        }
        const result = await marketApi.searchByIdentity({
            identity: productId,
            identityType: 'id',
            latitude,
            longitude
        });
        res.json(result);
    }
    catch (error) {
        console.error('ID arama hatası:', error);
        res.status(500).json({
            error: 'ID ile arama başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Fiyat karşılaştırması
app.post('/api/compare-prices', async (req, res) => {
    try {
        const { productId, latitude, longitude } = req.body;
        if (!productId || !latitude || !longitude) {
            return res.status(400).json({
                error: 'productId, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        const result = await marketApi.comparePrices(productId, location);
        res.json(result);
    }
    catch (error) {
        console.error('Fiyat karşılaştırma hatası:', error);
        res.status(500).json({
            error: 'Fiyat karşılaştırması başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// En ucuz ürünler
app.post('/api/cheapest', async (req, res) => {
    try {
        const { keywords, latitude, longitude } = req.body;
        if (!keywords || !latitude || !longitude) {
            return res.status(400).json({
                error: 'keywords, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        const result = await marketApi.findCheapestProducts(keywords, location);
        res.json(result);
    }
    catch (error) {
        console.error('En ucuz ürün arama hatası:', error);
        res.status(500).json({
            error: 'En ucuz ürün arama başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Markete göre filtreleme
app.post('/api/filter-by-market', async (req, res) => {
    try {
        const { keywords, marketName, latitude, longitude } = req.body;
        if (!keywords || !marketName || !latitude || !longitude) {
            return res.status(400).json({
                error: 'keywords, marketName, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        const result = await marketApi.filterByMarket(keywords, marketName, location);
        res.json(result);
    }
    catch (error) {
        console.error('Market filtreleme hatası:', error);
        res.status(500).json({
            error: 'Market filtreleme başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// AI önerileri
app.post('/api/ai/recommendations', async (req, res) => {
    try {
        const { userQuery, keywords, latitude, longitude } = req.body;
        if (!userQuery || !keywords || !latitude || !longitude) {
            return res.status(400).json({
                error: 'userQuery, keywords, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        // Önce ürünleri ara
        const products = await marketApi.searchProducts({
            keywords,
            latitude,
            longitude,
            size: 10
        });
        // AI önerisi al
        const recommendation = await geminiService.getProductRecommendations(userQuery, products.content, location);
        res.json({
            recommendation,
            products: products.content
        });
    }
    catch (error) {
        console.error('AI öneri hatası:', error);
        res.status(500).json({
            error: 'AI önerisi alınamadı',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Fiyat analizi
app.post('/api/ai/analyze-prices', async (req, res) => {
    try {
        const { productId, latitude, longitude } = req.body;
        if (!productId || !latitude || !longitude) {
            return res.status(400).json({
                error: 'productId, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        // Fiyat karşılaştırması yap
        const priceComparison = await marketApi.comparePrices(productId, location);
        // AI analizi al
        const analysis = await geminiService.analyzePrices(priceComparison);
        res.json({
            analysis,
            priceComparison
        });
    }
    catch (error) {
        console.error('Fiyat analizi hatası:', error);
        res.status(500).json({
            error: 'Fiyat analizi başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Alışveriş listesi oluşturma
app.post('/api/ai/shopping-list', async (req, res) => {
    try {
        const { items, budget, preferences } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                error: 'items parametresi gerekli ve array olmalı'
            });
        }
        const shoppingList = await geminiService.generateShoppingList(items, budget, preferences);
        res.json({ shoppingList });
    }
    catch (error) {
        console.error('Alışveriş listesi hatası:', error);
        res.status(500).json({
            error: 'Alışveriş listesi oluşturulamadı',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Market karşılaştırması
app.post('/api/ai/compare-markets', async (req, res) => {
    try {
        const { keywords, latitude, longitude } = req.body;
        if (!keywords || !latitude || !longitude) {
            return res.status(400).json({
                error: 'keywords, latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        // Ürünleri ara
        const products = await marketApi.searchProducts({
            keywords,
            latitude,
            longitude,
            size: 50
        });
        // AI karşılaştırması al
        const comparison = await geminiService.compareMarkets(products.content);
        res.json({
            comparison,
            products: products.content
        });
    }
    catch (error) {
        console.error('Market karşılaştırma hatası:', error);
        res.status(500).json({
            error: 'Market karşılaştırması başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// AI sohbet
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        if (!message) {
            return res.status(400).json({
                error: 'message parametresi gerekli'
            });
        }
        const response = await geminiService.chat(message, context);
        res.json({ response });
    }
    catch (error) {
        console.error('Sohbet hatası:', error);
        res.status(500).json({
            error: 'Mesaj işlenemedi',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Yakındaki marketler
app.post('/api/nearby-markets', async (req, res) => {
    try {
        const { latitude, longitude, distance = 5 } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({
                error: 'latitude ve longitude parametreleri gerekli'
            });
        }
        const location = { latitude, longitude };
        const result = await marketApi.findNearbyMarkets(location, distance);
        res.json(result);
    }
    catch (error) {
        console.error('Yakın market arama hatası:', error);
        res.status(500).json({
            error: 'Yakın market arama başarısız',
            message: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Sunucu hatası:', err);
    res.status(500).json({
        error: 'Sunucu hatası',
        message: err.message
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint bulunamadı',
        path: req.originalUrl
    });
});
// Server'ı başlat
app.listen(port, () => {
    console.log(`🚀 Market Fiyatı API Server ${port} portunda çalışıyor`);
    console.log(`📱 Mobil uygulama entegrasyonu hazır`);
    console.log(`🤖 Gemini AI entegrasyonu aktif`);
    console.log(`📊 Mevcut endpoints:`);
    console.log(`   POST /api/search - Ürün arama`);
    console.log(`   POST /api/search-by-id - ID ile arama`);
    console.log(`   POST /api/compare-prices - Fiyat karşılaştırma`);
    console.log(`   POST /api/cheapest - En ucuz ürünler`);
    console.log(`   POST /api/filter-by-market - Market filtresi`);
    console.log(`   POST /api/ai/recommendations - AI önerileri`);
    console.log(`   POST /api/ai/analyze-prices - Fiyat analizi`);
    console.log(`   POST /api/ai/shopping-list - Alışveriş listesi`);
    console.log(`   POST /api/ai/compare-markets - Market karşılaştırması`);
    console.log(`   POST /api/ai/chat - AI sohbet`);
    console.log(`   POST /api/nearby-markets - Yakın marketler`);
});
export default app;
//# sourceMappingURL=express-server.js.map