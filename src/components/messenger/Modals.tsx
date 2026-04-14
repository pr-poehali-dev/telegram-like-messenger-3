import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { Contact, getInitials, getAvatarColor } from "./types";

export function Avatar({ initials, size = "md", online = false }: { initials: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
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

export function Toast({ text, onClose }: { text: string; onClose: () => void }) {
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

export function NewChatModal({ contacts, onClose, onCreate }: {
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

export function NewContactModal({ onClose, onAdd }: {
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

export function ProfileEditModal({ onClose }: { onClose: () => void }) {
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
