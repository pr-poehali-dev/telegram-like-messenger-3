import { useState } from "react";
import Icon from "@/components/ui/icon";

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

const CHATS: Chat[] = [
  {
    id: 1, name: "Алиса Морозова", avatar: "АМ", lastMsg: "Окей, увидимся завтра!", time: "14:32",
    unread: 3, online: true,
    messages: [
      { id: 1, text: "Привет! Как дела?", out: false, time: "14:20", read: true },
      { id: 2, text: "Всё отлично, спасибо! А у тебя?", out: true, time: "14:21", read: true },
      { id: 3, text: "Тоже хорошо. Встречаемся завтра?", out: false, time: "14:25", read: true },
      { id: 4, text: "Да, конечно! В 15:00 у кофейни", out: true, time: "14:30", read: true },
      { id: 5, text: "Окей, увидимся завтра!", out: false, time: "14:32", read: false },
    ]
  },
  {
    id: 2, name: "Команда Проекта", avatar: "КП", lastMsg: "Дедлайн перенесли на пятницу", time: "12:10",
    unread: 1, online: false,
    messages: [
      { id: 1, text: "Всем привет! Созвон в 11:00", out: false, time: "10:00", read: true },
      { id: 2, text: "Буду!", out: true, time: "10:05", read: true },
      { id: 3, text: "Дедлайн перенесли на пятницу", out: false, time: "12:10", read: false },
    ]
  },
  {
    id: 3, name: "Дима Волков", avatar: "ДВ", lastMsg: "Скинь файл плиз", time: "Вчера",
    unread: 0, online: true,
    messages: [
      { id: 1, text: "Привет, ты занят?", out: false, time: "Вчера 18:00", read: true },
      { id: 2, text: "Нет, что нужно?", out: true, time: "Вчера 18:05", read: true },
      { id: 3, text: "Скинь файл плиз", out: false, time: "Вчера 18:10", read: true },
    ]
  },
  {
    id: 4, name: "Маша Кузнецова", avatar: "МК", lastMsg: "Спасибо большое! 🙏", time: "Пн",
    unread: 0, online: false,
    messages: [
      { id: 1, text: "Ты можешь помочь с презентацией?", out: false, time: "Пн 15:00", read: true },
      { id: 2, text: "Конечно, пришли материалы", out: true, time: "Пн 15:20", read: true },
      { id: 3, text: "Спасибо большое! 🙏", out: false, time: "Пн 16:00", read: true },
    ]
  },
  {
    id: 5, name: "Антон Смирнов", avatar: "АС", lastMsg: "Классная идея!", time: "Вс",
    unread: 0, online: false,
    messages: [
      { id: 1, text: "Что думаешь про стартап?", out: true, time: "Вс 20:00", read: true },
      { id: 2, text: "Классная идея!", out: false, time: "Вс 20:30", read: true },
    ]
  },
];

const CONTACTS: Contact[] = [
  { id: 1, name: "Алиса Морозова", avatar: "АМ", status: "В сети", online: true, phone: "+7 999 123 45 67" },
  { id: 2, name: "Антон Смирнов", avatar: "АС", status: "Был час назад", online: false, phone: "+7 977 234 56 78" },
  { id: 3, name: "Дима Волков", avatar: "ДВ", status: "В сети", online: true, phone: "+7 912 345 67 89" },
  { id: 4, name: "Маша Кузнецова", avatar: "МК", status: "Не беспокоить", online: false, phone: "+7 965 456 78 90" },
  { id: 5, name: "Никита Орлов", avatar: "НО", status: "Был вчера", online: false, phone: "+7 904 567 89 01" },
  { id: 6, name: "Оля Петрова", avatar: "ОП", status: "В сети", online: true, phone: "+7 921 678 90 12" },
];

const NOTIFICATIONS = [
  { id: 1, type: "msg", text: "Алиса Морозова написала вам сообщение", time: "2 мин назад", read: false, icon: "MessageCircle" },
  { id: 2, type: "call", text: "Пропущенный звонок от Димы Волкова", time: "35 мин назад", read: false, icon: "PhoneMissed" },
  { id: 3, type: "group", text: "Команда Проекта: Дедлайн перенесли", time: "1 ч назад", read: true, icon: "Users" },
  { id: 4, type: "contact", text: "Оля Петрова добавила вас в контакты", time: "3 ч назад", read: true, icon: "UserPlus" },
  { id: 5, type: "msg", text: "Маша Кузнецова отправила файл", time: "Вчера", read: true, icon: "Paperclip" },
];

