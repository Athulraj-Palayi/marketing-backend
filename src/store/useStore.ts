
import { create } from 'zustand';

export interface Contact {
  name: string;
  number: string;
  category: string;
}

export interface Category {
  name: string;
}

interface Store {
  contacts: Contact[];
  categories: Category[];
  fetchContacts: () => void;
  addContact: (contact: Contact) => void;
  fetchCategories: () => void;
  addCategory: (category: Category) => void;
}

export const useStore = create<Store>((set) => ({
  contacts: [],
  categories: [],

  fetchContacts: async () => {
    const res = await fetch('https://marketing-backend-8bd1.onrender.com/contacts');
    const data = await res.json();
    set({ contacts: data });
  },

  addContact: async (contact: Contact) => {
    const res = await fetch('https://marketing-backend-8bd1.onrender.com/add-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    const data = await res.json();
    set((state) => ({ contacts: [...state.contacts, data] }));
  },

  fetchCategories: async () => {
    const res = await fetch('https://marketing-backend-8bd1.onrender.com/categories');
    const data = await res.json();
    set({ categories: data });
  },

  addCategory: async (category: Category) => {
    const res = await fetch('https://marketing-backend-8bd1.onrender.com/add-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    const data = await res.json();
    set((state) => ({ categories: [...state.categories, data] }));
  },
}));
