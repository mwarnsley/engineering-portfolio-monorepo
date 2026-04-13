export type SearchMode = 'city' | 'zip';

export type RestaurantSearchMode =
  | {
      mode: SearchMode;
      query: string;
    }
  | {
      mode: 'geo';
      latitude: number;
      longitude: number;
    };

export type MenuItem = {
  name: string;
  description: string;
  price?: number;
};

export type MenuSection = {
  sectionName: string;
  menuItems: MenuItem[];
};

export type RestaurantMenu = {
  menuName: string;
  menuSections: MenuSection[];
};

export type RestaurantSummary = {
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantWebsite: string;
  priceRange: string;
  hours: string;
  cuisines: string[];
  lastUpdated: string;
  highlights: string[];
  geo: {
    lat: number | null;
    lon: number | null;
  };
  address: {
    formatted: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  menus: RestaurantMenu[];
};

export type ActiveFilters = {
  cuisine: string;
  priceRange: string;
};

export type FilterOptions = {
  cuisines: string[];
  priceRanges: string[];
};
