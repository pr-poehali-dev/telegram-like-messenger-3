import Icon from "@/components/ui/icon";
import { Tab } from "./types";

interface NavItem {
  tab: Tab;
  icon: string;
  label: string;
  badge?: number;
}

interface SidebarProps {
  activeTab: Tab;
  navItems: NavItem[];
  userInitials: string;
  userName: string | undefined;
  onTabChange: (tab: Tab) => void;
  onProfileClick: () => void;
}

export default function Sidebar({ activeTab, navItems, userInitials, userName, onTabChange, onProfileClick }: SidebarProps) {
  return (
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
            onClick={() => onTabChange(item.tab)}
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
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userName || "Профиль"}</p>
            <p className="text-white/40 text-xs">В сети</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" />
        </button>
      </div>
    </div>
  );
}
