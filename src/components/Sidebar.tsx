/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MessageSquare,
  Phone,
  CircleDot,
  Radio,
  Users,
  FolderDown,
  Star,
  Megaphone,
  Image,
  Settings,
} from 'lucide-react';
import { TabType, User } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: User;
  onOpenProfile: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onOpenProfile }: SidebarProps) {
  return (
    <div
      id="sidebar-rail"
      className="hidden md:flex flex-col items-center justify-between w-[56px] bg-[#f3f4f6] border-r border-[#e2e5e7] py-2 h-full flex-shrink-0 select-none relative"
    >
      {/* Upper Navigation Icons */}
      <div className="flex flex-col items-center w-full">
        {/* Chats Tab */}
        <button
          id="sidebar-tab-chats"
          onClick={() => setActiveTab('chats')}
          className={`relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group ${
            activeTab === 'chats'
              ? 'text-neutral-950 font-bold'
              : 'text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900'
          }`}
          title="Chats"
        >
          {/* Active Left vertical indicator bar */}
          {activeTab === 'chats' && (
            <div className="absolute left-0 top-[12px] bottom-[12px] w-[3px] bg-neutral-900 rounded-r-md" />
          )}
          <MessageSquare className={`w-[20px] h-[20px] ${activeTab === 'chats' ? 'fill-neutral-900 stroke-neutral-900' : ''}`} />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Chats
          </span>
        </button>

        {/* Calls Tab */}
        <button
          id="sidebar-tab-calls"
          onClick={() => setActiveTab('calls')}
          className={`relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group ${
            activeTab === 'calls'
              ? 'text-neutral-950 font-bold'
              : 'text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900'
          }`}
          title="Calls"
        >
          {/* Active Left vertical indicator bar */}
          {activeTab === 'calls' && (
            <div className="absolute left-0 top-[12px] bottom-[12px] w-[3px] bg-neutral-900 rounded-r-md" />
          )}
          <Phone className={`w-[20px] h-[20px] ${activeTab === 'calls' ? 'fill-neutral-900' : ''}`} />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Calls
          </span>
        </button>

        {/* Status / Updates Tab */}
        <button
          id="sidebar-tab-updates"
          onClick={() => setActiveTab('updates')}
          className={`relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group ${
            activeTab === 'updates'
              ? 'text-neutral-950 font-bold'
              : 'text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900'
          }`}
          title="Status"
        >
          {/* Active Left vertical indicator bar */}
          {activeTab === 'updates' && (
            <div className="absolute left-0 top-[12px] bottom-[12px] w-[3px] bg-neutral-900 rounded-r-md" />
          )}
          <CircleDot className="w-[20px] h-[20px]" />
          {/* Green unread badge at the top-right of the icon */}
          <div className="absolute top-[12px] right-[16px] w-[6px] h-[6px] bg-[#00e676] rounded-full ring-[1.5px] ring-[#f3f4f6]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Status
          </span>
        </button>

        {/* Channels Tab (Mapped to Updates visually) */}
        <button
          id="sidebar-tab-channels"
          onClick={() => setActiveTab('updates')}
          className="relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900"
          title="Channels"
        >
          <Radio className="w-[20px] h-[20px]" />
          {/* Green unread badge at the top-right of the icon */}
          <div className="absolute top-[12px] right-[16px] w-[6px] h-[6px] bg-[#00e676] rounded-full ring-[1.5px] ring-[#f3f4f6]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Channels
          </span>
        </button>

        {/* Communities Tab */}
        <button
          id="sidebar-tab-communities"
          onClick={() => setActiveTab('communities')}
          className={`relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group ${
            activeTab === 'communities'
              ? 'text-neutral-950 font-bold'
              : 'text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900'
          }`}
          title="Communities"
        >
          {/* Active Left vertical indicator bar */}
          {activeTab === 'communities' && (
            <div className="absolute left-0 top-[12px] bottom-[12px] w-[3px] bg-neutral-900 rounded-r-md" />
          )}
          <Users className="w-[20px] h-[20px]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Communities
          </span>
        </button>

        {/* Divider line matching the Windows screenshot */}
        <div className="w-[32px] h-[1px] bg-[#e2e5e7] my-1.5" />

        {/* Archived */}
        <button
          id="sidebar-tab-archived"
          onClick={() => setActiveTab('chats')}
          className="relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900"
          title="Archived"
        >
          <FolderDown className="w-[20px] h-[20px]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Archived Chats
          </span>
        </button>

        {/* Starred */}
        <button
          id="sidebar-tab-starred"
          onClick={() => setActiveTab('chats')}
          className="relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900"
          title="Starred messages"
        >
          <Star className="w-[20px] h-[20px]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Starred Messages
          </span>
        </button>

        {/* Broadcasts */}
        <button
          id="sidebar-tab-broadcasts"
          onClick={() => setActiveTab('chats')}
          className="relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900"
          title="Broadcast lists"
        >
          <Megaphone className="w-[20px] h-[20px]" />
          {/* Green unread badge at the top-right of the icon */}
          <div className="absolute top-[12px] right-[16px] w-[6px] h-[6px] bg-[#00e676] rounded-full ring-[1.5px] ring-[#f3f4f6]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Broadcasts
          </span>
        </button>
      </div>

      {/* Bottom Icons & Avatar */}
      <div className="flex flex-col items-center w-full">
        {/* Media / Updates Quick Link */}
        <button
          onClick={() => setActiveTab('updates')}
          className="relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900"
          title="Media"
        >
          <Image className="w-[20px] h-[20px]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Media
          </span>
        </button>

        {/* Settings Tab Gear */}
        <button
          id="sidebar-tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`relative flex items-center justify-center w-full h-[48px] transition-all duration-150 group ${
            activeTab === 'settings'
              ? 'text-neutral-950 font-bold'
              : 'text-[#54656f] hover:bg-[#eaeaea] hover:text-neutral-900'
          }`}
          title="Settings"
        >
          {/* Active Left vertical indicator bar */}
          {activeTab === 'settings' && (
            <div className="absolute left-0 top-[12px] bottom-[12px] w-[3px] bg-neutral-900 rounded-r-md" />
          )}
          <Settings className="w-[20px] h-[20px]" />
          {/* Tooltip */}
          <span className="absolute left-[52px] scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 z-50 shadow-md whitespace-nowrap">
            Settings
          </span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-full flex items-center justify-center h-[48px] mt-1">
          <button
            id="sidebar-profile-btn"
            onClick={onOpenProfile}
            className="w-7 h-7 rounded-full overflow-hidden border border-[#d1d7db] hover:border-neutral-400 transition-all duration-150 relative"
            title="Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
