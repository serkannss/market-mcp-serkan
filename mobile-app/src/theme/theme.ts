import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007bff',
    primaryContainer: '#e3f2fd',
    secondary: '#28a745',
    secondaryContainer: '#e8f5e8',
    tertiary: '#ffc107',
    tertiaryContainer: '#fff8e1',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#fafafa',
    error: '#dc3545',
    errorContainer: '#ffebee',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#000000',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    onBackground: '#212121',
    onError: '#ffffff',
    outline: '#e0e0e0',
    outlineVariant: '#f0f0f0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#303030',
    inverseOnSurface: '#f5f5f5',
    inversePrimary: '#90caf9',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#f8f9fa',
      level3: '#f1f3f4',
      level4: '#e8eaed',
      level5: '#e0e3e7',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90caf9',
    primaryContainer: '#1565c0',
    secondary: '#81c784',
    secondaryContainer: '#2e7d32',
    tertiary: '#ffcc02',
    tertiaryContainer: '#ff8f00',
    surface: '#121212',
    surfaceVariant: '#1e1e1e',
    background: '#000000',
    error: '#cf6679',
    errorContainer: '#b71c1c',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onTertiary: '#000000',
    onSurface: '#ffffff',
    onSurfaceVariant: '#b0b0b0',
    onBackground: '#ffffff',
    onError: '#000000',
    outline: '#333333',
    outlineVariant: '#2a2a2a',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#f5f5f5',
    inverseOnSurface: '#303030',
    inversePrimary: '#1976d2',
    elevation: {
      level0: 'transparent',
      level1: '#1e1e1e',
      level2: '#232323',
      level3: '#252525',
      level4: '#272727',
      level5: '#2c2c2c',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const marketColors = {
  bim: '#0066cc',
  a101: '#e31e24',
  sok: '#ff6600',
  migros: '#ff8c00',
  tarim_kredi: '#228b22',
  carrefour: '#0066cc',
  default: '#757575',
};

export const statusColors = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
}; 