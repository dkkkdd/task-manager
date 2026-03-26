import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/AppLayout";
import { TaskList } from "@/components/Tasks/TaskList";
import { AuthPage } from "@/components/AuthPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useInitializeApp } from "./hooks/useInitializeApp";

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useInitializeApp();

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
        <Route
          path="/*"
          element={
            <AppLayout>
              <TaskList />
            </AppLayout>
          }
        />
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
      <AppContent />
    </BrowserRouter>
  );
}
