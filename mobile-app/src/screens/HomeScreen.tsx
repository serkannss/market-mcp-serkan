import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Services
import ApiService from '../services/ApiService';

// Theme
import { spacing, shadows } from '../theme/theme';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const health = await ApiService.healthCheck();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check error:', error);
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'search',
      title: 'Ürün Ara',
      icon: 'search',
      color: theme.colors.primary,
      onPress: () => {
        console.log('Arama ekranına git');
      },
    },
    {
      id: 'compare',
      title: 'Fiyat Karşılaştır',
      icon: 'compare-arrows',
      color: theme.colors.secondary,
      onPress: () => {
        console.log('Karşılaştırma ekranına git');
      },
    },
    {
      id: 'ai',
      title: 'AI Asistan',
      icon: 'smart-toy',
      color: theme.colors.tertiary,
      onPress: () => {
        console.log('AI ekranına git');
      },
    },
    {
      id: 'nearby',
      title: 'Yakın Marketler',
      icon: 'location-on',
      color: '#ff6600',
      onPress: () => {
        console.log('Yakın marketler');
      },
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await checkHealth();
    setRefreshing(false);
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Hızlı İşlemler
      </Title>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <Surface
            key={action.id}
            style={[
              styles.quickActionCard,
              { backgroundColor: theme.colors.surface },
              shadows.medium,
            ]}
            elevation={3}
          >
            <Button
              mode="contained-tonal"
              onPress={action.onPress}
              style={[styles.quickActionButton, { backgroundColor: action.color + '20' }]}
              contentStyle={styles.quickActionContent}
            >
              <View style={styles.quickActionInner}>
                <Icon name={action.icon} size={32} color={action.color} />
                <Text style={[styles.quickActionText, { color: action.color }]}>
                  {action.title}
                </Text>
              </View>
            </Button>
          </Surface>
        ))}
      </View>
    </View>
  );

  const renderSystemStatus = () => (
    <Card style={[styles.statusCard, shadows.small]}>
      <Card.Content>
        <View style={styles.statusHeader}>
          <Icon
            name={healthStatus ? 'check-circle' : 'error'}
            size={24}
            color={healthStatus ? '#4caf50' : '#f44336'}
          />
          <Title style={styles.statusTitle}>
            Sistem Durumu
          </Title>
        </View>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
            {healthStatus
              ? `✅ Sistem çalışıyor - ${new Date().toLocaleTimeString('tr-TR')}`
              : '❌ Sistem bağlantısı yok'}
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Hoş Geldiniz */}
        <Card style={[styles.welcomeCard, shadows.medium]}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              🛒 Market Fiyat Karşılaştırma
            </Title>
            <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
              En uygun fiyatları bulun, akıllı alışveriş yapın!
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Sistem Durumu */}
        {renderSystemStatus()}

        {/* Hızlı İşlemler */}
        {renderQuickActions()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  welcomeCard: {
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statusCard: {
    marginBottom: spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusTitle: {
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  quickActionsContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - spacing.md * 3) / 2,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  quickActionButton: {
    borderRadius: 12,
  },
  quickActionContent: {
    height: 80,
  },
  quickActionInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen; 