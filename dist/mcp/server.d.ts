import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare class MarketMCPServer {
    private server;
    private marketApi;
    private geminiService;
    constructor(geminiApiKey: string, marketApiUrl?: string);
    private setupToolHandlers;
    private handleSearchProducts;
    private handleSearchById;
    private handleComparePrices;
    private handleFindCheapest;
    private handleFilterByMarket;
    private handleGetAIRecommendations;
    private handleAnalyzePrices;
    private handleGenerateShoppingList;
    private handleCompareMarkets;
    private handleChat;
    getServer(): Server;
    start(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map