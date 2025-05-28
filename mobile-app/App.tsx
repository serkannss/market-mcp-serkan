import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import CompareScreen from './src/screens/CompareScreen';
import AIScreen from './src/screens/AIScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Theme
import { lightTheme, darkTheme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Navigation theme için basit tema
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.primary,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <SafeAreaView style={styles.container}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                switch (route.name) {
                  case 'Ana Sayfa':
                    iconName = 'home';
                    break;
                  case 'Arama':
                    iconName = 'search';
                    break;
                  case 'Karşılaştır':
                    iconName = 'compare-arrows';
                    break;
                  case 'AI Asistan':
                    iconName = 'smart-toy';
                    break;
                  case 'Profil':
                    iconName = 'person';
                    break;
                  default:
                    iconName = 'help';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.outline,
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
              },
              headerStyle: {
                backgroundColor: theme.colors.surface,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.onSurface,
                fontSize: 18,
                fontWeight: '600',
              },
              headerTintColor: theme.colors.onSurface,
            })}
          >
            <Tab.Screen
              name="Ana Sayfa"
              component={HomeScreen}
              options={{
                title: 'Market Fiyat Karşılaştırma',
              }}
            />
            <Tab.Screen
              name="Arama"
              component={SearchScreen}
              options={{
                title: 'Ürün Arama',
              }}
            />
            <Tab.Screen
              name="Karşılaştır"
              component={CompareScreen}
              options={{
                title: 'Fiyat Karşılaştırma',
              }}
            />
            <Tab.Screen
              name="AI Asistan"
              component={AIScreen}
              options={{
                title: 'AI Alışveriş Asistanı',
              }}
            />
            <Tab.Screen
              name="Profil"
              component={ProfileScreen}
              options={{
                title: 'Profil',
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; 