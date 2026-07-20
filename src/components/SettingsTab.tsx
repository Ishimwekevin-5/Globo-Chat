/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User as UserIcon, Palette, Trash2, ShieldCheck, Check, Bot, Sparkles, Phone, Info } from 'lucide-react';
import { User } from '../types';

interface SettingsTabProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onClearAllChats: () => void;
}

export default function SettingsTab({ user, onUpdateUser, onClearAllChats }: SettingsTabProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [phone, setPhone] = useState(user.phone);
  const [selectedWallpaper, setSelectedWallpaper] = useState(user.wallpaper);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const wallpapers: { id: User['wallpaper']; name: string; class: string }[] = [
    { id: 'default', name: 'Default Doodle', class: 'bg-[#efeae2] border-neutral-300' },
    { id: 'dark', name: 'Midnight Dark', class: 'bg-[#0b141a] border-neutral-900 text-white' },
    { id: 'emerald', name: 'Emerald Forest', class: 'bg-[#091b12] border-[#0c8567] text-white' },
    { id: 'peach', name: 'Sunset Peach', class: 'bg-[#fff5f0] border-orange-200 text-orange-950' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      bio,
      phone,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleSelectWallpaper = (wallId: User['wallpaper']) => {
    setSelectedWallpaper(wallId);
    onUpdateUser({
      ...user,
      wallpaper: wallId,
    });
  };

  const executeWipe = () => {
    onClearAllChats();
    setShowConfirmClear(false);
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
    }, 3000);
  };

  return (
    <div id="settings-tab-panel" className="flex-1 overflow-y-auto bg-[#f0f2f5] h-full">
      <div className="max-w-xl mx-auto p-4 md:py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Settings</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your workspace identity and display preferences</p>
        </div>

        {/* PROFILE SECTION */}
        <div className="bg-white border border-neutral-200/50 rounded-xl p-4 md:p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <UserIcon className="w-5 h-5 text-[#00a884]" />
            <h3 className="text-sm font-semibold text-neutral-800">My Profile</h3>
          </div>

          {/* Quick Profile display */}
          <div className="flex items-center gap-4 py-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#00a884]/40 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold text-base text-neutral-900">{user.name}</p>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{user.phone}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-sm text-neutral-800 rounded-xl p-2.5 outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Bio / About
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-sm text-neutral-800 rounded-xl p-2.5 outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl p-2.5">
                  <Phone className="w-4 h-4 text-neutral-400 mr-2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-sm text-neutral-800 outline-none border-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#00a884] font-semibold">
                {saveSuccess && '✓ Profile saved successfully'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00a884] text-white hover:bg-[#008f72] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* CHAT WALLPAPER DISPLAY PREFERENCES */}
        <div className="bg-white border border-neutral-200/50 rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Palette className="w-5 h-5 text-[#00a884]" />
            <h3 className="text-sm font-semibold text-neutral-800">Chat Wallpaper</h3>
          </div>
          
          <p className="text-xs text-neutral-500">Choose a solid theme or standard background doodle styling for chat windows.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            {wallpapers.map((wall) => {
              const isSelected = selectedWallpaper === wall.id;
              return (
                <button
                  key={wall.id}
                  onClick={() => handleSelectWallpaper(wall.id)}
                  className={`border p-3 rounded-xl flex flex-col items-center justify-between gap-3 h-24 shadow-none transition-all relative ${wall.class} ${
                    isSelected ? 'border-[#00a884] ring-1 ring-[#00a884]' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-wide uppercase ${wall.id === 'default' ? 'text-neutral-800' : ''}`}>
                    {wall.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 p-0.5 rounded-full bg-[#00a884] text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI ENGINE DESCRIPTION CARD */}
        <div className="bg-gradient-to-r from-blue-500/5 to-[#00a884]/5 border border-[#d1d7db] rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#00a884]">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              Gemini AI-Enabled Workspace <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            This workspace includes an Express proxy connected directly to the server-side <span className="font-medium text-[#00a884]">Gemini 2.5 Flash</span> API. 
            All simulated characters (Mom, Elon Musk, Meta AI, Sarah the Recruiter) reply using custom system instructions that emulate real human behavior.
          </p>
        </div>

        {/* DANGER/MAINTENANCE SECTION */}
        <div className="bg-white border border-red-200 rounded-xl p-4 md:p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-red-100">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-500">Maintenance & Privacy</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-800">Clear entire chat log</p>
                <p className="text-[11px] text-neutral-500">Irreversibly wipe all local storage message streams.</p>
              </div>
              
              {!showConfirmClear ? (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Clear Logs
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-500 text-[10px] font-bold uppercase tracking-wider rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeWipe}
                    className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-red-700 shadow-md"
                  >
                    Confirm Wipe
                  </button>
                </div>
              )}
            </div>

            {clearSuccess && (
              <p className="text-xs text-[#00a884] font-semibold">
                ✓ Chat history wiped successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
