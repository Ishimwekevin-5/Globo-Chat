/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, Eye, Trash2, X, ChevronRight, MessageSquare, PlusCircle } from 'lucide-react';
import { Status, User } from '../types';

interface UpdatesTabProps {
  statuses: Status[];
  user: User;
  onAddMyStatus: (caption: string) => void;
  onViewStatus: (id: string) => void;
}

export default function UpdatesTab({ statuses, user, onAddMyStatus, onViewStatus }: UpdatesTabProps) {
  const [activeStoryStatus, setActiveStoryStatus] = useState<Status | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [newStatusCaption, setNewStatusCaption] = useState('');

  // Channels follow states
  const [channels, setChannels] = useState([
    {
      id: 'ch1',
      name: 'WhatsApp Official',
      avatar: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=80',
      followers: '128M followers',
      verified: true,
      lastPost: 'Stay connected securely with end-to-end encryption. New updates are rolling out today with improved message search filters!',
      time: '2h ago',
      followed: true
    },
    {
      id: 'ch2',
      name: 'TechCrunch Official',
      avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
      followers: '15M followers',
      verified: true,
      lastPost: 'Startup funding sees a 12% rise in Q2 2026, driven by massive generative AI model training infrastructure investments.',
      time: '5h ago',
      followed: false
    },
    {
      id: 'ch3',
      name: 'FC Barcelona',
      avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
      followers: '42M followers',
      verified: true,
      lastPost: 'Matchday preparations underway! Training session in progress ahead of Sundays big rivalry match. 🔵🔴⚽️',
      time: 'Yesterday',
      followed: false
    }
  ]);

  // Story Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStoryStatus) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            // Close status
            onViewStatus(activeStoryStatus.id);
            setActiveStoryStatus(null);
            return 0;
          }
          return prev + 2; // Increments to 100 over 5 seconds (50 increments of 100ms)
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStoryStatus]);

  const handleOpenStatus = (status: Status) => {
    setActiveStoryStatus(status);
  };

  const handleCreateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusCaption.trim()) return;
    onAddMyStatus(newStatusCaption.trim());
    setNewStatusCaption('');
    setShowCreateStatus(false);
  };

  const toggleFollowChannel = (id: string) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, followed: !ch.followed } : ch));
  };

  // Split updates into viewed and unviewed
  const unviewedStatuses = statuses.filter(s => !s.viewed);
  const viewedStatuses = statuses.filter(s => s.viewed);

  return (
    <div id="updates-tab-panel" className="flex-1 overflow-y-auto bg-[#f0f2f5] h-full">
      <div className="max-w-xl mx-auto p-4 md:py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Updates</h2>
        </div>

        {/* STATUS SECTION */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-800">Status</h3>
          </div>

          {/* My Status */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setShowCreateStatus(true)}
                  className="absolute bottom-0 right-0 bg-[#00a884] text-white p-1 rounded-full hover:bg-[#008f72] shadow-md transition-all"
                  title="Add Status Update"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">My status</p>
                <p className="text-xs text-neutral-500">Tap to add status update</p>
              </div>
            </div>
          </div>

          {/* Recent Statuses (Unviewed) */}
          {unviewedStatuses.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-[#00a884] uppercase tracking-wider">Recent updates</p>
              {unviewedStatuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleOpenStatus(status)}
                  className="flex items-center gap-3 w-full text-left p-2 hover:bg-[#f0f2f5] rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00a884] p-[1.5px]">
                    <img
                      src={status.contactAvatar}
                      alt={status.contactName}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{status.contactName}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Viewed Updates */}
          {viewedStatuses.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Viewed updates</p>
              {viewedStatuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleOpenStatus(status)}
                  className="flex items-center gap-3 w-full text-left p-2 hover:bg-[#f0f2f5] rounded-xl transition-colors opacity-70"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-300 p-[1.5px]">
                    <img
                      src={status.contactAvatar}
                      alt={status.contactName}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{status.contactName}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CHANNELS SECTION */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200/50 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800">Channels</h3>
              <p className="text-[11px] text-neutral-500">Stay updated on your favorite topics</p>
            </div>
          </div>

          {/* Channels list */}
          <div className="space-y-4 divide-y divide-neutral-100">
            {channels.map((ch, idx) => (
              <div key={ch.id} className={`pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ch.avatar}
                      alt={ch.name}
                      className="w-11 h-11 rounded-full object-cover border border-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-semibold text-neutral-950 flex items-center gap-1">
                        {ch.name}
                        {ch.verified && (
                          <span className="w-3.5 h-3.5 bg-[#00a884] text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                        )}
                      </p>
                      <p className="text-xs text-neutral-500">{ch.followers}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollowChannel(ch.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      ch.followed
                        ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        : 'bg-[#e7f8f2] text-[#0c8567] hover:bg-[#d5f3e7]'
                    }`}
                  >
                    {ch.followed ? 'Following' : 'Follow'}
                  </button>
                </div>
                {/* Recent post snippet */}
                <div className="mt-2 bg-neutral-50 p-2.5 rounded-xl text-xs text-neutral-700 border border-neutral-100">
                  <p className="line-clamp-2">{ch.lastPost}</p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">{ch.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STORY MODAL VIEWER */}
      {activeStoryStatus && (
        <div id="status-story-modal" className="fixed inset-0 bg-black z-[100] flex flex-col justify-between p-4">
          {/* Progress Bar */}
          <div className="w-full flex gap-1 h-1 mt-2">
            <div className="flex-1 bg-neutral-800 rounded-full h-full overflow-hidden">
              <div className="bg-[#00a884] h-full transition-all duration-100" style={{ width: `${storyProgress}%` }} />
            </div>
          </div>

          {/* Upper Info */}
          <div className="flex items-center justify-between mt-3 text-white">
            <div className="flex items-center gap-3">
              <img
                src={activeStoryStatus.contactAvatar}
                alt={activeStoryStatus.contactName}
                className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-sm font-semibold">{activeStoryStatus.contactName}</p>
                <p className="text-xs text-neutral-400">
                  {new Date(activeStoryStatus.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button
              onClick={() => { onViewStatus(activeStoryStatus.id); setActiveStoryStatus(null); }}
              className="p-1 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Content */}
          <div className="flex-1 flex items-center justify-center max-h-[70vh] my-4">
            <img
              src={activeStoryStatus.mediaUrl}
              alt="Story"
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Caption */}
          <div className="text-center text-white pb-6 px-4">
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {activeStoryStatus.caption || "No caption"}
            </p>
          </div>
        </div>
      )}

      {/* Create Status Modal */}
      {showCreateStatus && (
        <div id="create-status-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCreateStatus(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Create Status</h2>
            <p className="text-xs text-neutral-400 mb-4">Post a text update to your timeline story.</p>

            <form onSubmit={handleCreateStatusSubmit} className="space-y-4">
              <div>
                <textarea
                  required
                  rows={4}
                  value={newStatusCaption}
                  onChange={(e) => setNewStatusCaption(e.target.value)}
                  placeholder="What's on your mind? ✍️"
                  className="w-full bg-neutral-50 text-sm text-neutral-900 rounded-xl p-3 outline-none border border-neutral-200 focus:border-[#00a884] resize-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateStatus(false)}
                  className="px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#00a884] text-white hover:bg-[#008f72] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-md"
                >
                  Post Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
