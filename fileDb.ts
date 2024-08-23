import { promises as fs } from 'fs';
import crypto from 'crypto';
import {
  Category,
  Place,
  Item,
  CategoryMutation,
  PlaceMutation,
  ItemMutation
} from './types';

const filename = './db.json';

interface Database {
  categories: Category[];
  places: Place[];
  items: Item[];
}

let data: Database = {
  categories: [],
  places: [],
  items: [],
};

const fileDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(filename, 'utf-8');
      data = JSON.parse(fileContents);
    } catch (e) {
      console.error('Error reading database file:', e);
      data = { categories: [], places: [], items: [] };
    }
  },

  async getCategories() {
    return data.categories;
  },

  async getCategory(id: string) {
    return data.categories.find(category => category.id === id) || null;
  },

  async addCategory(categoryData: CategoryMutation) {
    const category: Category = {
      id: crypto.randomUUID(),
      categoryName: categoryData.categoryName,
      categoryDescription: categoryData.categoryDescription,
    };
    data.categories.push(category);
    await this.save();
    return category;
  },

  async deleteCategory(id: string) {
    const hasRelatedItems = data.items.some(item => item.categoryId === id);
    if (hasRelatedItems) {
      throw new Error('Cannot delete category with related items');
    }
    data.categories = data.categories.filter(category => category.id !== id);
    await this.save();
  },

  async updateCategory(id: string, updatedData: CategoryMutation) {
    const index = data.categories.findIndex(category => category.id === id);
    if (index === -1) return null;
    data.categories[index] = {
      ...data.categories[index],
      categoryName: updatedData.categoryName,
      categoryDescription: updatedData.categoryDescription,
    };
    await this.save();
    return data.categories[index];
  },

  async getPlaces() {
    return data.places;
  },

  async getPlace(id: string) {
    return data.places.find(place => place.id === id) || null;
  },

  async addPlace(placeData: PlaceMutation) {
    const place: Place = {
      id: crypto.randomUUID(),
      placeName: placeData.placeName,
      placeDescription: placeData.placeDescription,
    };
    data.places.push(place);
    await this.save();
    return place;
  },

  async deletePlace(id: string) {
    const hasRelatedItems = data.items.some(item => item.placesId === id);
    if (hasRelatedItems) {
      throw new Error('Cannot delete place with related items');
    }
    data.places = data.places.filter(place => place.id !== id);
    await this.save();
  },

  async updatePlace(id: string, updatedData: PlaceMutation) {
    const index = data.places.findIndex(place => place.id === id);
    if (index === -1) return null;
    data.places[index] = {
      ...data.places[index],
      placeName: updatedData.placeName,
      placeDescription: updatedData.placeDescription,
    };
    await this.save();
    return data.places[index];
  },

  async getItems() {
    return data.items;
  },

  async getItem(id: string) {
    return data.items.find(item => item.id === id) || null;
  },

  async addItem(itemData: ItemMutation) {
    const item: Item = {
      id: crypto.randomUUID(),
      categoryId: itemData.categoryId,
      placesId: itemData.placesId,
      itemsName: itemData.itemsName,
      itemsDescription: itemData.itemsDescription,
      image: itemData.image,
    };
    data.items.push(item);
    await this.save();
    return item;
  },

  async deleteItem(id: string) {
    data.items = data.items.filter(item => item.id !== id);
    await this.save();
  },

  async updateItem(id: string, updatedData: ItemMutation) {
    const index = data.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    data.items[index] = {
      ...data.items[index],
      categoryId: updatedData.categoryId,
      placesId: updatedData.placesId,
      itemsName: updatedData.itemsName,
      itemsDescription: updatedData.itemsDescription,
      image: updatedData.image,
    };
    await this.save();
    return data.items[index];
  },

  async save() {
    try {
      await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file:', e);
    }
  },
};

export default fileDb;
