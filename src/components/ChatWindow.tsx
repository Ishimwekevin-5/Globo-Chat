/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Search, MoreVertical, Paperclip, Smile, Mic, Send, Bot,
  Phone, Video, Check, CheckCheck, FileText, Camera, Image, Headphones,
  MapPin, User as UserIcon, Play, Pause, Trash2, ShieldAlert
} from 'lucide-react';
import { Contact, Message, User } from '../types';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string, type?: 'text' | 'image' | 'audio') => void;
  onBack: () => void;
  user: User;
  onClearChat: () => void;
}

export default function ChatWindow({
  contact,
  messages,
  onSendMessage,
  onBack,
  user,
  onClearChat,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [innerSearchQuery, setInnerSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or typing state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, contact.typing]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showAttachMenu && attachMenuRef.current && !attachMenuRef.current.contains(target)) {
        setShowAttachMenu(false);
      }
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setShowEmojiPicker(false);
      }
      if (showMoreMenu && moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu, showEmojiPicker, showMoreMenu]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  // Mock attachments
  const handleAttachMock = (type: 'image' | 'audio' | 'document') => {
    setShowAttachMenu(false);
    if (type === 'image') {
      onSendMessage("Sent a photo 📸", "image");
    } else if (type === 'audio') {
      onSendMessage("Voice note (0:08) 🎙️", "audio");
    } else {
      onSendMessage("📄 Project_Proposal_v2.pdf (1.4 MB)");
    }
  };

  // Format delivery ticks
  const renderTicks = (status: 'sending' | 'sent' | 'delivered' | 'read') => {
    if (status === 'sending') return <span className="text-[10px] text-neutral-400">...</span>;
    if (status === 'sent') return <Check className="w-3.5 h-3.5 text-neutral-400" />;
    if (status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />;
    if (status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
    return null;
  };

  // Group messages by date helper
  const getGroupedMessages = () => {
    const groups: Record<string, Message[]> = {};
    const filtered = messages.filter((msg) =>
      innerSearchQuery
        ? msg.text.toLowerCase().includes(innerSearchQuery.toLowerCase())
        : true
    );

    filtered.forEach((msg) => {
      const msgDate = new Date(msg.timestamp);
      let dateKey = msgDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
      
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (msgDate.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (msgDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  const groupedMessages = getGroupedMessages();

  // Emojis for quick picker
  const popularEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉', '🚀', '💻', '💡', '☕️', '✨', '✔️'];

  return (
    <div id="active-chat-window" className="flex flex-col flex-1 h-full bg-[#efeae2] relative">
      {/* Top Header */}
      <div id="chat-header-bar" className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#d1d7db] h-[64px] z-10 flex-shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button for mobile */}
          <button
            id="chat-back-btn"
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-[#f0f2f5] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Details */}
          <div className="relative cursor-pointer">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
              referrerPolicy="no-referrer"
            />
            {contact.isOnline && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00e676] rounded-full border-2 border-white" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-neutral-900 truncate">
                {contact.name}
              </span>
              {contact.characterType !== 'standard' && (
                <span className="text-[9px] font-bold bg-[#00a884]/10 border border-[#00a884]/20 text-[#00a884] px-1 rounded flex items-center gap-0.5">
                  <Bot className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 truncate">
              {contact.typing ? 'typing...' : contact.isOnline ? 'Online' : contact.lastSeen}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 text-neutral-600">
          <button className="p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors" title="Voice Call">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors" title="Video Call">
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors ${showSearch ? 'bg-[#f0f2f5] text-[#00a884]' : ''}`}
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* More Menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-11 w-48 bg-white border border-neutral-200 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in duration-100 text-neutral-800">
                <button
                  onClick={() => { onClearChat(); setShowMoreMenu(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-[#f0f2f5] w-full text-left font-bold uppercase tracking-wider text-[10px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear chat log
                </button>
                <div className="border-b border-neutral-100 my-1"></div>
                <div className="px-4 py-1.5 text-[9px] text-neutral-400 tracking-wider font-semibold">
                  Phone: {contact.isGroup ? "Group Session" : "+1 (555) AI-PROXY"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Internal Message Search Bar */}
      {showSearch && (
        <div className="px-4 py-2.5 bg-[#f0f2f5] border-b border-[#d1d7db] flex items-center justify-between z-10 animate-in slide-in-from-top-2 duration-150 select-none">
          <div className="relative flex items-center bg-white rounded-full px-3 py-1.5 flex-1 mr-3 border border-neutral-200">
            <Search className="w-4 h-4 text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="Search text in dialogue..."
              value={innerSearchQuery}
              onChange={(e) => setInnerSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-800 outline-none placeholder-neutral-400"
            />
          </div>
          <button
            onClick={() => { setShowSearch(false); setInnerSearchQuery(''); }}
            className="text-xs font-bold text-[#00a884] hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Chat Wallpaper Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-4 relative">
        
        {/* End-to-end encryption banner */}
        <div className="flex justify-center my-1 select-none">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-neutral-200/60 text-neutral-600 px-4 py-2 rounded-xl text-[10px] max-w-sm text-center shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00A884] flex-shrink-0" />
            <span className="font-medium">All dialogues are safely proxy-encrypted with Google Gemini.</span>
          </div>
        </div>

        {/* Render Grouped Messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-3">
            {/* Date Separator */}
            <div className="flex justify-center my-3 select-none">
              <span className="bg-white/80 backdrop-blur-xs border border-neutral-200/40 text-neutral-500 text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-lg shadow-xs">
                {date}
              </span>
            </div>

            {/* Individual Bubbles */}
            {msgs.map((msg) => {
              const isUser = msg.sender === 'user';
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-150`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[65%] rounded-2xl px-4 py-2 border relative shadow-xs ${
                      isUser
                        ? 'bg-[#d9fdd3] border-[#bbf7d0]/30 text-neutral-900 rounded-tr-none'
                        : 'bg-white border-neutral-200/60 text-neutral-900 rounded-tl-none'
                    }`}
                  >
                    {/* Media Type Attachments */}
                    {msg.type === 'image' && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"
                          alt="Attachment"
                          className="w-full max-h-[220px] object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-3 py-2 px-2.5 mb-2 bg-[#00a884]/5 border border-[#00a884]/15 rounded-xl select-none">
                        <button
                          onClick={() => setAudioPlayingId(audioPlayingId === msg.id ? null : msg.id)}
                          className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#008f72] transition-colors"
                        >
                          {audioPlayingId === msg.id ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                        </button>
                        <div className="flex-1 min-w-[120px]">
                          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                            <div className={`h-full bg-[#00a884] ${audioPlayingId === msg.id ? 'w-2/3 transition-all duration-[8000ms]' : 'w-0'}`} />
                          </div>
                          <span className="text-[10px] text-neutral-500 mt-1 block font-bold">Voice note (0:08)</span>
                        </div>
                      </div>
                    )}

                    {/* Text Message */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-12 pb-1 text-neutral-950 font-sans">
                      {msg.text}
                    </p>

                    {/* Timestamp & Ticks aligned to bottom-right */}
                    <div className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[9px] text-neutral-400 select-none">
                      <span>{timeStr}</span>
                      {isUser && renderTicks(msg.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator bubble */}
        {contact.typing && (
          <div className="flex w-full justify-start animate-in fade-in duration-200">
            <div className="bg-white border border-neutral-200/60 text-neutral-400 rounded-xl rounded-tl-none px-4 py-2.5 shadow-xs max-w-[160px] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute left-4 bottom-[72px] bg-white border border-neutral-200 shadow-2xl rounded-2xl p-3 z-50 max-w-[280px] animate-in slide-in-from-bottom-2 duration-150 select-none text-neutral-800"
        >
          <div className="grid grid-cols-6 gap-2">
            {popularEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-xl p-1.5 rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <div
          ref={attachMenuRef}
          className="absolute left-14 bottom-[72px] bg-white border border-neutral-200 shadow-2xl rounded-2xl py-2 px-1.5 z-50 w-48 animate-in slide-in-from-bottom-2 duration-150 text-xs text-neutral-800 font-medium select-none"
        >
          <button
            onClick={() => handleAttachMock('image')}
            className="flex items-center gap-3 px-3.5 py-2 hover:bg-[#f0f2f5] rounded-xl w-full text-left transition-colors"
          >
            <span className="p-1.5 rounded-lg bg-pink-100 text-pink-600"><Image className="w-3.5 h-3.5" /></span>
            Photos & Videos
          </button>
          <button
            onClick={() => handleAttachMock('document')}
            className="flex items-center gap-3 px-3.5 py-2 hover:bg-[#f0f2f5] rounded-xl w-full text-left transition-colors"
          >
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600"><FileText className="w-3.5 h-3.5" /></span>
            Document (PDF)
          </button>
          <button
            onClick={() => handleAttachMock('audio')}
            className="flex items-center gap-3 px-3.5 py-2 hover:bg-[#f0f2f5] rounded-xl w-full text-left transition-colors"
          >
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600"><Headphones className="w-3.5 h-3.5" /></span>
            Audio Clip
          </button>
        </div>
      )}

      {/* Bottom Message Input Box */}
      <div id="chat-input-bar" className="bg-white border-t border-[#d1d7db] px-4 py-3 flex items-center justify-between gap-3 h-[64px] z-10 flex-shrink-0 select-none">
        <div className="flex items-center gap-1.5 text-neutral-600">
          {/* Smile Emoji button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors ${showEmojiPicker ? 'text-[#00a884] bg-[#f0f2f5]' : ''}`}
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Attach Menu button */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2 rounded-lg hover:text-neutral-900 hover:bg-[#f0f2f5] transition-colors ${showAttachMenu ? 'text-[#00a884] rotate-45 bg-[#f0f2f5]' : ''}`}
            title="Attach File"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area */}
        <input
          id="message-text-input"
          type="text"
          placeholder="Type a message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-white border border-neutral-300 text-sm text-neutral-800 placeholder-neutral-500 py-2 px-4 rounded-full outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all"
        />

        {/* Voice Note / Send Button */}
        <div className="flex-shrink-0">
          {inputText.trim() ? (
            <button
              id="send-message-btn"
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f72] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <button
              id="voice-note-btn"
              onClick={() => { onSendMessage("🎙️ Voice Note (0:04)", "audio"); }}
              className="w-9 h-9 rounded-full hover:bg-[#f0f2f5] text-neutral-500 flex items-center justify-center transition-colors"
              title="Record voice note"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
