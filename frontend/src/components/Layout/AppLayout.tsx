import { LogOut, Sparkles } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className="container">
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} color="var(--primary)" />
            <div style={{ fontWeight: 700, fontSize: 18 }}>Meus álbuns de fotos</div>
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="muted">
                Olá, <strong style={{ color: "var(--text)" }}>{user.name || user.email}</strong>
              </span>
              <button className="btn ghost" onClick={handleLogout}>
                <LogOut size={16} /> Sair
              </button>
            </div>
          )}
        </header>
        <Outlet />
      </div>
    </div>
  );
}