const AVATAR_COLORS: Record<string, string> = {
  "АМ": "from-purple-500 to-pink-500",
  "КП": "from-blue-500 to-cyan-500",
  "ДВ": "from-green-500 to-emerald-500",
  "МК": "from-orange-500 to-yellow-500",
  "АС": "from-red-500 to-rose-500",
  "НО": "from-indigo-500 to-blue-500",
  "ОП": "from-pink-500 to-purple-500",
};

function Avatar({ initials, size = "md", online = false }: { initials: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const sz = size === "sm" ? "w-9 h-9 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm";
  const color = AVATAR_COLORS[initials] || "from-purple-500 to-blue-500";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shadow-lg`}>
        {initials}
      </div>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#080b14] online-dot" />
      )}
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [searchQuery, setSearchQuery] = useState("");

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  function sendMessage() {
    if (!inputText.trim() || !activeChat) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg: Message = { id: Date.now(), text: inputText, out: true, time, read: false };
    setChats(prev => prev.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], lastMsg: inputText, time }
        : c
    ));
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMsg], lastMsg: inputText, time } : prev);
    setInputText("");
  }

  const navItems: { tab: Tab; icon: string; label: string; badge?: number }[] = [
    { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: totalUnread },
    { tab: "contacts", icon: "Users", label: "Контакты" },
    { tab: "notifications", icon: "Bell", label: "Уведомления", badge: NOTIFICATIONS.filter(n => !n.read).length },
    { tab: "settings", icon: "Settings", label: "Настройки" },
    { tab: "profile", icon: "User", label: "Профиль" },
  ];

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen w-full mesh-bg font-golos overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col glass border-r border-white/5 relative z-10">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow">
              <Icon name="Zap" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">NeoChat</h1>
              <p className="text-white/40 text-xs mt-0.5">Мессенджер</p>
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Bottom user */}
        <div className="mt-auto p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              ВЯ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Вы</p>
              <p className="text-white/40 text-xs">В сети</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "chats" && (
          <>
            {/* Chat list */}
            <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="p-4 border-b border-white/5">
                <h2 className="text-white font-bold text-xl mb-3">Чаты</h2>
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
                {filteredChats.map((chat) => (
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
                        <span className="text-white/40 text-xs truncate">{chat.lastMsg}</span>
                        {chat.unread > 0 && (
                          <span className="ml-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full min-w-[18px] flex items-center justify-center px-1 flex-shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat header */}
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 glass">
                    <Avatar initials={activeChat.avatar} online={activeChat.online} />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{activeChat.name}</h3>
                      <p className={`text-xs ${activeChat.online ? "text-green-400" : "text-white/40"}`}>
                        {activeChat.online ? "В сети" : "Не в сети"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon name="Phone" size={16} className="text-white/60" />
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon name="Video" size={16} className="text-white/60" />
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon name="MoreVertical" size={16} className="text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {activeChat.messages.map((msg, i) => (
                      <div
                        key={msg.id}
                        className={`flex animate-fade-up ${msg.out ? "justify-end" : "justify-start"}`}
                        style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
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

                  {/* Input */}
                  <div className="px-6 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
                        <Icon name="Paperclip" size={18} className="text-white/50" />
                      </button>
                      <input
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Напишите сообщение..."
                        className="flex-1 px-4 py-2.5 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none"
                      />
                      <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
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
                    <p className="text-white/40 text-sm mt-1">Начните общение прямо сейчас</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "contacts" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white font-bold text-2xl">Контакты</h2>
                <p className="text-white/40 text-sm mt-1">{CONTACTS.length} контактов</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                <Icon name="UserPlus" size={15} />
                Добавить
              </button>
            </div>

            <div className="relative mb-6">
              <Icon name="Search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input placeholder="Поиск контактов..." className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {CONTACTS.map((c, i) => (
                <div
                  key={c.id}
                  className="glass rounded-2xl p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer group animate-fade-up"
                  style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar initials={c.avatar} size="lg" online={c.online} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{c.name}</p>
                      <p className={`text-xs mt-0.5 ${c.online ? "text-green-400" : "text-white/40"}`}>{c.status}</p>
                      <p className="text-white/30 text-xs mt-1">{c.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/60 hover:text-purple-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                      <Icon name="MessageCircle" size={13} />
                      Написать
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-white/60 hover:text-blue-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                      <Icon name="Phone" size={13} />
                      Позвонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white font-bold text-2xl">Уведомления</h2>
                <p className="text-white/40 text-sm mt-1">{NOTIFICATIONS.filter(n => !n.read).length} непрочитанных</p>
              </div>
              <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                Прочитать все
              </button>
            </div>

            <div className="space-y-3 max-w-2xl">
              {NOTIFICATIONS.map((n, i) => (
                <div
                  key={n.id}
                  className={`glass rounded-2xl p-4 flex items-start gap-4 transition-all duration-200 animate-fade-up ${!n.read ? "border-l-2 border-purple-500" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !n.read
                      ? "bg-gradient-to-br from-purple-500/30 to-blue-500/30"
                      : "bg-white/5"
                  }`}>
                    <Icon name={n.icon} size={18} className={!n.read ? "text-purple-400" : "text-white/40"} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!n.read ? "text-white font-medium" : "text-white/60"}`}>{n.text}</p>
                    <p className="text-white/30 text-xs mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0 animate-glow" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <h2 className="text-white font-bold text-2xl mb-8">Настройки</h2>

            <div className="max-w-2xl space-y-6">
              {[
                { section: "Аккаунт", items: [
                  { icon: "User", label: "Личные данные", desc: "Имя, фото, статус" },
                  { icon: "Lock", label: "Конфиденциальность", desc: "Кто может писать вам" },
                  { icon: "Shield", label: "Безопасность", desc: "Пароль, двухфакторка" },
                ]},
                { section: "Интерфейс", items: [
                  { icon: "Palette", label: "Тема оформления", desc: "Цвета и стиль" },
                  { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация" },
                  { icon: "Globe", label: "Язык", desc: "Русский" },
                ]},
                { section: "Данные", items: [
                  { icon: "Database", label: "Хранилище", desc: "Очистить кэш" },
                  { icon: "Download", label: "Экспорт данных", desc: "Скачать историю" },
                ]},
              ].map((group, gi) => (
                <div key={gi} className="animate-fade-up" style={{ animationDelay: `${gi * 0.1}s`, opacity: 0 }}>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 px-1">{group.section}</p>
                  <div className="glass rounded-2xl overflow-hidden">
                    {group.items.map((item, ii) => (
                      <button key={ii} className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors ${ii !== 0 ? "border-t border-white/5" : ""}`}>
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
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
            <h2 className="text-white font-bold text-2xl mb-8">Профиль</h2>

            <div className="max-w-2xl">
              <div className="glass rounded-3xl p-8 mb-6 animate-fade-up" style={{ opacity: 0 }}>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl neon-glow">
                      ВЯ
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <Icon name="Camera" size={14} className="text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-2xl">Ваше Имя</h3>
                    <p className="text-white/50 text-sm mt-1">@username</p>
                    <p className="text-white/40 text-sm mt-3 leading-relaxed">Привет! Я использую NeoChat 🚀</p>
                    <div className="flex gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">6</p>
                        <p className="text-white/40 text-xs">Чатов</p>
                      </div>
                      <div className="w-px bg-white/10" />
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">6</p>
                        <p className="text-white/40 text-xs">Контактов</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 900 000 00 00" },
                  { icon: "Mail", label: "Email", value: "you@email.com" },
                  { icon: "MapPin", label: "Город", value: "Москва, Россия" },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? "border-t border-white/5" : ""}`}>
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon name={row.icon} size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">{row.label}</p>
                      <p className="text-white text-sm font-medium mt-0.5">{row.value}</p>
                    </div>
                    <button className="ml-auto text-white/20 hover:text-purple-400 transition-colors">
                      <Icon name="Pencil" size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors animate-fade-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
