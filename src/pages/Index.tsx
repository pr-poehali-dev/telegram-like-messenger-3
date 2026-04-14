import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "chats" | "contacts" | "notifications" | "settings" | "profile";

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  phone: string;
}

const AVATAR_COLORS: Record<string, string> = {};

function getAvatarColor(initials: string): string {
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

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function now(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Toast({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-up">
      <div className="glass border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
        <Icon name="CheckCircle" size={16} className="text-green-400 flex-shrink-0" />
        <p className="text-white text-sm font-medium">{text}</p>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors ml-2">
          <Icon name="X" size={14} />
        </button>
      </div>
    </div>
  );
}

function Avatar({ initials, size = "md", online = false }: { initials: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const sz = size === "sm" ? "w-9 h-9 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm";
  const color = getAvatarColor(initials);
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shadow-lg`}>
        {initials}
      </div>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#080b14]" />
      )}
    </div>
  );
}

function NewChatModal({ contacts, onClose, onCreate }: {
  contacts: Contact[];
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Новый чат</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {contacts.length > 0 ? (
          <>
            <div className="relative mb-4">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Поиск контакта..."
                className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none" />
            </div>
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {filtered.map(c => (
                <button key={c.id} onClick={() => { onCreate(c.name); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left">
                  <Avatar initials={c.avatar} size="sm" online={c.online} />
                  <div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                    <p className="text-white/40 text-xs">{c.phone}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-white/30 text-sm text-center py-4">Не найдено</p>}
            </div>
          </>
        ) : (
          <>
            <p className="text-white/50 text-sm mb-4">Введите имя для нового чата</p>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Имя собеседника"
              onKeyDown={e => e.key === "Enter" && name.trim() && (onCreate(name.trim()), onClose())}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors mb-4" />
            <button onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); } }}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
              Начать чат
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function NewContactModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (c: Contact) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Введите имя"); return; }
    onAdd({
      id: Date.now(),
      name: name.trim(),
      avatar: getInitials(name.trim()),
      status: "Не в сети",
      online: false,
      phone: phone.trim() || "—",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Новый контакт</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Имя *</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="Имя контакта"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Телефон</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+7 000 000 00 00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
          <button onClick={handleAdd}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity mt-2">
            Добавить контакт
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileEditModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState<"name" | "password">("name");
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setError(""); setSuccess(""); setLoading(true);
    let err: string | null = null;
    if (tab === "name") {
      if (!name.trim()) { setError("Введите имя"); setLoading(false); return; }
      err = await updateProfile({ name: name.trim() });
    } else {
      if (!password) { setError("Введите новый пароль"); setLoading(false); return; }
      err = await updateProfile({ password, password_confirm: passwordConfirm });
    }
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess("Сохранено!");
    setTimeout(onClose, 900);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Редактировать профиль</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="flex rounded-xl bg-white/5 p-1 mb-5">
          <button onClick={() => { setTab("name"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === "name" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "text-white/50 hover:text-white/70"}`}>
            Имя
          </button>
          <button onClick={() => { setTab("password"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === "password" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "text-white/50 hover:text-white/70"}`}>
            Пароль
          </button>
        </div>
        {tab === "name" && (
          <div className="space-y-3">
            <label className="text-white/60 text-xs font-medium block">Имя</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="Ваше имя" />
          </div>
        )}
        {tab === "password" && (
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Новый пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Минимум 6 символов" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Повторите пароль</label>
              <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Повторите пароль" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
            <Icon name="CheckCircle" size={14} className="text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-xs">{success}</p>
          </div>
        )}
        <button onClick={handleSave} disabled={loading}
          className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Icon name="Loader2" size={15} className="animate-spin" /> Сохраняем...</> : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

export default function Index() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [toast, setToast] = useState("");

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function sendMessage() {
    if (!inputText.trim() || !activeChat) return;
    const t = now();
    const newMsg: Message = { id: Date.now(), text: inputText, out: true, time: t, read: false };
    setChats(prev => prev.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], lastMsg: inputText, time: t }
        : c
    ));
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMsg], lastMsg: inputText, time: t } : prev);
    setInputText("");
  }

  function createChat(name: string) {
    const existing = chats.find(c => c.name === name);
    if (existing) { setActiveChat(existing); setActiveTab("chats"); return; }
    const newChat: Chat = {
      id: Date.now(),
      name,
      avatar: getInitials(name),
      lastMsg: "",
      time: now(),
      unread: 0,
      online: false,
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setActiveTab("chats");
  }

  function addContact(c: Contact) {
    setContacts(prev => [c, ...prev]);
    showToast(`${c.name} добавлен в контакты`);
  }

  function openChatFromContact(name: string) {
    setActiveTab("chats");
    createChat(name);
  }

  const navItems: { tab: Tab; icon: string; label: string; badge?: number }[] = [
    { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: totalUnread || undefined },
    { tab: "contacts", icon: "Users", label: "Контакты" },
    { tab: "notifications", icon: "Bell", label: "Уведомления" },
    { tab: "settings", icon: "Settings", label: "Настройки" },
    { tab: "profile", icon: "User", label: "Профиль" },
  ];

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const userInitials = user?.name ? getInitials(user.name) : "?";

  return (
    <div className="flex h-screen w-full mesh-bg font-golos overflow-hidden">
      {toast && <Toast text={toast} onClose={() => setToast("")} />}
      {showNewChat && <NewChatModal contacts={contacts} onClose={() => setShowNewChat(false)} onCreate={createChat} />}
      {showNewContact && <NewContactModal onClose={() => setShowNewContact(false)} onAdd={addContact} />}
      {showEditProfile && <ProfileEditModal onClose={() => setShowEditProfile(false)} />}

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col glass border-r border-white/5 relative z-10">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow">
              <Icon name="Zap" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">SN</h1>
              <p className="text-white/40 text-xs mt-0.5">Мессенджер</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={item.tab}
              onClick={() => { setActiveTab(item.tab); setActiveChat(null); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                activeTab === item.tab
                  ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30"
                  : "bg-white/5 group-hover:bg-white/10"
              }`}>
                <Icon name={item.icon} size={16} className={activeTab === item.tab ? "text-white" : "text-white/60 group-hover:text-white/80"} />
              </div>
              <span className={`text-sm font-medium transition-colors ${activeTab === item.tab ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
                {item.label}
              </span>
              {item.badge ? (
                <span className="ml-auto text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/5">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || "Профиль"}</p>
              <p className="text-white/40 text-xs">В сети</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* CHATS */}
        {activeTab === "chats" && (
          <>
            <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xl">Чаты</h2>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center hover:opacity-90 transition-opacity"
                    title="Новый чат"
                  >
                    <Icon name="Plus" size={16} className="text-white" />
                  </button>
                </div>
                <div className="relative">
                  <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Поиск..."
                    className="w-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 px-6 py-12">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Icon name="MessageCircle" size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm text-center">Нажмите + чтобы начать новый чат</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className={`chat-item w-full px-4 py-3 flex items-center gap-3 text-left transition-all cursor-pointer ${activeChat?.id === chat.id ? "active" : ""}`}
                    >
                      <Avatar initials={chat.avatar} online={chat.online} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm font-semibold truncate">{chat.name}</span>
                          <span className="text-white/30 text-xs flex-shrink-0 ml-2">{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-white/40 text-xs truncate">{chat.lastMsg || "Чат создан"}</span>
                          {chat.unread > 0 && (
                            <span className="ml-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full min-w-[18px] flex items-center justify-center px-1 flex-shrink-0">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 glass">
                    <Avatar initials={activeChat.avatar} online={activeChat.online} />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{activeChat.name}</h3>
                      <p className={`text-xs ${activeChat.online ? "text-green-400" : "text-white/40"}`}>
                        {activeChat.online ? "В сети" : "Не в сети"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast("Звонок пока недоступен")}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        title="Позвонить"
                      >
                        <Icon name="Phone" size={16} className="text-white/60" />
                      </button>
                      <button
                        onClick={() => showToast("Видеозвонок пока недоступен")}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        title="Видеозвонок"
                      >
                        <Icon name="Video" size={16} className="text-white/60" />
                      </button>
                      <button
                        onClick={() => {
                          setChats(prev => prev.filter(c => c.id !== activeChat.id));
                          setActiveChat(null);
                          showToast("Чат удалён");
                        }}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                        title="Удалить чат"
                      >
                        <Icon name="Trash2" size={16} className="text-white/60 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {activeChat.messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                        <Icon name="MessageCircle" size={32} className="text-white/30" />
                        <p className="text-white/30 text-sm">Напишите первое сообщение</p>
                      </div>
                    )}
                    {activeChat.messages.map((msg, i) => (
                      <div
                        key={msg.id}
                        className={`flex animate-fade-up ${msg.out ? "justify-end" : "justify-start"}`}
                        style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}
                      >
                        {!msg.out && (
                          <div className="mr-2 mt-auto">
                            <Avatar initials={activeChat.avatar} size="sm" />
                          </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 ${msg.out ? "bubble-out" : "bubble-in"}`}>
                          <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                            <span className="text-white/40 text-xs">{msg.time}</span>
                            {msg.out && (
                              <Icon name={msg.read ? "CheckCheck" : "Check"} size={12} className={msg.read ? "text-blue-400" : "text-white/40"} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => showToast("Прикрепление файлов пока недоступно")}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <Icon name="Paperclip" size={18} className="text-white/50" />
                      </button>
                      <input
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Напишите сообщение..."
                        className="flex-1 px-4 py-2.5 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none"
                      />
                      <button
                        onClick={() => showToast("Эмодзи пока недоступны")}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <Icon name="Smile" size={18} className="text-white/50" />
                      </button>
                      <button
                        onClick={sendMessage}
                        disabled={!inputText.trim()}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <Icon name="Send" size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-float">
                    <Icon name="MessageCircle" size={36} className="text-purple-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-semibold text-lg">Выберите чат</h3>
                    <p className="text-white/40 text-sm mt-1">или начните новый</p>
                  </div>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Icon name="Plus" size={15} />
                    Новый чат
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white font-bold text-2xl">Контакты</h2>
                <p className="text-white/40 text-sm mt-1">{contacts.length} контактов</p>
              </div>
              <button
                onClick={() => setShowNewContact(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <Icon name="UserPlus" size={15} />
                Добавить
              </button>
            </div>

            <div className="relative mb-6">
              <Icon name="Search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input placeholder="Поиск контактов..." className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none" />
            </div>

            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 animate-fade-in py-20">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-float">
                  <Icon name="Users" size={36} className="text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg">Нет контактов</h3>
                  <p className="text-white/40 text-sm mt-1">Добавьте первый контакт</p>
                </div>
                <button
                  onClick={() => setShowNewContact(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Icon name="UserPlus" size={15} />
                  Добавить контакт
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {contacts.map((c, i) => (
                  <div
                    key={c.id}
                    className="glass rounded-2xl p-4 hover:bg-white/5 transition-all duration-200 group animate-fade-up"
                    style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar initials={c.avatar} size="lg" online={c.online} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{c.name}</p>
                        <p className={`text-xs mt-0.5 ${c.online ? "text-green-400" : "text-white/40"}`}>{c.status}</p>
                        <p className="text-white/30 text-xs mt-1">{c.phone}</p>
                      </div>
                      <button
                        onClick={() => {
                          setContacts(prev => prev.filter(x => x.id !== c.id));
                          showToast(`${c.name} удалён`);
                        }}
                        className="text-white/10 hover:text-red-400 transition-colors"
                        title="Удалить контакт"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openChatFromContact(c.name)}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/60 hover:text-purple-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                      >
                        <Icon name="MessageCircle" size={13} />
                        Написать
                      </button>
                      <button
                        onClick={() => showToast("Звонок пока недоступен")}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                      >
                        <Icon name="Phone" size={13} />
                        Позвонить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white font-bold text-2xl">Уведомления</h2>
                <p className="text-white/40 text-sm mt-1">Нет новых уведомлений</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-4 animate-fade-in py-20">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-float">
                <Icon name="Bell" size={36} className="text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold text-lg">Нет уведомлений</h3>
                <p className="text-white/40 text-sm mt-1">Здесь появятся новые события</p>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <h2 className="text-white font-bold text-2xl mb-8">Настройки</h2>

            <div className="max-w-2xl space-y-6">
              {[
                { section: "Аккаунт", items: [
                  { icon: "User", label: "Личные данные", desc: "Имя, статус", action: () => setShowEditProfile(true) },
                  { icon: "Lock", label: "Сменить пароль", desc: "Обновить пароль", action: () => setShowEditProfile(true) },
                  { icon: "Shield", label: "Безопасность", desc: "Двухфакторная аутентификация", action: () => showToast("Скоро будет доступно") },
                ]},
                { section: "Интерфейс", items: [
                  { icon: "Palette", label: "Тема оформления", desc: "Цвета и стиль", action: () => showToast("Скоро будет доступно") },
                  { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация", action: () => setActiveTab("notifications") },
                  { icon: "Globe", label: "Язык", desc: "Русский", action: () => showToast("Скоро будет доступно") },
                ]},
                { section: "Данные", items: [
                  { icon: "Users", label: "Контакты", desc: `${contacts.length} контактов`, action: () => setActiveTab("contacts") },
                  { icon: "MessageCircle", label: "Чаты", desc: `${chats.length} чатов`, action: () => setActiveTab("chats") },
                ]},
              ].map((group, gi) => (
                <div key={gi} className="animate-fade-up" style={{ animationDelay: `${gi * 0.1}s`, opacity: 0 }}>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 px-1">{group.section}</p>
                  <div className="glass rounded-2xl overflow-hidden">
                    {group.items.map((item, ii) => (
                      <button
                        key={ii}
                        onClick={item.action}
                        className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors ${ii !== 0 ? "border-t border-white/5" : ""}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                          <Icon name={item.icon} size={16} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-white/20" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
                <button
                  onClick={() => logout()}
                  className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="LogOut" size={16} />
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white font-bold text-2xl">Профиль</h2>
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
              >
                <Icon name="Pencil" size={14} />
                Редактировать
              </button>
            </div>

            <div className="max-w-2xl">
              <div className="glass rounded-3xl p-8 mb-6 animate-fade-up" style={{ opacity: 0 }}>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl neon-glow">
                      {userInitials}
                    </div>
                    <button
                      onClick={() => showToast("Загрузка фото пока недоступна")}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    >
                      <Icon name="Camera" size={14} className="text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-2xl">{user?.name || "Ваше Имя"}</h3>
                    <p className="text-white/50 text-sm mt-1">{user?.email || ""}</p>
                    <p className="text-white/40 text-sm mt-3 leading-relaxed">Привет! Я использую SN 🚀</p>
                    <div className="flex gap-4 mt-4">
                      <button className="text-center hover:opacity-80 transition-opacity" onClick={() => setActiveTab("chats")}>
                        <p className="text-white font-bold text-lg">{chats.length}</p>
                        <p className="text-white/40 text-xs">Чатов</p>
                      </button>
                      <div className="w-px bg-white/10" />
                      <button className="text-center hover:opacity-80 transition-opacity" onClick={() => setActiveTab("contacts")}>
                        <p className="text-white font-bold text-lg">{contacts.length}</p>
                        <p className="text-white/40 text-xs">Контактов</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon name="Mail" size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Email</p>
                    <p className="text-white text-sm font-medium mt-0.5">{user?.email || "—"}</p>
                  </div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="ml-auto text-white/20 hover:text-purple-400 transition-colors"
                  >
                    <Icon name="Pencil" size={15} />
                  </button>
                </div>
                <div className="border-t border-white/5 flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon name="User" size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Имя</p>
                    <p className="text-white text-sm font-medium mt-0.5">{user?.name || "—"}</p>
                  </div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="ml-auto text-white/20 hover:text-purple-400 transition-colors"
                  >
                    <Icon name="Pencil" size={15} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="mt-6 w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors animate-fade-up flex items-center justify-center gap-2"
                style={{ animationDelay: "0.25s", opacity: 0 }}
              >
                <Icon name="LogOut" size={16} />
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
