export interface Item {
  id?: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ItemFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
}
