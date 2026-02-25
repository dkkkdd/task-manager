import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { applyTheme } from "@/utils/userSettings";
import { useAuthState } from "@/context/AuthProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { TasksProvider } from "@/context/TasksContext";
import { useProjectsContext } from "./context/ProjectsContext";
import { AppLayout } from "@/components/AppLayout";
import { TaskList } from "@/components/Tasks/TaskList";
import { AuthPage } from "@/components/AuthPage";

function TasksWrapper({ children }: { children: React.ReactNode }) {
  const { mode, selectedProjectId } = useProjectsContext();
  return (
    <TasksProvider
      mode={mode}
      selectedProjectId={selectedProjectId}
      key={`${mode}-${selectedProjectId}`}
    >
      {children}
    </TasksProvider>
  );
}
export function MainContent() {
  const { mode, projects, selectedProjectId } = useProjectsContext();

  if (mode === "project") {
    const projectExists = projects.find((p) => p.id === selectedProjectId);

    if (!projectExists) {
      return <div className="p-20 text-center">404: Проект не знайдено</div>;
    }
  }

  return <TaskList />;
}

function ProtectedApp() {
  return (
    <ProjectsProvider>
      <TasksWrapper>
        <AppLayout>
          <MainContent />
        </AppLayout>
      </TasksWrapper>
    </ProjectsProvider>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuthState();
  const location = useLocation();
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const savedTheme = localStorage.getItem("theme") || "system";
      if (savedTheme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111] text-white">
        {t("loading")}...
      </div>
    );

  return (
    <Routes>
      {/* Публічні роути */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? <AuthPage isLoginMode /> : <Navigate to="/" />
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <AuthPage isLoginMode={false} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {isAuthenticated ? (
        <>
          <Route path="/" element={<ProtectedApp />} />
          <Route path="/today" element={<ProtectedApp />} />
          <Route path="/completed" element={<ProtectedApp />} />
          <Route path="/overdue" element={<ProtectedApp />} />
          <Route path="/projects" element={<ProtectedApp />} />
          <Route path="/project/:projectId" element={<ProtectedApp />} />
          <Route path="/task/:taskId" element={<ProtectedApp />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <Route
          path="*"
          element={<Navigate to="/login" state={{ from: location }} replace />}
        />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
