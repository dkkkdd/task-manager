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
import { AppLayout } from "@/components/AppLayout";
import { TaskList } from "@/components/Tasks/TaskList";
import { AuthPage } from "@/components/AuthPage";

export function ProtectedApp() {
  return (
    <AppLayout>
      <Routes>
        <Route path="*" element={<TaskList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
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
        <Route path="/*" element={<ProtectedApp />} />
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
