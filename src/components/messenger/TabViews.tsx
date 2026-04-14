import Icon from "@/components/ui/icon";
import { Contact, Tab } from "./types";
import { Avatar } from "./Modals";
import { useAuth } from "@/contexts/AuthContext";

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: () => void;
  onDeleteContact: (id: number) => void;
  onOpenChat: (name: string) => void;
  onShowToast: (msg: string) => void;
}

export function ContactsView({ contacts, onAddContact, onDeleteContact, onOpenChat, onShowToast }: ContactsViewProps) {
  return (
    <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-white font-bold text-2xl">Контакты</h2>
          <p className="text-white/40 text-sm mt-1">{contacts.length} контактов</p>
        </div>
        <button
          onClick={onAddContact}
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
            onClick={onAddContact}
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
                  onClick={() => onDeleteContact(c.id)}
                  className="text-white/10 hover:text-red-400 transition-colors"
                  title="Удалить контакт"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onOpenChat(c.name)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/60 hover:text-purple-400 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Icon name="MessageCircle" size={13} />
                  Написать
                </button>
                <button
                  onClick={() => onShowToast("Звонок пока недоступен")}
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
  );
}

export function NotificationsView() {
  return (
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
  );
}

interface SettingsViewProps {
  chatsCount: number;
  contactsCount: number;
  onSetTab: (tab: Tab) => void;
  onEditProfile: () => void;
  onShowToast: (msg: string) => void;
  onLogout: () => void;
}

export function SettingsView({ chatsCount, contactsCount, onSetTab, onEditProfile, onShowToast, onLogout }: SettingsViewProps) {
  const groups = [
    { section: "Аккаунт", items: [
      { icon: "User", label: "Личные данные", desc: "Имя, статус", action: onEditProfile },
      { icon: "Lock", label: "Сменить пароль", desc: "Обновить пароль", action: onEditProfile },
      { icon: "Shield", label: "Безопасность", desc: "Двухфакторная аутентификация", action: () => onShowToast("Скоро будет доступно") },
    ]},
    { section: "Интерфейс", items: [
      { icon: "Palette", label: "Тема оформления", desc: "Цвета и стиль", action: () => onShowToast("Скоро будет доступно") },
      { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация", action: () => onSetTab("notifications") },
      { icon: "Globe", label: "Язык", desc: "Русский", action: () => onShowToast("Скоро будет доступно") },
    ]},
    { section: "Данные", items: [
      { icon: "Users", label: "Контакты", desc: `${contactsCount} контактов`, action: () => onSetTab("contacts") },
      { icon: "MessageCircle", label: "Чаты", desc: `${chatsCount} чатов`, action: () => onSetTab("chats") },
    ]},
  ];

  return (
    <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
      <h2 className="text-white font-bold text-2xl mb-8">Настройки</h2>

      <div className="max-w-2xl space-y-6">
        {groups.map((group, gi) => (
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
            onClick={onLogout}
            className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProfileViewProps {
  chatsCount: number;
  contactsCount: number;
  userInitials: string;
  onSetTab: (tab: Tab) => void;
  onEditProfile: () => void;
  onShowToast: (msg: string) => void;
  onLogout: () => void;
}

export function ProfileView({ chatsCount, contactsCount, userInitials, onSetTab, onEditProfile, onShowToast, onLogout }: ProfileViewProps) {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col p-8 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white font-bold text-2xl">Профиль</h2>
        <button
          onClick={onEditProfile}
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
                onClick={() => onShowToast("Загрузка фото пока недоступна")}
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
                <button className="text-center hover:opacity-80 transition-opacity" onClick={() => onSetTab("chats")}>
                  <p className="text-white font-bold text-lg">{chatsCount}</p>
                  <p className="text-white/40 text-xs">Чатов</p>
                </button>
                <div className="w-px bg-white/10" />
                <button className="text-center hover:opacity-80 transition-opacity" onClick={() => onSetTab("contacts")}>
                  <p className="text-white font-bold text-lg">{contactsCount}</p>
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
              onClick={onEditProfile}
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
              onClick={onEditProfile}
              className="ml-auto text-white/20 hover:text-purple-400 transition-colors"
            >
              <Icon name="Pencil" size={15} />
            </button>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-6 w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors animate-fade-up flex items-center justify-center gap-2"
          style={{ animationDelay: "0.25s", opacity: 0 }}
        >
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
