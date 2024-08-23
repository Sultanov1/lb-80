export interface Category {
  id: string;
  categoryName: string;
  categoryDescription: string | null
}

export interface CategoryMutation {
  categoryName: string;
  categoryDescription: string | null;
}

export interface Place {
  id: string;
  placeName: string;
  placeDescription: string | null;
}

export interface PlaceMutation {
  placeName: string;
  placeDescription: string | null;
}

export interface Item {
  id: string;
  categoryId: string;
  placesId: string;
  itemsName: string
  itemsDescription: string | null
  image: string | null;
}

export interface ItemMutation {
  categoryId: string;
  placesId: string;
  itemsName: string
  itemsDescription: string | null
  image: string | null;
}