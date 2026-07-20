/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Message, Status, Call, User } from '../types';

export const INITIAL_USER: User = {
  name: "Kevin Ishimwe",
  avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='black'/><text x='50%' y='55%' font-family='serif' font-weight='bold' font-size='22' fill='white' dominant-baseline='middle' text-anchor='middle'>Pray.</text></svg>",
  bio: "Pray without ceasing. ✨",
  phone: "+1 (555) 019-2834",
  wallpaper: "default"
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "my_number",
    name: "My number (You)",
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='black'/><text x='50%' y='55%' font-family='serif' font-weight='bold' font-size='22' fill='white' dominant-baseline='middle' text-anchor='middle'>Pray.</text></svg>",
    bio: "Pray without ceasing. ✨",
    lastSeen: "Online",
    isGroup: false,
    isOnline: true,
    unreadCount: 0,
    characterType: "standard",
    pinned: true
  },
  {
    id: "work_group",
    name: "Dream Team",
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23ffffff'/><rect x='15' y='15' width='70' height='70' rx='15' fill='%23f0f2f5'/><text x='50%' y='45%' font-family='sans-serif' font-weight='bold' font-size='13' fill='%23e91e63' text-anchor='middle'>dream</text><text x='50%' y='65%' font-family='sans-serif' font-weight='bold' font-size='13' fill='%233f51b5' text-anchor='middle'>team</text></svg>",
    bio: "Official channel for the dream team updates.",
    lastSeen: "Online",
    isGroup: true,
    isOnline: true,
    unreadCount: 0,
    characterType: "standard",
    pinned: true
  },
  {
    id: "meta_ai",
    name: "Meta AI",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80", // beautiful blue fluid art
    bio: "Ask me anything! I can answer questions, create images, or just chat.",
    lastSeen: "Online",
    isGroup: false,
    isOnline: true,
    unreadCount: 1,
    characterType: "meta_ai",
    pinned: false
  },
  {
    id: "elon_musk",
    name: "Elon Musk",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", // tech guy look
    bio: "Mars & Cars, Chips & Dips. Occupy Mars.",
    lastSeen: "last seen 5m ago",
    isGroup: false,
    isOnline: false,
    unreadCount: 0,
    characterType: "elon_musk",
    pinned: false
  },
  {
    id: "mom",
    name: "Mom ❤️",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", // nice woman photo
    bio: "Family is everything 🌸",
    lastSeen: "Online",
    isGroup: false,
    isOnline: true,
    unreadCount: 2,
    characterType: "mom",
    pinned: false
  },
  {
    id: "sarah_recruiter",
    name: "Sarah (Tech Recruiter)",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", // business woman
    bio: "Lead Talent Acquisition at Google. Let's build the future!",
    lastSeen: "last seen yesterday at 6:40 PM",
    isGroup: false,
    isOnline: false,
    unreadCount: 0,
    characterType: "recruiter",
    pinned: false
  },
  {
    id: "alice",
    name: "Alice Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", // young woman smiling
    bio: "Always learning. Coffee enthusiast ☕️",
    lastSeen: "Online",
    isGroup: false,
    isOnline: true,
    unreadCount: 0,
    characterType: "standard",
    pinned: false
  }
];

