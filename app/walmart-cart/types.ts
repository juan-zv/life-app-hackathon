// Shared types for the Walmart cart feature

export interface FoundItem {
  searchedItem: string;
  id: string;
  name: string;
  price: string;
  url: string;
}

export interface CartResult {
  cartUrl: string;
  itemsFound: number;
  totalRequested: number;
  estimatedTotal: number;
  found: FoundItem[];
  notFound: string[];
}

export interface GenerateCartRequest {
  items: string[];
}
