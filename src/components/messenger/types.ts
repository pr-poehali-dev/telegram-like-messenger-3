export type Tab = "chats" | "contacts" | "notifications" | "settings" | "profile";

export interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  phone: string;
}

const AVATAR_COLORS: Record<string, string> = {};

export function getAvatarColor(initials: string): string {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-yellow-500",
    "from-red-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-pink-500 to-purple-500",
    "from-teal-500 to-green-500",
  ];
  if (AVATAR_COLORS[initials]) return AVATAR_COLORS[initials];
  const idx = (initials.charCodeAt(0) || 0) % colors.length;
  AVATAR_COLORS[initials] = colors[idx];
  return colors[idx];
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export function nowTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}