// Initial realistic chat history
export const INITIAL_MESSAGES: Record<string, Message[]> = {
  meta_ai: [
    {
      id: "m_ai_1",
      text: "Hi Kevin! I'm Meta AI. How can I assist you with your project today? I can write code, analyze data, or even brainstorm design ideas for you!",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
      status: "read"
    },
    {
      id: "m_ai_2",
      text: "Awesome, I am testing out this new WhatsApp workspace. Can you explain the difference between REST and GraphQL in one sentence?",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
      status: "read"
    },
    {
      id: "m_ai_3",
      text: "REST delivers all data from pre-defined URL endpoints which can lead to over-fetching, while GraphQL lets clients request exactly the specific fields they need from a single dynamic endpoint.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
      status: "read"
    },
    {
      id: "m_ai_4",
      text: "That is incredibly clear! Thanks. I will reach out again if I need more help.",
      sender: "user",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      status: "read"
    },
    {
      id: "m_ai_5",
      text: "You're very welcome! I'm always here in your chat box. Feel free to ask me anything anytime. Let's build something epic! 🚀",
      sender: "contact",
      timestamp: new Date(Date.now() - 5000).toISOString(),
      status: "delivered"
    }
  ],
  elon_musk: [
    {
      id: "m_el_1",
      text: "The cybertruck assembly lines are moving fast. Extremely hard engineering challenge.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: "read"
    },
    {
      id: "m_el_2",
      text: "Hey Elon! That sounds intense. Any updates on the Starship orbital launch?",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString(),
      status: "read"
    },
    {
      id: "m_el_3",
      text: "We are targeting another launch attempt next month. Max design thrust, multiplanetary migration is essential to preserve the light of consciousness.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 4.4).toISOString(),
      status: "read"
    }
  ],
  mom: [
    {
      id: "m_mo_1",
      text: "Hi sweetie! Just making some apple pie. Are you coming over this weekend? 🍎🥧",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      status: "read"
    },
    {
      id: "m_mo_2",
      text: "Yes Mom! I'd love to. Can you make that garlic chicken too?",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 23.5).toISOString(),
      status: "read"
    },
    {
      id: "m_mo_3",
      text: "Of course! I will buy the ingredients today. Make sure you dress warmly, it is going to rain. 🌧️🧥 Talk to you soon!",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 23.4).toISOString(),
      status: "read"
    },
    {
      id: "m_mo_4",
      text: "Did you eat lunch yet?? 🍲 Don't work too hard!",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: "delivered"
    },
    {
      id: "m_mo_5",
      text: "Call me when you can honey! Miss you! ❤️🤱",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
      status: "delivered"
    }
  ],
  my_number: [
    {
      id: "m_mn_1",
      text: "https://open.spotify.com/track/1P0uAas7j8r0R8b...",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
      status: "read"
    }
  ],
  sarah_recruiter: [
    {
      id: "m_sa_1",
      text: "Hi Kevin, I saw your GitHub portfolio and was absolutely impressed by your real-time reactive applications. We have an open Senior Full Stack Role on our core product team at Google. Would you be open to a quick chat this week?",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      status: "read"
    },
    {
      id: "m_sa_2",
      text: "Hi Sarah! Thanks for reaching out. Yes, I'm absolutely interested in learning more. I'm available on Thursday afternoon.",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 47).toISOString(),
      status: "read"
    },
    {
      id: "m_sa_3",
      text: "That works perfectly! I've sent a Calendar invite for Thursday at 2:00 PM PST. Looking forward to our chat! Please let me know if you have any questions beforehand.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 46).toISOString(),
      status: "read"
    }
  ],
  work_group: [
    {
      id: "m_wg_1",
      text: "The new design changes are rolling in. Let's make sure everything looks pristine.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: "read"
    },
    {
      id: "m_wg_2",
      text: "Globomart: Yes, the frontend needs to align perfectly with the screenshot.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
      status: "read"
    },
    {
      id: "m_wg_3",
      text: "I didn't instruct I sugg...",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      status: "read"
    }
  ],
  alice: [
    {
      id: "m_al_1",
      text: "Hey! Are we still on for coffee later? I want to tell you about my trip to Tokyo! 🇯🇵✈️",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: "read"
    },
    {
      id: "m_al_2",
      text: "Definitely! Let's meet at Blue Bottle around 4:30. Can't wait to see the photos!",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString(),
      status: "read"
    }
  ]
};

export const INITIAL_STATUSES: Status[] = [
  {
    id: "s1",
    contactId: "meta_ai",
    contactName: "Meta AI",
    contactAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    caption: "The future is open. Announcing Llama 3! 🚀🤖",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    mediaUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80", // beautiful AI generative look
    viewed: false
  },
  {
    id: "s2",
    contactId: "elon_musk",
    contactName: "Elon Musk",
    contactAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    caption: "Falcon 9 heavy vertical on the pad. Ready for lift off. 🚀🌌",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    mediaUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&auto=format&fit=crop&q=80", // rocket launching
    viewed: false
  },
  {
    id: "s3",
    contactId: "alice",
    contactName: "Alice Jenkins",
    contactAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    caption: "Tokyo nights! 🌌🏮 So beautiful and lively here.",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    mediaUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80", // Tokyo street
    viewed: true
  }
];

export const INITIAL_CALLS: Call[] = [
  {
    id: "c1",
    contactId: "mom",
    contactName: "Mom ❤️",
    contactAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    type: "voice",
    direction: "missed",
    timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString() // 30 mins ago
  },
  {
    id: "c2",
    contactId: "alice",
    contactName: "Alice Jenkins",
    contactAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    type: "video",
    direction: "incoming",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hrs ago
    duration: "10:14"
  },
  {
    id: "c3",
    contactId: "sarah_recruiter",
    contactName: "Sarah (Tech Recruiter)",
    contactAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    type: "voice",
    direction: "outgoing",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    duration: "15:30"
  },
  {
    id: "c4",
    contactId: "mom",
    contactName: "Mom ❤️",
    contactAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    type: "voice",
    direction: "incoming",
    timestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
    duration: "4:25"
  }
];

export const MOCK_CHANNELS = [
  {
    id: "ch1",
    name: "WhatsApp Official",
    avatar: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=80",
    subscribers: "128M followers",
    verified: true,
    lastPost: "Stay connected securely with end-to-end encryption. New updates are rolling out today with improved message search filters!",
    time: "2h ago",
    followed: true
  },
  {
    id: "ch2",
    name: "TechCrunch",
    avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
    subscribers: "15M followers",
    verified: true,
    lastPost: "Startup funding sees a 12% rise in Q2 2026, driven by massive generative AI model training infrastructure investments.",
    time: "5h ago",
    followed: false
  },
  {
    id: "ch3",
    name: "FC Barcelona",
    avatar: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
    subscribers: "42M followers",
    verified: true,
    lastPost: "Matchday preparations underway! Training session in progress ahead of Sunday's big rivalry match. 🔵🔴⚽️",
    time: "Yesterday",
    followed: false
  }
];
