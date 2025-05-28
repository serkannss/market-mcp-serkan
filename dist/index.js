#!/usr/bin/env node
import { MarketMCPServer } from './mcp/server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
// Çevre değişkenlerini yükle
dotenv.config();
async function main() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const marketApiUrl = process.env.MARKET_API_BASE_URL;
    if (!geminiApiKey) {
        console.error('GEMINI_API_KEY çevre değişkeni gerekli!');
        process.exit(1);
    }
    try {
        // MCP Server'ı oluştur
        const mcpServer = new MarketMCPServer(geminiApiKey, marketApiUrl);
        const server = mcpServer.getServer();
        // STDIO transport kullan
        const transport = new StdioServerTransport();
        // Server'ı transport'a bağla
        await server.connect(transport);
        console.log('Market Fiyatı MCP Server başarıyla başlatıldı!');
        console.log('Mevcut araçlar:');
        console.log('- search_products: Ürün arama');
        console.log('- search_by_id: ID ile ürün arama');
        console.log('- compare_prices: Fiyat karşılaştırma');
        console.log('- find_cheapest: En ucuz ürünleri bulma');
        console.log('- filter_by_market: Markete göre filtreleme');
        console.log('- get_ai_recommendations: AI önerileri');
        console.log('- analyze_prices: Fiyat analizi');
        console.log('- generate_shopping_list: Alışveriş listesi');
        console.log('- compare_markets: Market karşılaştırması');
        console.log('- chat: AI sohbet');
    }
    catch (error) {
        console.error('Server başlatma hatası:', error);
        process.exit(1);
    }
}
// Hata yakalama
process.on('uncaughtException', (error) => {
    console.error('Yakalanmamış hata:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('İşlenmemiş promise reddi:', reason);
    process.exit(1);
});
// Ana fonksiyonu çalıştır
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error('Ana fonksiyon hatası:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map