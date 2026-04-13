import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

export default function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    let err: string | null = null;
    if (mode === "login") {
      err = await login(email, password);
    } else {
      err = await register(name, email, password);
    }
    if (err) setError(err);
    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full mesh-bg font-golos flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow mb-4">
            <Icon name="Zap" size={28} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-3xl">NeoChat</h1>
          <p className="text-white/40 text-sm mt-1">Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-white/10 p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Минимум 6 символов" : "Ваш пароль"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mt-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Загрузка...</span>
                </>
              ) : (
                mode === "login" ? "Войти" : "Создать аккаунт"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
