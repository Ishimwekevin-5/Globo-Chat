/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, ChevronRight, MessageSquare, AlertCircle, HelpCircle, X } from 'lucide-react';

export default function CommunitiesTab() {
  const [communities, setCommunities] = useState([
    {
      id: 'com1',
      name: 'Veloce Tech Workspace',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      description: 'Official tech community for engineers, designers, and builders.',
      announcements: {
        text: 'Deploying React 19 v2 upgrade tonight. Clear your locks!',
        time: 'Today, 10:14 AM'
      },
      groups: [
        { name: '# general-tech', count: '124 members' },
        { name: '# help-design', count: '43 members' },
        { name: '# random-memes', count: '89 members' }
      ]
    },
    {
      id: 'com2',
      name: 'Coffee Roasters Union ☕️',
      avatar: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop&q=80',
      description: 'A community for artisanal coffee roasters and single-origin geeks.',
      announcements: {
        text: 'New geisha bean batch arriving from Panama next Tuesday! 🇵🇦',
        time: 'Yesterday'
      },
      groups: [
        { name: '# light-roasts', count: '76 members' },
        { name: '# brewing-gear', count: '92 members' }
      ]
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCommunities(prev => [
      ...prev,
      {
        id: 'com_' + Date.now(),
        name: newName,
        avatar: 'https://images.unsplash.com/photo-1531206715517-5c0ba140e2b8?w=150&auto=format&fit=crop&q=80',
        description: newDesc || 'Welcome to our new community!',
        announcements: {
          text: 'Welcome everyone! Tap here to see pinned topics.',
          time: 'Just now'
        },
        groups: [
          { name: '# general-announcements', count: '1 member' },
          { name: '# chat-room-1', count: '1 member' }
        ]
      }
    ]);

    setNewName('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div id="communities-tab-panel" className="flex-1 overflow-y-auto bg-[#f0f2f5] h-full">
      <div className="max-w-xl mx-auto p-4 md:py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Communities</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00a884] text-white hover:bg-[#008f72] rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> New Community
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 flex gap-4 text-xs text-neutral-600 shadow-sm">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#00a884] mt-0.5" />
          <div>
            <span className="font-bold tracking-wider uppercase text-[10px] text-neutral-800">What are Communities?</span>
            <p className="mt-1 leading-relaxed text-neutral-500">
              Communities bring related subgroups together. Manage announcements, pin schedules, or launch focused breakout channels instantly.
            </p>
          </div>
        </div>

        {/* Communities List */}
        <div className="space-y-4">
          {communities.map((com) => (
            <div key={com.id} className="bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-sm">
              {/* Header Box */}
              <div className="p-5 flex gap-4 border-b border-neutral-100">
                <img
                  src={com.avatar}
                  alt={com.name}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{com.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{com.description}</p>
                </div>
              </div>

              {/* Announcements Section */}
              {com.announcements && (
                <div className="p-4 bg-neutral-50 flex items-start gap-3 border-b border-neutral-100">
                  <div className="p-1.5 rounded-lg bg-[#00a884]/10 text-[#00a884] border border-[#00a884]/20 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800">Announcements</p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{com.announcements.text}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{com.announcements.time}</span>
                </div>
              )}

              {/* Sub-groups */}
              <div className="p-2 space-y-1">
                {com.groups.map((group, idx) => (
                  <button
                    key={idx}
                    className="flex items-center justify-between w-full p-2 hover:bg-[#f0f2f5] rounded-xl text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <MessageSquare className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="font-semibold text-neutral-700">{group.name}</p>
                        <p className="text-[10px] text-neutral-400 font-medium">{group.count}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE COMMUNITY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-neutral-800">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Create Community</h2>
            <p className="text-xs text-neutral-400 mb-4 font-normal">Start a new community with Announcement hub and custom subchannels.</p>
            
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Design Enthusiasts"
                  className="w-full bg-neutral-50 border border-neutral-200 text-sm text-neutral-800 rounded-xl p-2.5 outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Grouping design subgroups together"
                  className="w-full bg-neutral-50 border border-neutral-200 text-sm text-neutral-800 rounded-xl p-2.5 outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all placeholder-neutral-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#00a884] text-white hover:bg-[#008f72] font-semibold rounded-lg transition-colors shadow-md"
                >
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
