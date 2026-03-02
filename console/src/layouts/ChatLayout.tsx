import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import ConsoleCronBubble from "../components/ConsoleCronBubble";
import InitModal from "../components/InitModal";
import { useState, useEffect } from "react";
import { agentApi } from "../api/modules/agent";
import styles from "./ChatLayout.module.less";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const navigate = useNavigate();
  const [showInitModal, setShowInitModal] = useState(false);

  useEffect(() => {
    agentApi
      .getInitStatus()
      .then((res) => setShowInitModal(res.needs_init))
      .catch(() => setShowInitModal(false));
  }, []);

  return (
    <div className={styles.chatLayout}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <img src="/logo.png" alt="Aicraw" className={styles.logo} />
          <span className={styles.chatTitle}>Chat</span>
        </div>
        <button
          type="button"
          className={styles.dashboardBtn}
          onClick={() => navigate("/channels")}
        >
          <LayoutDashboard size={18} />
          <span>Console</span>
        </button>
      </div>

      <div className={styles.chatBody}>{children}</div>

      <InitModal open={showInitModal} onClose={() => setShowInitModal(false)} />
      <ConsoleCronBubble />
    </div>
  );
}
