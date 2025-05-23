import { create } from 'zustand';
import { Contact, Template, Campaign, Message, Category } from '../types';

interface Store {
  contacts: Contact[];
  templates: Template[];
  campaigns: Campaign[];
  messages: Message[];
  categories: Category[];
  selectedContact: Contact | null;
  activeView: 'chat' | 'contacts' | 'calendar' | 'settings';
  selectedCategory: string | null;
  addContacts: (contacts: Contact[]) => void;
  addTemplate: (template: Template) => void;
  createCampaign: (campaign: Campaign) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;
  setSelectedContact: (contact: Contact) => void;
  updateMessageStatus: (id: string, status: Message['status']) => void;
  setActiveView: (view: 'chat' | 'contacts' | 'calendar' | 'settings') => void;
  addMessage: (message: Message) => void;
  addCategory: (category: Category) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  toggleContactSelection: (contactId: string) => void;
  selectAllContacts: (selected: boolean, categoryId?: string) => void;
}

export const useStore = create<Store>((set) => ({
  contacts: [],
  templates: [],
  campaigns: [],
  categories: [
    { id: '1', name: 'Customers', color: '#4CAF50' },
    { id: '2', name: 'Leads', color: '#2196F3' },
    { id: '3', name: 'VIP', color: '#FFC107' },
  ],
  messages: [
    {
      id: '1',
      contactId: '1',
      campaignId: '1',
      content: 'Hello! How are you?',
      status: 'read',
      timestamp: new Date('2024-03-10T10:00:00'),
    },
    {
      id: '2',
      contactId: '1',
      campaignId: '1',
      content: 'I am good, thank you!',
      status: 'delivered',
      timestamp: new Date('2024-03-10T10:05:00'),
    }
  ],
  selectedContact: null,
  activeView: 'chat',
  selectedCategory: null,
  
  addContacts: (newContacts) =>
    set((state) => ({
      contacts: [...state.contacts, ...newContacts],
    })),
    
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template],
    })),
    
  createCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),
    
  updateCampaignStatus: (id, status) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),

  setSelectedContact: (contact) =>
    set(() => ({
      selectedContact: contact,
    })),

  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, status } : m
      ),
    })),

  setActiveView: (view) =>
    set(() => ({
      activeView: view,
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  setSelectedCategory: (categoryId) =>
    set(() => ({
      selectedCategory: categoryId,
    })),

  toggleContactSelection: (contactId) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, selected: !contact.selected }
          : contact
      ),
    })),

  selectAllContacts: (selected, categoryId) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        (!categoryId || contact.category === categoryId)
          ? { ...contact, selected }
          : contact
      ),
    })),
}));