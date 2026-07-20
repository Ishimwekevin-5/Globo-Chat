/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Video, PhoneCall, ArrowDownLeft, ArrowUpRight, Search, X, Mic, MicOff, VideoOff, Volume2, HelpCircle } from 'lucide-react';
import { Call, Contact } from '../types';

interface CallsTabProps {
  calls: Call[];
  contacts: Contact[];
}

export default function CallsTab({ calls, contacts }: CallsTabProps) {
  const [activeCallSimulation, setActiveCallSimulation] = useState<{
    contactName: string;
    contactAvatar: string;
    type: 'voice' | 'video';
    status: 'calling' | 'ringing' | 'connected' | 'ended';
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [micActive, setMicActive] = useState(true);
  const [speakerActive, setSpeakerActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  // Filter logs
  const filteredCalls = calls.filter(call =>
    call.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startMockCall = (contact: Contact, type: 'voice' | 'video') => {
    setActiveCallSimulation({
      contactName: contact.name,
      contactAvatar: contact.avatar,
      type: type,
      status: 'calling'
    });

    // Simulate connection cycle
    setTimeout(() => {
      setActiveCallSimulation(prev => prev ? { ...prev, status: 'ringing' } : null);
    }, 1500);

    setTimeout(() => {
      setActiveCallSimulation(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 3500);
  };

  const handleHangup = () => {
    if (activeCallSimulation) {
      setActiveCallSimulation(prev => prev ? { ...prev, status: 'ended' } : null);
      setTimeout(() => {
        setActiveCallSimulation(null);
      }, 800);
    }
  };

  return (
    <div id="calls-tab-panel" className="flex-1 overflow-y-auto bg-[#f0f2f5] h-full relative">
      <div className="max-w-xl mx-auto p-4 md:py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Calls</h2>
        </div>

        {/* Search Call Log */}
        <div className="relative flex items-center bg-white border border-neutral-200 rounded-full px-3 py-2 shadow-xs">
          <Search className="w-4 h-4 text-neutral-400 mr-2" />
          <input
            type="text"
            placeholder="Search call logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-800 placeholder-neutral-400 outline-none border-none"
          />
        </div>

        {/* CALL LOGS */}
        <div className="bg-white border border-neutral-200/50 rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Recent Logs</h3>

          {filteredCalls.length === 0 ? (
            <div className="text-center py-6 text-neutral-400">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-neutral-300" />
              <p className="text-xs font-semibold">No history logs</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredCalls.map((call) => {
                const isMissed = call.direction === 'missed';
                const isIncoming = call.direction === 'incoming' || call.direction === 'missed';
                
                return (
                  <div key={call.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={call.contactAvatar}
                        alt={call.contactName}
                        className="w-11 h-11 rounded-lg object-cover border border-neutral-100 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className={`text-sm font-semibold ${isMissed ? 'text-red-500' : 'text-neutral-900'}`}>
                          {call.contactName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-500">
                          {isIncoming ? (
                            <ArrowDownLeft className={`w-3.5 h-3.5 ${isMissed ? 'text-red-500' : 'text-[#00a884]'}`} />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span className="text-[10px] font-semibold text-neutral-400">
                            {new Date(call.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const contact = contacts.find(c => c.id === call.contactId) || contacts[0];
                          startMockCall(contact, call.type);
                        }}
                        className="p-2 bg-neutral-50 border border-neutral-200 text-[#00a884] hover:bg-[#f0f2f5] rounded-lg transition-all"
                        title={`Place a ${call.type} call`}
                      >
                        {call.type === 'voice' ? <Phone className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUICK CALL CONTACTS LIST */}
        <div className="bg-white border border-neutral-200/50 rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
          <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Start New Session</h3>
          <div className="divide-y divide-neutral-100">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-sm font-semibold text-neutral-800">{contact.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startMockCall(contact, 'voice')}
                    className="p-2 text-neutral-500 hover:text-[#00a884] bg-neutral-50 border border-neutral-200 rounded-lg transition-all"
                    title="Audio call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => startMockCall(contact, 'video')}
                    className="p-2 text-neutral-500 hover:text-[#00a884] bg-neutral-50 border border-neutral-200 rounded-lg transition-all"
                    title="Video call"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL SCREEN CALL OVERLAY */}
      {activeCallSimulation && (
        <div id="full-screen-call-overlay" className="fixed inset-0 bg-neutral-950/95 z-[150] flex flex-col justify-between items-center p-8 text-white select-none backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mt-12">
            <span className="text-[9px] text-[#00a884] uppercase tracking-widest font-bold flex items-center gap-1.5 justify-center bg-[#00a884]/10 border border-[#00a884]/20 rounded px-2.5 py-1">
              <PhoneCall className="w-3 h-3 animate-pulse" /> SIMULATED AI PROXY CALL
            </span>
            <h3 className="text-2xl font-bold text-white mt-4">{activeCallSimulation.contactName}</h3>
            <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1 animate-pulse">
              {activeCallSimulation.status}...
            </p>
          </div>

          {/* Caller Photo/Video Screen */}
          <div className="relative my-6 w-full max-w-sm flex items-center justify-center">
            {activeCallSimulation.type === 'video' && activeCallSimulation.status === 'connected' && videoActive ? (
              // Mock video stream
              <div className="w-60 h-80 rounded-2xl overflow-hidden shadow-2xl relative bg-black border border-neutral-800">
                <img
                  src={activeCallSimulation.contactAvatar}
                  alt={activeCallSimulation.contactName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* User small webcam overlay */}
                <div className="absolute bottom-4 right-4 w-20 h-28 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[9px] tracking-wider uppercase text-neutral-600 font-bold">Me</div>
                </div>
              </div>
            ) : (
              // Audio circle with pulsing ring
              <div className="relative">
                {activeCallSimulation.status === 'connected' && (
                  <>
                    <div className="absolute inset-0 bg-[#00a884]/10 rounded-xl border border-[#00a884]/20 animate-ping duration-[2000ms]" />
                    <div className="absolute inset-2 bg-[#00a884]/5 rounded-xl border border-[#00a884]/10 animate-pulse" />
                  </>
                )}
                <img
                  src={activeCallSimulation.contactAvatar}
                  alt={activeCallSimulation.contactName}
                  className="w-32 h-32 rounded-xl object-cover border border-[#00a884]/40 relative z-10 shadow-lg shadow-[#00a884]/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="mb-12 w-full max-w-xs flex flex-col gap-6 items-center">
            {/* Action text */}
            {activeCallSimulation.status === 'connected' && (
              <p className="text-[10px] text-neutral-500 tracking-wider uppercase text-center font-semibold">
                AUDIO PATHS SECURED VIA SERVER-SIDE PROXIES.
              </p>
            )}

            <div className="flex justify-around items-center w-full gap-4">
              {/* Mic toggle */}
              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-4 rounded-xl border transition-all ${
                  micActive ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                }`}
                title="Mute microphone"
              >
                {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Speaker toggle */}
              <button
                onClick={() => setSpeakerActive(!speakerActive)}
                className={`p-4 rounded-xl border transition-all bg-neutral-900 border-neutral-800 ${
                  speakerActive ? 'text-[#00a884]' : 'text-neutral-500'
                }`}
                title="Toggle Speakerphone"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* Video toggle */}
              {activeCallSimulation.type === 'video' && (
                <button
                  onClick={() => setVideoActive(!videoActive)}
                  className={`p-4 rounded-xl border transition-all ${
                    videoActive ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  }`}
                  title="Toggle Camera"
                >
                  {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              )}

              {/* Hangup Red button */}
              <button
                onClick={handleHangup}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all shadow-lg"
                title="Hang Up"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
