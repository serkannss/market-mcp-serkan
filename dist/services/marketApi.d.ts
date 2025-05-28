import { SearchRequest, SearchByIdentityRequest, SearchResponse, Product, PriceComparison, MarketLocation } from '../types/market.js';
export declare class MarketApiService {
    private api;
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * Ürün arama işlemi
     */
    searchProducts(request: SearchRequest): Promise<SearchResponse>;
    /**
     * ID ile ürün arama
     */
    searchByIdentity(request: SearchByIdentityRequest): Promise<SearchResponse>;
    /**
     * Fiyat karşılaştırması yap
     */
    comparePrices(productId: string, location: MarketLocation): Promise<PriceComparison>;
    /**
     * Yakındaki marketleri bul
     */
    findNearbyMarkets(location: MarketLocation, distance?: number): Promise<Product[]>;
    /**
     * En ucuz ürünleri bul
     */
    findCheapestProducts(keywords: string, location: MarketLocation): Promise<Product[]>;
    /**
     * Markete göre ürün filtrele
     */
    filterByMarket(keywords: string, marketName: string, location: MarketLocation): Promise<Product[]>;
}
//# sourceMappingURL=marketApi.d.ts.map