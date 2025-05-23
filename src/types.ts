export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags?: string[];
  category?: string;
  lastMessage?: string;
  unreadCount?: number;
  lastSeen?: Date;
  status?: 'online' | 'offline';
  selected?: boolean;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  preview?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  contacts: string[];
  category?: string;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

export interface Message {
  id: string;
  contactId: string;
  campaignId: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}