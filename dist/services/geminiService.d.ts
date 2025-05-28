import { Product, PriceComparison } from '../types/market.js';
export declare class GeminiService {
    private genAI;
    private model;
    constructor(apiKey: string);
    /**
     * Ürün önerisi al
     */
    getProductRecommendations(userQuery: string, products: Product[], userLocation?: {
        latitude: number;
        longitude: number;
    }): Promise<string>;
    /**
     * Fiyat analizi yap
     */
    analyzePrices(priceComparison: PriceComparison): Promise<string>;
    /**
     * Alışveriş listesi önerisi
     */
    generateShoppingList(items: string[], budget?: number, preferences?: string[]): Promise<string>;
    /**
     * Market karşılaştırması
     */
    compareMarkets(products: Product[]): Promise<string>;
    /**
     * Genel sohbet
     */
    chat(message: string, context?: any): Promise<string>;
    /**
     * Ürün anahtar kelimelerini çıkar
     */
    private extractProductKeywords;
    /**
     * Sahte market verisi oluştur
     */
    private generateFakeMarketData;
    private generateFakeMarketDataForKeyword;
    private generateProductName;
    private generateResponseWithFakeData;
}
//# sourceMappingURL=geminiService.d.ts.map