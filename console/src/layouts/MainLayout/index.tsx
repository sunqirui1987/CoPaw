import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ChatLayout from "../ChatLayout";
import ConsoleLayout from "../ConsoleLayout";
import Chat from "../../pages/Chat";
import ChannelsPage from "../../pages/Control/Channels";
import SessionsPage from "../../pages/Control/Sessions";
import CronJobsPage from "../../pages/Control/CronJobs";
import AgentConfigPage from "../../pages/Agent/Config";
import SkillsPage from "../../pages/Agent/Skills";
import WorkspacePage from "../../pages/Agent/Workspace";
import MCPPage from "../../pages/Agent/MCP";
import ModelsPage from "../../pages/Settings/Models";
import GeneralConfigPage from "../../pages/Settings/GeneralConfig";
import EnvironmentsPage from "../../pages/Settings/Environments";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChat = location.pathname === "/chat" || location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/chat", { replace: true });
    }
  }, [location.pathname, navigate]);

  if (isChat) {
    return (
      <ChatLayout>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </ChatLayout>
    );
  }

  return (
    <ConsoleLayout>
      <Routes>
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/cron-jobs" element={<CronJobsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/mcp" element={<MCPPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/general-config" element={<GeneralConfigPage />} />
        <Route path="/environments" element={<EnvironmentsPage />} />
        <Route path="/agent-config" element={<AgentConfigPage />} />
      </Routes>
    </ConsoleLayout>
  );
}
