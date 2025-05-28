import axios from 'axios';
export class MarketApiService {
    api;
    baseUrl;
    constructor(baseUrl = 'https://api.marketfiyati.org.tr/api/v2') {
        this.baseUrl = baseUrl;
        this.api = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }
    /**
     * Ürün arama işlemi
     */
    async searchProducts(request) {
        try {
            const response = await this.api.post('/search', request);
            return response.data;
        }
        catch (error) {
            console.error('Ürün arama hatası:', error);
            throw new Error(`Ürün arama başarısız: ${error}`);
        }
    }
    /**
     * ID ile ürün arama
     */
    async searchByIdentity(request) {
        try {
            const response = await this.api.post('/searchByIdentity', request);
            return response.data;
        }
        catch (error) {
            console.error('ID ile arama hatası:', error);
            throw new Error(`ID ile arama başarısız: ${error}`);
        }
    }
    /**
     * Fiyat karşılaştırması yap
     */
    async comparePrices(productId, location) {
        try {
            const searchResult = await this.searchByIdentity({
                identity: productId,
                identityType: 'id',
                latitude: location.latitude,
                longitude: location.longitude,
                size: 1
            });
            if (searchResult.content.length === 0) {
                throw new Error('Ürün bulunamadı');
            }
            const product = searchResult.content[0];
            const prices = product.productDepotInfoList.map(depot => depot.price);
            if (prices.length === 0) {
                throw new Error('Fiyat bilgisi bulunamadı');
            }
            const lowestPrice = Math.min(...prices);
            const highestPrice = Math.max(...prices);
            const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            const bestDepot = product.productDepotInfoList.find(depot => depot.price === lowestPrice);
            const worstDepot = product.productDepotInfoList.find(depot => depot.price === highestPrice);
            return {
                productId: product.id,
                productName: product.title,
                lowestPrice,
                highestPrice,
                averagePrice: Math.round(averagePrice * 100) / 100,
                priceRange: highestPrice - lowestPrice,
                bestMarket: bestDepot?.marketAdi || 'Bilinmiyor',
                worstMarket: worstDepot?.marketAdi || 'Bilinmiyor',
                savings: highestPrice - lowestPrice
            };
        }
        catch (error) {
            console.error('Fiyat karşılaştırma hatası:', error);
            throw error;
        }
    }
    /**
     * Yakındaki marketleri bul
     */
    async findNearbyMarkets(location, distance = 5) {
        try {
            const searchResult = await this.searchProducts({
                keywords: 'patates', // Örnek ürün
                latitude: location.latitude,
                longitude: location.longitude,
                distance,
                size: 50
            });
            return searchResult.content;
        }
        catch (error) {
            console.error('Yakın market arama hatası:', error);
            throw error;
        }
    }
    /**
     * En ucuz ürünleri bul
     */
    async findCheapestProducts(keywords, location) {
        try {
            const searchResult = await this.searchProducts({
                keywords,
                latitude: location.latitude,
                longitude: location.longitude,
                size: 24
            });
            // Fiyata göre sırala
            const sortedProducts = searchResult.content.sort((a, b) => {
                const aMinPrice = Math.min(...a.productDepotInfoList.map(depot => depot.price));
                const bMinPrice = Math.min(...b.productDepotInfoList.map(depot => depot.price));
                return aMinPrice - bMinPrice;
            });
            return sortedProducts;
        }
        catch (error) {
            console.error('En ucuz ürün arama hatası:', error);
            throw error;
        }
    }
    /**
     * Markete göre ürün filtrele
     */
    async filterByMarket(keywords, marketName, location) {
        try {
            const searchResult = await this.searchProducts({
                keywords,
                latitude: location.latitude,
                longitude: location.longitude,
                size: 50
            });
            // Belirtilen markete göre filtrele
            const filteredProducts = searchResult.content.filter(product => product.productDepotInfoList.some(depot => depot.marketAdi.toLowerCase().includes(marketName.toLowerCase())));
            return filteredProducts;
        }
        catch (error) {
            console.error('Market filtreleme hatası:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=marketApi.js.map