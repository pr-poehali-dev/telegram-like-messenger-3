import Icon from "@/components/ui/icon";
import { Chat, Message } from "./types";
import { Avatar } from "./Modals";

interface ChatViewProps {
  chats: Chat[];
  filteredChats: Chat[];
  activeChat: Chat | null;
  inputText: string;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSelectChat: (chat: Chat) => void;
  onInputChange: (v: string) => void;
  onSendMessage: () => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
  onShowToast: (msg: string) => void;
}

export default function ChatView({
  filteredChats,
  activeChat,
  inputText,
  searchQuery,
  onSearchChange,
  onSelectChat,
  onInputChange,
  onSendMessage,
  onNewChat,
  onDeleteChat,
  onShowToast,
}: ChatViewProps) {
  return (
    <>
      {/* Chat list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-xl">Чаты</h2>
            <button
              onClick={onNewChat}
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
              onChange={e => onSearchChange(e.target.value)}
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
                onClick={() => onSelectChat(chat)}
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

      {/* Chat window */}
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
                  onClick={() => onShowToast("Звонок пока недоступен")}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Позвонить"
                >
                  <Icon name="Phone" size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => onShowToast("Видеозвонок пока недоступен")}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Видеозвонок"
                >
                  <Icon name="Video" size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => onDeleteChat(activeChat.id)}
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
              {activeChat.messages.map((msg: Message, i: number) => (
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
                  onClick={() => onShowToast("Прикрепление файлов пока недоступно")}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icon name="Paperclip" size={18} className="text-white/50" />
                </button>
                <input
                  value={inputText}
                  onChange={e => onInputChange(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onSendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2.5 text-sm text-white placeholder-white/30 rounded-xl msg-input outline-none"
                />
                <button
                  onClick={() => onShowToast("Эмодзи пока недоступны")}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icon name="Smile" size={18} className="text-white/50" />
                </button>
                <button
                  onClick={onSendMessage}
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
              onClick={onNewChat}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Icon name="Plus" size={15} />
              Новый чат
            </button>
          </div>
        )}
      </div>
    </>
  );
}
