/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Pin, VolumeX, Check, CheckCheck, Plus, Bot, HelpCircle, X, MoreVertical } from 'lucide-react';
import { Contact, Message } from '../types';

interface ChatListProps {
  contacts: Contact[];
  lastMessages: Record<string, Message[]>;
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onAddContact: (contact: Partial<Contact>) => void;
  statusStoryRing: Record<string, { hasUnviewed: boolean; hasViewed: boolean }>;
}

export default function ChatList({
  contacts,
  lastMessages,
  selectedContactId,
  onSelectContact,
  onAddContact,
  statusStoryRing,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups' | 'personal'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBroadcastBanner, setShowBroadcastBanner] = useState(true);

  // New Contact form state
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newCharacter, setNewCharacter] = useState<'standard' | 'meta_ai' | 'elon_musk' | 'mom' | 'recruiter'>('standard');

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter((contact) => {
    // 1. Search Query
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.bio.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Filters
    const messages = lastMessages[contact.id] || [];
    const lastMsg = messages[messages.length - 1];

    if (activeFilter === 'unread') {
      return contact.unreadCount > 0;
    }
    if (activeFilter === 'groups') {
      return contact.isGroup;
    }
    if (activeFilter === 'personal') {
      return !contact.isGroup;
    }

    return true;
  });

  // Sort contacts: pinned chats first, then by last message time if available
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // Pin order
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Last message time order
    const msgsA = lastMessages[a.id] || [];
    const msgsB = lastMessages[b.id] || [];
    const lastA = msgsA[msgsA.length - 1];
    const lastB = msgsB[msgsB.length - 1];

    if (lastA && lastB) {
      return new Date(lastB.timestamp).getTime() - new Date(lastA.timestamp).getTime();
    }
    if (lastA) return -1;
    if (lastB) return 1;
    return 0;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Choose avatar based on character
    let avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"; // standard face
    if (newCharacter === 'meta_ai') {
      avatar = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80";
    } else if (newCharacter === 'elon_musk') {
      avatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80";
    } else if (newCharacter === 'mom') {
      avatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80";
    } else if (newCharacter === 'recruiter') {
      avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    }

    onAddContact({
      name: newName,
      bio: newBio || "Hey there! I am using WhatsApp.",
      characterType: newCharacter,
      avatar,
      isGroup: false,
      isOnline: newCharacter !== 'standard', // AI chatbots are online
    });

    // Reset and close
    setNewName('');
    setNewBio('');
    setNewCharacter('standard');
    setShowAddModal(false);
  };

  const renderTicks = (status: 'sending' | 'sent' | 'delivered' | 'read') => {
    if (status === 'sending') {
      return <span className="text-[10px] text-gray-400">...</span>;
    }
    if (status === 'sent') {
      return <Check className="w-3.5 h-3.5 text-gray-400" />;
    }
    if (status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
    }
    if (status === 'read') {
      return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
    }
    return null;
  };

  return (
    <div id="chat-list-panel" className="flex flex-col w-full md:w-[380px] bg-white h-full flex-shrink-0 border-r border-[#d1d7db]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold font-sans text-[#111b21]">Chats</h1>
        <div className="flex items-center gap-1">
          <button
            id="add-contact-btn"
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-[#f0f2f5] transition-colors"
            title="New Broadcast/Chat"
          >
            {/* Square-with-plus SVG */}
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className="p-2 rounded-lg text-neutral-700 hover:bg-[#f0f2f5] transition-colors">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center bg-[#f0f2f5] rounded-full px-3.5 py-1.5 border border-transparent focus-within:border-neutral-300 transition-all">
          <Search className="w-4 h-4 text-neutral-500 mr-2.5" />
          <input
            id="chat-search-input"
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-800 placeholder-neutral-500 outline-none border-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 px-4 pb-3 border-b border-[#f0f2f5]">
        {(['all', 'unread', 'groups', 'personal'] as const).map((filter) => (
          <button
            id={`filter-chip-${filter}`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 text-[11px] font-semibold rounded-full capitalize transition-all duration-150 border ${
              activeFilter === filter
                ? 'bg-[#e1f3ec] border-transparent text-[#00a884]'
                : 'bg-[#f0f2f5] border-transparent text-neutral-600 hover:bg-[#e9ecef]'
            }`}
          >
            {filter === 'personal' ? 'Favourites' : filter}
          </button>
        ))}
        {/* Dropdown Button */}
        <button className="p-1.5 rounded-full bg-[#f0f2f5] text-neutral-600 hover:bg-[#e9ecef] transition-colors ml-auto">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Broadcast Banner */}
      {showBroadcastBanner && (
        <div className="mx-3 my-2 p-3 bg-[#f0f2f5] rounded-xl flex gap-3 relative select-none animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-neutral-700 flex-shrink-0 border border-neutral-200 shadow-xs">
            <svg className="w-4.5 h-4.5 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 7v5"></path>
              <path d="M12 15h.01"></path>
            </svg>
          </div>
          <div className="flex-1 pr-6">
            <h4 className="text-[11px] font-bold text-neutral-800 leading-tight">Create broadcasts faster on web</h4>
            <p className="text-[10px] text-neutral-500 mt-0.5 leading-snug">
              You can now use your computer to send business broadcasts. <span className="text-[#008f72] font-semibold hover:underline cursor-pointer">Try it now</span>
            </p>
          </div>
          <button 
            onClick={() => setShowBroadcastBanner(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chats Container */}
      <div id="chats-scrollable-container" className="flex-1 overflow-y-auto py-1 space-y-1">
        {sortedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[200px]">
            <HelpCircle className="w-8 h-8 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500">No chats found</p>
          </div>
        ) : (
          sortedContacts.map((contact) => {
            const isSelected = selectedContactId === contact.id;
            const messages = lastMessages[contact.id] || [];
            const lastMsg = messages[messages.length - 1];
            
            // Format time
            let displayTime = '';
            if (lastMsg) {
              const date = new Date(lastMsg.timestamp);
              displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            // Status Story indicator border
            const ringInfo = statusStoryRing[contact.id] || { hasUnviewed: false, hasViewed: false };
            let ringClass = "border border-transparent";
            if (ringInfo.hasUnviewed) {
              ringClass = "ring-2 ring-[#25d366] p-[1.5px]";
            } else if (ringInfo.hasViewed) {
              ringClass = "ring-2 ring-neutral-300 p-[1.5px]";
            }

            return (
              <div key={contact.id} className="px-3">
                <button
                  id={`chat-item-${contact.id}`}
                  onClick={() => onSelectContact(contact.id)}
                  className={`flex w-full items-center gap-3.5 px-3 py-3 transition-all duration-150 text-left outline-none rounded-xl relative ${
                    isSelected
                      ? 'bg-white border-2 border-neutral-900 shadow-sm'
                      : 'hover:bg-[#f0f2f5]'
                  }`}
                >
                  {/* Contact Avatar with Story Indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-xl overflow-hidden ${ringClass}`}>
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* AI badge */}
                    {contact.characterType !== 'standard' && (
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 p-0.5 rounded-full text-white shadow-xs border border-white">
                        <Bot className="w-3 h-3" />
                      </div>
                    )}
                    {/* Online dot */}
                    {contact.isOnline && (
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00e676] rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm text-neutral-900 truncate">
                        {contact.name}
                      </span>
                      <span className={`text-[10px] font-semibold tracking-wide ${contact.unreadCount > 0 ? 'text-[#00a884] font-bold' : 'text-neutral-500'}`}>
                        {displayTime || 'Yesterday'}
                      </span>
                    </div>

                    {contact.id === 'work_group' && (
                      <div className="text-[11px] font-bold text-neutral-800 leading-none mb-1">
                        Globomart
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Last message or typing */}
                      {contact.typing ? (
                        <span className="text-xs text-[#00a884] font-medium italic animate-pulse">
                          typing...
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate max-w-[90%]">
                          {lastMsg && lastMsg.sender === 'user' && renderTicks(lastMsg.status)}
                          <span className="truncate">{lastMsg ? lastMsg.text : contact.bio}</span>
                        </div>
                      )}

                      {/* Badge & icons */}
                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        {contact.muted && <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
                        {contact.pinned && <Pin className="w-3.5 h-3.5 text-neutral-400" />}
                        {contact.unreadCount > 0 && (
                          <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 bg-[#25d366] text-white text-[9px] font-bold rounded-full">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div id="add-contact-modal" className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-neutral-800">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-neutral-900 mb-5">Add New Contact</h2>
            
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Iron Man"
                  className="w-full bg-[#f0f2f5] border border-transparent rounded-lg p-2.5 outline-none focus:border-neutral-300 transition-all text-sm text-neutral-800 placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Bio / Status
                </label>
                <input
                  type="text"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="e.g. Saving the universe"
                  className="w-full bg-[#f0f2f5] border border-transparent rounded-lg p-2.5 outline-none focus:border-neutral-300 transition-all text-sm text-neutral-800 placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  AI Personality
                </label>
                <select
                  value={newCharacter}
                  onChange={(e) => setNewCharacter(e.target.value as any)}
                  className="w-full bg-[#f0f2f5] border border-transparent rounded-lg p-2.5 outline-none focus:border-neutral-300 transition-all text-sm text-neutral-800"
                >
                  <option value="standard">None (Standard Contact)</option>
                  <option value="meta_ai">Meta AI Assistant</option>
                  <option value="elon_musk">Elon Musk</option>
                  <option value="mom">Mom ❤️</option>
                  <option value="recruiter">Sarah the Recruiter</option>
                </select>
                <p className="text-[10px] text-neutral-500 mt-1 leading-normal">
                  Selecting an AI personality will hook this contact to a specialized Gemini model instance!
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-500 hover:bg-[#f0f2f5] rounded-lg transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#00a884] hover:bg-[#008f72] text-white rounded-lg transition-all uppercase tracking-wider"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
