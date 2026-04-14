import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tab, Chat, Contact, Message, getInitials, nowTime } from "@/components/messenger/types";
import { Toast, NewChatModal, NewContactModal, ProfileEditModal } from "@/components/messenger/Modals";
import Sidebar from "@/components/messenger/Sidebar";
import ChatView from "@/components/messenger/ChatView";
import { ContactsView, NotificationsView, SettingsView, ProfileView } from "@/components/messenger/TabViews";

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
    const t = nowTime();
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
      time: nowTime(),
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

  function deleteContact(id: number) {
    const c = contacts.find(x => x.id === id);
    setContacts(prev => prev.filter(x => x.id !== id));
    if (c) showToast(`${c.name} удалён`);
  }

  function deleteChat(chatId: number) {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setActiveChat(null);
    showToast("Чат удалён");
  }

  function openChatFromContact(name: string) {
    setActiveTab("chats");
    createChat(name);
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setActiveChat(null);
  }

  const navItems = [
    { tab: "chats" as Tab, icon: "MessageCircle", label: "Чаты", badge: totalUnread || undefined },
    { tab: "contacts" as Tab, icon: "Users", label: "Контакты" },
    { tab: "notifications" as Tab, icon: "Bell", label: "Уведомления" },
    { tab: "settings" as Tab, icon: "Settings", label: "Настройки" },
    { tab: "profile" as Tab, icon: "User", label: "Профиль" },
  ];

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const userInitials = user?.name ? getInitials(user.name) : "?";

  return (
    <div className="flex h-screen w-full mesh-bg font-golos overflow-hidden">
      {toast && <Toast text={toast} onClose={() => setToast("")} />}
      {showNewChat && <NewChatModal contacts={contacts} onClose={() => setShowNewChat(false)} onCreate={createChat} />}
      {showNewContact && <NewContactModal onClose={() => setShowNewContact(false)} onAdd={addContact} />}
      {showEditProfile && <ProfileEditModal onClose={() => setShowEditProfile(false)} />}

      <Sidebar
        activeTab={activeTab}
        navItems={navItems}
        userInitials={userInitials}
        userName={user?.name}
        onTabChange={handleTabChange}
        onProfileClick={() => setActiveTab("profile")}
      />

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "chats" && (
          <ChatView
            chats={chats}
            filteredChats={filteredChats}
            activeChat={activeChat}
            inputText={inputText}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectChat={setActiveChat}
            onInputChange={setInputText}
            onSendMessage={sendMessage}
            onNewChat={() => setShowNewChat(true)}
            onDeleteChat={deleteChat}
            onShowToast={showToast}
          />
        )}

        {activeTab === "contacts" && (
          <ContactsView
            contacts={contacts}
            onAddContact={() => setShowNewContact(true)}
            onDeleteContact={deleteContact}
            onOpenChat={openChatFromContact}
            onShowToast={showToast}
          />
        )}

        {activeTab === "notifications" && <NotificationsView />}

        {activeTab === "settings" && (
          <SettingsView
            chatsCount={chats.length}
            contactsCount={contacts.length}
            onSetTab={setActiveTab}
            onEditProfile={() => setShowEditProfile(true)}
            onShowToast={showToast}
            onLogout={logout}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            chatsCount={chats.length}
            contactsCount={contacts.length}
            userInitials={userInitials}
            onSetTab={setActiveTab}
            onEditProfile={() => setShowEditProfile(true)}
            onShowToast={showToast}
            onLogout={logout}
          />
        )}
      </div>
    </div>
  );
}
