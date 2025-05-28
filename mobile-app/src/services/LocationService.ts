import { Platform, Alert } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  /**
   * Konum izni iste (basit versiyon)
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      // Basit implementasyon - gerçek uygulamada react-native-permissions kullanılabilir
      console.log('Konum izni isteniyor...');
      return true;
    } catch (error) {
      console.error('Konum izni hatası:', error);
      return false;
    }
  }

  /**
   * Mevcut konumu al (varsayılan konum döndürür)
   */
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve) => {
      // Varsayılan konum (İstanbul)
      const defaultLocation: Location = {
        latitude: 41.0082,
        longitude: 28.9784,
      };
      
      console.log('Varsayılan konum kullanılıyor:', defaultLocation);
      resolve(defaultLocation);
    });
  }

  /**
   * İki konum arasındaki mesafeyi hesapla (km)
   */
  calculateDistance(
    location1: Location,
    location2: Location
  ): number {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.toRadians(location2.latitude - location1.latitude);
    const dLon = this.toRadians(location2.longitude - location1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(location1.latitude)) *
        Math.cos(this.toRadians(location2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // 2 ondalık basamak
  }

  /**
   * Derece cinsinden açıyı radyana çevir
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Konum adresini al (Basit format)
   */
  async getAddressFromLocation(location: Location): Promise<string> {
    try {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Adres alma hatası:', error);
      return 'Bilinmeyen konum';
    }
  }

  /**
   * Varsayılan konumları al
   */
  getDefaultLocations(): { [key: string]: Location } {
    return {
      istanbul: { latitude: 41.0082, longitude: 28.9784 },
      ankara: { latitude: 39.9334, longitude: 32.8597 },
      izmir: { latitude: 38.4192, longitude: 27.1287 },
      bursa: { latitude: 40.1826, longitude: 29.0665 },
      antalya: { latitude: 36.8969, longitude: 30.7133 },
    };
  }
}

export const requestLocationPermission = async (): Promise<boolean> => {
  const locationService = new LocationService();
  return await locationService.requestLocationPermission();
};

export default new LocationService(); 