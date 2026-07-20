/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, CircleDot, Users, Phone, Settings, Bot,
  Volume2, VolumeX, Menu, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';

import { Contact, Message, Status, Call, User, TabType } from './types';
import {
  INITIAL_USER, INITIAL_CONTACTS, INITIAL_MESSAGES,
  INITIAL_STATUSES, INITIAL_CALLS
} from './data/mockData';

import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import UpdatesTab from './components/UpdatesTab';
import CallsTab from './components/CallsTab';
import CommunitiesTab from './components/CommunitiesTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  
  // Theme state (system-driven, matches dark mode class)
  const [darkMode, setDarkMode] = useState(false);

  // Core WhatsApp data state
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('ws_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('ws_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('ws_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [statuses, setStatuses] = useState<Status[]>(() => {
    const saved = localStorage.getItem('ws_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUSES;
  });

  const [calls, setCalls] = useState<Call[]>(() => {
    const saved = localStorage.getItem('ws_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });

  const [selectedContactId, setSelectedContactId] = useState<string | null>(() => {
    return INITIAL_CONTACTS[0].id; // Select Meta AI by default on desktop
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ws_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ws_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('ws_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ws_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('ws_calls', JSON.stringify(calls));
  }, [calls]);

  // Handle active contact read notifications
  useEffect(() => {
    if (selectedContactId) {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContactId
            ? { ...contact, unreadCount: 0 }
            : contact
        )
      );
    }
  }, [selectedContactId]);

  // Detect Dark Mode preference from system
  useEffect(() => {
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleClearAllChats = () => {
    setMessages({});
    setContacts(INITIAL_CONTACTS.map(c => ({ ...c, unreadCount: 0 })));
  };

  const handleClearSingleChat = (contactId: string) => {
    setMessages(prev => ({
      ...prev,
      [contactId]: []
    }));
  };

  // Status Story indicators (hasViewed, hasUnviewed statuses)
  const getStatusStoryRingInfo = () => {
    const rings: Record<string, { hasUnviewed: boolean; hasViewed: boolean }> = {};
    statuses.forEach((status) => {
      if (!rings[status.contactId]) {
        rings[status.contactId] = { hasUnviewed: false, hasViewed: false };
      }
      if (status.viewed) {
        rings[status.contactId].hasViewed = true;
      } else {
        rings[status.contactId].hasUnviewed = true;
      }
    });

    // Make sure we resolve overlapping (unviewed takes priority)
    Object.keys(rings).forEach((id) => {
      if (rings[id].hasUnviewed) {
        rings[id].hasViewed = false;
      }
    });

    return rings;
  };

  const handleSendMessage = async (text: string, type: 'text' | 'image' | 'audio' = 'text') => {
    if (!selectedContactId) return;

    const activeContact = contacts.find((c) => c.id === selectedContactId);
    if (!activeContact) return;

    const userMsgId = 'msg_' + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
      type: type,
    };

    // Update active chat message log
    setMessages((prev) => {
      const activeList = prev[selectedContactId] || [];
      return {
        ...prev,
        [selectedContactId]: [...activeList, newUserMsg],
      };
    });

    // Simulated ticks transition (sending -> sent -> delivered)
    setTimeout(() => {
      setMessages((prev) => {
        const list = prev[selectedContactId] || [];
        return {
          ...prev,
          [selectedContactId]: list.map((m) =>
            m.id === userMsgId ? { ...m, status: 'sent' } : m
          ),
        };
      });
    }, 400);

    setTimeout(() => {
      setMessages((prev) => {
        const list = prev[selectedContactId] || [];
        return {
          ...prev,
          [selectedContactId]: list.map((m) =>
            m.id === userMsgId ? { ...m, status: 'delivered' } : m
          ),
        };
      });
    }, 900);

    // Trigger AI response workflow if not group chat
    if (!activeContact.isGroup) {
      // Set contact typing indicator to true
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContactId ? { ...c, typing: true } : c))
      );

      try {
        const currentHistory = messages[selectedContactId] || [];
        const payloadHistory = [
          ...currentHistory.map((m) => ({ text: m.text, sender: m.sender })),
          { text: text, sender: 'user' as const }
        ];

        // Call our server-side Express Gemini AI proxy endpoint!
        const response = await fetch('/api/chat/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            characterType: activeContact.characterType,
            userMessage: text,
            chatHistory: payloadHistory,
          }),
        });

        const data = await response.json();
        
        // Dynamic wait time to simulate reading and typing
        const textLength = data.reply ? data.reply.length : 20;
        const simulatedDelay = Math.max(1200, Math.min(3000, textLength * 25));

        setTimeout(() => {
          // Turn off typing
          setContacts((prev) =>
            prev.map((c) => (c.id === selectedContactId ? { ...c, typing: false, isOnline: true } : c))
          );

          // Append reply to logs
          const botMsgId = 'reply_' + Date.now();
          const newBotMsg: Message = {
            id: botMsgId,
            text: data.reply || "I am connected, but resting my systems right now! Let me know if you need anything else.",
            sender: 'contact',
            timestamp: new Date().toISOString(),
            status: 'read',
          };

          setMessages((prev) => {
            const list = prev[selectedContactId] || [];
            return {
              ...prev,
              [selectedContactId]: [...list, newBotMsg],
            };
          });

          // Set user message to 'read'
          setMessages((prev) => {
            const list = prev[selectedContactId] || [];
            return {
              ...prev,
              [selectedContactId]: list.map((m) =>
                m.id === userMsgId ? { ...m, status: 'read' } : m
              ),
            };
          });

          // Increment unread count if user shifted view
          if (selectedContactId !== activeContact.id) {
            setContacts((prev) =>
              prev.map((c) =>
                c.id === activeContact.id
                  ? { ...c, unreadCount: c.unreadCount + 1 }
                  : c
              )
            );
          }
        }, simulatedDelay);

      } catch (err) {
        console.error("AI reply error:", err);
        // Fallback: stop typing
        setContacts((prev) =>
          prev.map((c) => (c.id === selectedContactId ? { ...c, typing: false } : c))
        );
      }
    } else {
      // Group simulated random teammate replies
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContactId ? { ...c, typing: true } : c))
      );

      setTimeout(() => {
        setContacts((prev) =>
          prev.map((c) => (c.id === selectedContactId ? { ...c, typing: false } : c))
        );

        const groupReplyId = 'reply_' + Date.now();
        const groupReplies = [
          "Deploy looking solid. Pushing to master soon. 👍",
          "Awesome job Kevin, I'll review the pull request after lunch.",
          "Perfect! Let's schedule the client walk-through tomorrow.",
          "Tests are passing. Code coverage is 92.5%. Core components loaded.",
        ];
        const randomReply = groupReplies[Math.floor(Math.random() * groupReplies.length)];

        const newGroupMsg: Message = {
          id: groupReplyId,
          text: randomReply,
          sender: 'contact',
          timestamp: new Date().toISOString(),
          status: 'read',
        };

        setMessages((prev) => {
          const list = prev[selectedContactId] || [];
          return {
            ...prev,
            [selectedContactId]: [...list, newGroupMsg],
          };
        });

        // Set user message ticks to read
        setMessages((prev) => {
          const list = prev[selectedContactId] || [];
          return {
            ...prev,
            [selectedContactId]: list.map((m) =>
              m.id === userMsgId ? { ...m, status: 'read' } : m
            ),
          };
        });
      }, 2000);
    }
  };

  const handleAddContact = (partialContact: Partial<Contact>) => {
    const newId = 'c_' + Date.now();
    const newContact: Contact = {
      id: newId,
      name: partialContact.name || "Unknown",
      avatar: partialContact.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      bio: partialContact.bio || "Hey there! I am using WhatsApp.",
      lastSeen: "Online",
      isGroup: false,
      isOnline: partialContact.isOnline ?? false,
      unreadCount: 0,
      characterType: partialContact.characterType || 'standard',
    };

    setContacts((prev) => [newContact, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newId]: [],
    }));
    setSelectedContactId(newId);
    setActiveTab('chats');
  };

  const handleAddMyStatus = (caption: string) => {
    const newStatus: Status = {
      id: 's_my_' + Date.now(),
      contactId: 'me',
      contactName: 'My status',
      contactAvatar: user.avatar,
      caption: caption,
      timestamp: new Date().toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      viewed: false,
    };

    setStatuses((prev) => [newStatus, ...prev]);
  };

  const handleViewStatus = (statusId: string) => {
    setStatuses((prev) =>
      prev.map((st) => (st.id === statusId ? { ...st, viewed: true } : st))
    );
  };

  // Bottom Mobile tabs rendering
  const renderMobileTabs = () => {
    const tabs = [
      { id: 'chats' as TabType, icon: MessageSquare, label: 'Chats' },
      { id: 'updates' as TabType, icon: CircleDot, label: 'Updates' },
      { id: 'communities' as TabType, icon: Users, label: 'Communities' },
      { id: 'calls' as TabType, icon: Phone, label: 'Calls' },
      { id: 'settings' as TabType, icon: Settings, label: 'Settings' },
    ];

    return (
      <div id="mobile-bottom-tabs" className="md:hidden flex justify-around items-center bg-[#f0f2f5] dark:bg-[#111b21] border-t border-[#d1d7db] dark:border-[#222e35] h-[60px] flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`mobile-tab-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // clear contact selection on mobile tab change so lists can render properly
                if (tab.id !== 'chats') setSelectedContactId(null);
              }}
              className="flex flex-col items-center justify-center w-14 h-full relative"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#00a884]' : 'text-[#54656f] dark:text-[#aebac1]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'text-[#00a884] font-semibold' : 'text-[#54656f] dark:text-[#aebac1]'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-[#00a884] rounded-b-md" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  const activeChatMessages = selectedContactId ? messages[selectedContactId] || [] : [];
  const statusRings = getStatusStoryRingInfo();

  return (
    <div id="whatsapp-app-root" className="flex flex-col h-screen w-screen bg-[#f3f4f6] overflow-hidden select-none font-sans antialiased text-neutral-800">
      
      {/* Windows 11 Style Title Bar */}
      <div className="flex items-center justify-between h-[32px] bg-white border-b border-neutral-200 px-3 select-none text-neutral-800 text-xs font-normal shrink-0">
        <div className="flex items-center gap-2">
          {/* Custom WhatsApp green circle icon with white telephone handset */}
          <div className="w-4 h-4 rounded-full bg-[#25d366] flex items-center justify-center text-white">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="font-semibold tracking-wide text-[11px]">WhatsApp</span>
        </div>
        <div className="flex items-center">
          {/* Minimize button */}
          <button className="flex items-center justify-center w-[46px] h-[32px] hover:bg-neutral-100 transition-colors text-neutral-600">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          {/* Maximize button */}
          <button className="flex items-center justify-center w-[46px] h-[32px] hover:bg-neutral-100 transition-colors text-neutral-600">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="5" y="5" width="14" height="14"></rect>
            </svg>
          </button>
          {/* Close button with hover:bg-red-600 */}
          <button className="flex items-center justify-center w-[46px] h-[32px] hover:bg-[#e81123] hover:text-white transition-colors text-neutral-600">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Container Workspace */}
      <div id="whatsapp-workspace-frame" className="flex flex-col md:flex-row flex-1 w-full h-[calc(100vh-32px)] bg-white z-10 overflow-hidden relative">
        
        {/* Left Sidebar Rail (Desktop only) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'chats') setSelectedContactId(null);
          }}
          user={user}
          onOpenProfile={() => setActiveTab('settings')}
        />

        {/* Dynamic Panels (Chats or other Tabs) */}
        <div id="tab-content-panel" className="flex flex-1 h-full overflow-hidden relative">
          
          {/* Chats View */}
          {activeTab === 'chats' && (
            <div className="flex flex-1 h-full overflow-hidden">
              {/* Left pane: Chats List (visible if no chat is selected on mobile, or always visible on desktop) */}
              <div className={`w-full md:w-[380px] h-full ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
                <ChatList
                  contacts={contacts}
                  lastMessages={messages}
                  selectedContactId={selectedContactId}
                  onSelectContact={(id) => setSelectedContactId(id)}
                  onAddContact={handleAddContact}
                  statusStoryRing={statusRings}
                />
              </div>

              {/* Right pane: Chat Active Conversation Window */}
              <div className={`flex-1 h-full ${!selectedContactId ? 'hidden md:flex' : 'flex'}`}>
                {selectedContact ? (
                  <ChatWindow
                    contact={selectedContact}
                    messages={activeChatMessages}
                    onSendMessage={handleSendMessage}
                    onBack={() => setSelectedContactId(null)}
                    user={user}
                    onClearChat={() => handleClearSingleChat(selectedContact.id)}
                  />
                ) : (
                  // Empty Placeholder for desktop when no chat is active
                  <div className="hidden md:flex flex-col items-center justify-center bg-[#f8f9fa] flex-1 h-full p-12 text-center select-none border-l border-neutral-200 relative">
                    <div className="max-w-md flex flex-col items-center -mt-10">
                      {/* Large grey circular outline WhatsApp logo receiver icon */}
                      <div className="w-24 h-24 rounded-full border-[2.5px] border-neutral-200 flex items-center justify-center text-neutral-300 mb-6">
                        <svg className="w-14 h-14 fill-current text-neutral-300/80" viewBox="0 0 24 24">
                          <path d="M12.012 2c-5.514 0-10 4.486-10 10s4.486 10 10 10c5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.25c-4.549 0-8.25-3.701-8.25-8.25s3.701-8.25 8.25-8.25 8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25zm4.498-5.32c-.22-.11-.131-.444-.336-.549-.205-.104-1.309-.646-1.514-.72-.205-.074-.354-.11-.504.11-.15.22-.581.72-.712.87-.13.15-.26.166-.48.056-.22-.11-.933-.343-1.778-1.096-.657-.585-1.1-.115-1.23-.226-.13-.11-.014-.341.096-.451.11-.11.22-.258.33-.387.11-.13.147-.22.22-.37.074-.15.037-.28-.018-.39-.055-.11-.5-.1.68-.663-1.15-.226-.531-.476-.444-.643-.454-.167-.007-.354-.009-.54-.009-.187 0-.49.07-.745.347-.255.277-.974.952-.974 2.32 0 1.368.995 2.688 1.134 2.874.139.186 1.954 2.99 4.73 4.193.66.286 1.176.457 1.579.584.664.212 1.267.182 1.743.11.53-.08 1.638-.67 1.869-1.316.23-.646.23-1.201.161-1.316-.069-.115-.255-.185-.533-.324z" />
                        </svg>
                      </div>
                      <h2 className="text-[28px] font-light text-neutral-800 tracking-normal">WhatsApp for Windows</h2>
                      <p className="text-xs text-neutral-500 mt-2">
                        Grow, organise and manage your business account.
                      </p>
                    </div>

                    <div className="absolute bottom-10 flex items-center gap-1.5 text-xs text-neutral-400">
                      <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span>Your personal messages are end-to-end encrypted</span>
                    </div>

                    {/* Watermark Activation (Windows 11) */}
                    <div className="absolute bottom-6 right-8 text-right select-none pointer-events-none opacity-[0.22] text-neutral-600 font-sans leading-tight">
                      <p className="text-[13px] tracking-wide font-normal">Activate Windows</p>
                      <p className="text-[10px] mt-0.5">Go to Settings to activate Windows.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Updates/Status View */}
          {activeTab === 'updates' && (
            <UpdatesTab
              statuses={statuses}
              user={user}
              onAddMyStatus={handleAddMyStatus}
              onViewStatus={handleViewStatus}
            />
          )}

          {/* Communities View */}
          {activeTab === 'communities' && <CommunitiesTab />}

          {/* Calls View */}
          {activeTab === 'calls' && <CallsTab calls={calls} contacts={contacts} />}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <SettingsTab
              user={user}
              onUpdateUser={handleUpdateUser}
              onClearAllChats={handleClearAllChats}
            />
          )}

        </div>

        {/* Bottom Tab Bar (Mobile only) */}
        {renderMobileTabs()}
      </div>
    </div>
  );
}
