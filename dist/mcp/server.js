import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { MarketApiService } from '../services/marketApi.js';
import { GeminiService } from '../services/geminiService.js';
export class MarketMCPServer {
    server;
    marketApi;
    geminiService;
    constructor(geminiApiKey, marketApiUrl) {
        this.server = new Server({
            name: 'market-fiyati-mcp',
            version: '1.0.0',
        });
        this.marketApi = new MarketApiService(marketApiUrl);
        this.geminiService = new GeminiService(geminiApiKey);
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // Araçları listele
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'search_products',
                        description: 'Ürün arama işlemi yapar',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                keywords: {
                                    type: 'string',
                                    description: 'Aranacak ürün anahtar kelimeleri'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                },
                                distance: {
                                    type: 'number',
                                    description: 'Arama mesafesi (km)',
                                    default: 5
                                },
                                size: {
                                    type: 'number',
                                    description: 'Sonuç sayısı',
                                    default: 24
                                }
                            },
                            required: ['keywords', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'search_by_id',
                        description: 'Ürün ID\'si ile arama yapar',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                productId: {
                                    type: 'string',
                                    description: 'Ürün ID\'si'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['productId', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'compare_prices',
                        description: 'Ürün fiyatlarını karşılaştırır',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                productId: {
                                    type: 'string',
                                    description: 'Karşılaştırılacak ürün ID\'si'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['productId', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'find_cheapest',
                        description: 'En ucuz ürünleri bulur',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                keywords: {
                                    type: 'string',
                                    description: 'Aranacak ürün anahtar kelimeleri'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['keywords', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'filter_by_market',
                        description: 'Belirli markete göre ürünleri filtreler',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                keywords: {
                                    type: 'string',
                                    description: 'Aranacak ürün anahtar kelimeleri'
                                },
                                marketName: {
                                    type: 'string',
                                    description: 'Market adı (bim, sok, a101, migros, vb.)'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['keywords', 'marketName', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'get_ai_recommendations',
                        description: 'AI destekli ürün önerileri alır',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                userQuery: {
                                    type: 'string',
                                    description: 'Kullanıcının sorusu veya isteği'
                                },
                                keywords: {
                                    type: 'string',
                                    description: 'Aranacak ürün anahtar kelimeleri'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['userQuery', 'keywords', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'analyze_prices',
                        description: 'Fiyat analizi yapar ve AI önerisi verir',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                productId: {
                                    type: 'string',
                                    description: 'Analiz edilecek ürün ID\'si'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['productId', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'generate_shopping_list',
                        description: 'AI destekli alışveriş listesi oluşturur',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                items: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Alışveriş listesindeki ürünler'
                                },
                                budget: {
                                    type: 'number',
                                    description: 'Bütçe (TL)',
                                    optional: true
                                },
                                preferences: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Kullanıcı tercihleri',
                                    optional: true
                                }
                            },
                            required: ['items']
                        }
                    },
                    {
                        name: 'compare_markets',
                        description: 'Marketleri karşılaştırır ve AI analizi verir',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                keywords: {
                                    type: 'string',
                                    description: 'Karşılaştırma için ürün anahtar kelimeleri'
                                },
                                latitude: {
                                    type: 'number',
                                    description: 'Kullanıcı enlem koordinatı'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Kullanıcı boylam koordinatı'
                                }
                            },
                            required: ['keywords', 'latitude', 'longitude']
                        }
                    },
                    {
                        name: 'chat',
                        description: 'AI ile genel sohbet',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    description: 'Kullanıcı mesajı'
                                },
                                context: {
                                    type: 'object',
                                    description: 'Ek bağlam bilgisi',
                                    optional: true
                                }
                            },
                            required: ['message']
                        }
                    }
                ]
            };
        });
        // Araç çağrılarını işle
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'search_products':
                        return await this.handleSearchProducts(args);
                    case 'search_by_id':
                        return await this.handleSearchById(args);
                    case 'compare_prices':
                        return await this.handleComparePrices(args);
                    case 'find_cheapest':
                        return await this.handleFindCheapest(args);
                    case 'filter_by_market':
                        return await this.handleFilterByMarket(args);
                    case 'get_ai_recommendations':
                        return await this.handleGetAIRecommendations(args);
                    case 'analyze_prices':
                        return await this.handleAnalyzePrices(args);
                    case 'generate_shopping_list':
                        return await this.handleGenerateShoppingList(args);
                    case 'compare_markets':
                        return await this.handleCompareMarkets(args);
                    case 'chat':
                        return await this.handleChat(args);
                    default:
                        throw new Error(`Bilinmeyen araç: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
                        }
                    ]
                };
            }
        });
    }
    async handleSearchProducts(args) {
        const result = await this.marketApi.searchProducts({
            keywords: args.keywords,
            latitude: args.latitude,
            longitude: args.longitude,
            distance: args.distance || 5,
            size: args.size || 24
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleSearchById(args) {
        const result = await this.marketApi.searchByIdentity({
            identity: args.productId,
            identityType: 'id',
            latitude: args.latitude,
            longitude: args.longitude
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleComparePrices(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const result = await this.marketApi.comparePrices(args.productId, location);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleFindCheapest(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const result = await this.marketApi.findCheapestProducts(args.keywords, location);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleFilterByMarket(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const result = await this.marketApi.filterByMarket(args.keywords, args.marketName, location);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleGetAIRecommendations(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const products = await this.marketApi.searchProducts({
            keywords: args.keywords,
            latitude: args.latitude,
            longitude: args.longitude,
            size: 10
        });
        const recommendation = await this.geminiService.getProductRecommendations(args.userQuery, products.content, location);
        return {
            content: [
                {
                    type: 'text',
                    text: recommendation
                }
            ]
        };
    }
    async handleAnalyzePrices(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const priceComparison = await this.marketApi.comparePrices(args.productId, location);
        const analysis = await this.geminiService.analyzePrices(priceComparison);
        return {
            content: [
                {
                    type: 'text',
                    text: analysis
                }
            ]
        };
    }
    async handleGenerateShoppingList(args) {
        const shoppingList = await this.geminiService.generateShoppingList(args.items, args.budget, args.preferences);
        return {
            content: [
                {
                    type: 'text',
                    text: shoppingList
                }
            ]
        };
    }
    async handleCompareMarkets(args) {
        const location = {
            latitude: args.latitude,
            longitude: args.longitude
        };
        const products = await this.marketApi.searchProducts({
            keywords: args.keywords,
            latitude: args.latitude,
            longitude: args.longitude,
            size: 50
        });
        const comparison = await this.geminiService.compareMarkets(products.content);
        return {
            content: [
                {
                    type: 'text',
                    text: comparison
                }
            ]
        };
    }
    async handleChat(args) {
        const response = await this.geminiService.chat(args.message, args.context);
        return {
            content: [
                {
                    type: 'text',
                    text: response
                }
            ]
        };
    }
    getServer() {
        return this.server;
    }
    async start() {
        console.log('Market Fiyatı MCP Server başlatılıyor...');
        // Server başlatma mantığı burada olacak
    }
}
//# sourceMappingURL=server.js.map