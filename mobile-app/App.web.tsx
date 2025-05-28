import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Provider as PaperProvider, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import axios from 'axios';

// Basit tema
const theme = {
  colors: {
    primary: '#007bff',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
  },
};

const App = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  
  // AI Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    checkHealth();
    // Hoş geldin mesajı ekle
    setMessages([{
      id: 1,
      type: 'ai',
      text: '🤖 Merhaba! Ben Market Fiyat AI Asistanınızım. Size nasıl yardımcı olabilirim?\n\n• Ürün fiyatlarını karşılaştırabilirim\n• En ucuz marketleri bulabilirim\n• Alışveriş önerileri verebilirim\n\nÖrnek: "patates fiyatları nedir?" veya "en ucuz süt nerede?"',
      timestamp: new Date()
    }]);
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/health');
      setHealthStatus(response.data);
    } catch (error) {
      console.error('Health check error:', error);
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAiLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/ai/chat', {
        message: inputMessage,
        context: {
          previousMessages: messages.slice(-5), // Son 5 mesajı context olarak gönder
          location: { latitude: 41.0082, longitude: 28.9784 } // İstanbul koordinatları
        }
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response || 'Üzgünüm, şu anda yanıt veremiyorum.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: '❌ Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchKeyword.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/search', {
        keywords: searchKeyword,
        latitude: 41.0082,
        longitude: 28.9784,
        distance: 10,
        size: 10
      });
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const quickQuestions = [
    "Patates fiyatları nedir?",
    "En ucuz süt nerede?",
    "Domates fiyatlarını karşılaştır",
    "Bugünün en iyi fırsatları neler?",
    "A101 ve BIM fiyatlarını karşılaştır"
  ];

  const askQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const renderHome = () => (
    <View>
      {/* Sistem Durumu */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>📊 Sistem Durumu</Title>
          {loading ? (
            <Text>Kontrol ediliyor...</Text>
          ) : (
            <Text style={{ color: healthStatus ? '#4caf50' : '#f44336' }}>
              {healthStatus 
                ? `✅ API Çalışıyor - ${new Date().toLocaleTimeString('tr-TR')}`
                : '❌ API Bağlantısı Yok'
              }
            </Text>
          )}
          <Button mode="outlined" onPress={checkHealth} style={styles.button}>
            Yenile
          </Button>
        </Card.Content>
      </Card>

      {/* Hızlı Erişim */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>🚀 Hızlı Erişim</Title>
          <View style={styles.buttonRow}>
            <Button 
              mode="contained" 
              onPress={() => setCurrentTab('ai')}
              style={[styles.button, { backgroundColor: '#28a745' }]}
            >
              🤖 AI Asistan
            </Button>
            <Button 
              mode="contained" 
              onPress={() => setCurrentTab('search')}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              🔍 Ürün Ara
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderAIChat = () => (
    <View style={styles.chatContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🤖 AI Market Asistanı</Title>
          <Paragraph>Ürün fiyatları ve market karşılaştırması için benimle sohbet edin!</Paragraph>
        </Card.Content>
      </Card>

      {/* Hızlı Sorular */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>💡 Hızlı Sorular</Title>
          <View style={styles.chipContainer}>
            {quickQuestions.map((question, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => askQuickQuestion(question)}
                style={styles.chip}
              >
                {question}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Mesaj Geçmişi */}
      <Card style={[styles.card, styles.messagesCard]}>
        <Card.Content>
          <ScrollView style={styles.messagesContainer}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageItem,
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString('tr-TR')}
                </Text>
              </View>
            ))}
            {aiLoading && (
              <View style={[styles.messageItem, styles.aiMessage]}>
                <Text style={styles.messageText}>🤖 Düşünüyorum...</Text>
              </View>
            )}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Mesaj Giriş */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Mesajınızı yazın... (örn: patates fiyatları nedir?)"
              multiline
              onSubmitEditing={sendMessage}
            />
            <Button
              mode="contained"
              onPress={sendMessage}
              disabled={!inputMessage.trim() || aiLoading}
              style={styles.sendButton}
            >
              Gönder
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderSearch = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🔍 Ürün Arama</Title>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              placeholder="Ürün adı girin (örn: patates, süt, domates)"
              onSubmitEditing={searchProducts}
            />
            <Button
              mode="contained"
              onPress={searchProducts}
              style={styles.sendButton}
            >
              Ara
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Arama Sonuçları */}
      {searchResults.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>📋 Arama Sonuçları ({searchResults.length})</Title>
            {searchResults.slice(0, 5).map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price} ₺</Text>
                <Text style={styles.productMarket}>{product.market}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.title}>🛒 Market Fiyat Karşılaştırma</Title>
            <Paragraph style={{ color: 'white' }}>AI Destekli Akıllı Alışveriş</Paragraph>
          </Card.Content>
        </Card>

        {/* Navigation */}
        <Card style={styles.navCard}>
          <Card.Content>
            <View style={styles.navContainer}>
              <Button
                mode={currentTab === 'home' ? 'contained' : 'outlined'}
                onPress={() => setCurrentTab('home')}
                style={styles.navButton}
              >
                🏠 Ana Sayfa
              </Button>
              <Button
                mode={currentTab === 'ai' ? 'contained' : 'outlined'}
                onPress={() => setCurrentTab('ai')}
                style={styles.navButton}
              >
                🤖 AI Asistan
              </Button>
              <Button
                mode={currentTab === 'search' ? 'contained' : 'outlined'}
                onPress={() => setCurrentTab('search')}
                style={styles.navButton}
              >
                🔍 Arama
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Content */}
        <ScrollView style={styles.content}>
          {currentTab === 'home' && renderHome()}
          {currentTab === 'ai' && renderAIChat()}
          {currentTab === 'search' && renderSearch()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Market Fiyat Karşılaştırma © 2025
            </Text>
            <Text style={styles.footerText}>
              Backend API: http://localhost:3000
            </Text>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    marginBottom: 10,
    backgroundColor: '#007bff',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navCard: {
    marginBottom: 10,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  navButton: {
    margin: 5,
    minWidth: 120,
  },
  card: {
    marginBottom: 20,
    elevation: 3,
  },
  button: {
    marginTop: 10,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  chatContainer: {
    minHeight: 600,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    margin: 2,
  },
  messagesCard: {
    minHeight: 400,
  },
  messagesContainer: {
    maxHeight: 350,
  },
  messageItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#e9ecef',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 50,
  },
  sendButton: {
    paddingHorizontal: 20,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
  },
  productMarket: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
});

export default App; 