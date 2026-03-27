import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
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

  if (loading) return <div>{t("loading")}...</div>;

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
        <Route element={<AppLayout />}>
          <Route path="/inbox" element={<TaskList />} />
          <Route path="/today" element={<TaskList />} />
          <Route path="/completed" element={<TaskList />} />
          <Route path="/overdue" element={<TaskList />} />
          <Route path="/project/:id" element={<TaskList />} />

          {/* <Route path="/stats" element={<StatsPage />} /> */}

          <Route path="*" element={<Navigate to="/inbox" replace />} />
        </Route>
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
