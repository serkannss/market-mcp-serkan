// Market Fiyatı API için tip tanımları

export interface ProductDepotInfo {
  depotId: string;
  depotName: string;
  price: number;
  unitPrice: string;
  marketAdi: string;
  percentage: number;
  longitude: number;
  latitude: number;
  indexTime: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  imageUrl: string;
  refinedQuantityUnit: string | null;
  refinedVolumeOrWeight: string;
  categories: string[];
  productDepotInfoList: ProductDepotInfo[];
}

export interface FacetItem {
  name: string;
  count: number;
}

export interface FacetMap {
  sub_category?: FacetItem[];
  refined_quantity_unit?: FacetItem[];
  main_category?: FacetItem[];
  refined_volume_weight?: FacetItem[];
  brand?: FacetItem[];
  market_names?: FacetItem[];
}

export interface SearchResponse {
  numberOfFound: number;
  searchResultType: number;
  content: Product[];
  facetMap: FacetMap | null;
}

export interface SearchRequest {
  keywords: string;
  latitude: number;
  longitude: number;
  distance?: number;
  pages?: number;
  size?: number;
  depots?: string[];
}

export interface SearchByIdentityRequest {
  identity: string;
  identityType: string;
  keywords?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  pages?: number;
  size?: number;
  depots?: string[];
}

export interface MarketLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  district?: string;
}

export interface PriceComparison {
  productId: string;
  productName: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceRange: number;
  bestMarket: string;
  worstMarket: string;
  savings: number;
} 