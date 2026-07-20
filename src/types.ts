/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string; // ISO string
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio' | 'video';
  mediaUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string; // URL or background color code
  bio: string;
  lastSeen: string; // e.g. "Online", "last seen today at 10:34 AM"
  isGroup: boolean;
  isOnline: boolean;
  unreadCount: number;
  characterType: 'meta_ai' | 'elon_musk' | 'mom' | 'recruiter' | 'standard';
  pinned?: boolean;
  muted?: boolean;
  typing?: boolean;
}

export interface Status {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  caption?: string;
  timestamp: string; // ISO string
  mediaUrl: string; // image placeholder
  viewed: boolean;
}

export interface Call {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string; // ISO string
  duration?: string; // e.g. "12:34"
}

export interface User {
  name: string;
  avatar: string;
  bio: string;
  phone: string;
  wallpaper: 'default' | 'dark' | 'emerald' | 'peach';
}

export type TabType = 'chats' | 'updates' | 'communities' | 'calls' | 'settings';
