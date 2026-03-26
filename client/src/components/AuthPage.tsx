import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import img from "@/assets/form.png";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthPageProps {
  isLoginMode: boolean;
}

export const AuthPage = ({ isLoginMode }: AuthPageProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    from?: { pathname: string };
  } | null;

  const from = locationState?.from?.pathname || searchParams.get("from") || "/";
  const loginUser = useAuthStore((s) => s.loginUser);
  const registerUser = useAuthStore((s) => s.registerUser);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = spotlightRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      container.style.setProperty("--x", `${x}px`);
      container.style.setProperty("--y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isMatching = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setError(null);

      if (!isLoginMode) {
        if (password.length < 8) {
          setError(t("password_min_length"));
          return;
        }
        if (password !== confirmPassword) {
          setError(t("passwords_not_match"));
          return;
        }
        if (!userName.trim()) {
          setError(t("name_required"));
          return;
        }
      }

      if (email && password) {
        try {
          if (isLoginMode) {
            await loginUser({ email, password });
          } else {
            await registerUser({ userName, email, password });
          }

          navigate(from, { replace: true });
        } catch (err) {
          const error = err as Error;
          const serverMessage = error.message;

          const errorMapping: Record<string, string> = {
            "Invalid credentials": "auth_error_invalid",
            "User already exists": "user_already_exists",
            "Internal server error": "server_error",
            "No token provided": "token_missing_error",
            "Failed to fetch": "connection_error",
          };

          const translationKey =
            errorMapping[serverMessage] || "connection_error";

          setError(t(translationKey));
        }
      }
    },
    [
      isLoginMode,
      email,
      password,
      confirmPassword,
      userName,
      loginUser,
      registerUser,
      navigate,
      from,
      t,
    ],
  );

  return (
    <div
      style={
        {
          "--x": "50%",
          "--y": "50%",
          backgroundImage: `radial-gradient(circle at var(--x) var(--y), rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.95) 25%), url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } as React.CSSProperties
      }
      ref={spotlightRef}
      className="flex h-screen overflow-hidden"
    >
      <div className="flex flex-1 md:max-w-[40em] flex-col items-center justify-center p-6  ">
        <form
          className="flex flex-col gap-[1.2em] p-[2em] rounded-[10px] shadow-[0_0_15px_rgb(27,27,27)] w-full max-w-[35em] bg-transparent backdrop-blur-md border border-white/10"
          onSubmit={handleSubmit}
        >
          <legend className="md:text-[2em] text-[1.5em] font-bold bg-gradient-to-r from-[#4270d1] via-[#9d174d] to-[#9d174d] bg-clip-text text-transparent mb-4">
            {isLoginMode ? t("login_title") : t("register_title")}
          </legend>

          {error && (
            <div className="py-3 rounded-lg text-red-500 text-sm animate-shake">
              {error}
            </div>
          )}

          {!isLoginMode && (
            <label className="relative block">
              <input
                minLength={3}
                maxLength={30}
                placeholder=" "
                required
                autoComplete="username"
                type="text"
                value={userName}
                className="peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline outline-1 outline-gray-500 focus:outline-2 focus:outline-[#4270d1] transition-all"
                onChange={(e) => setUserName(e.target.value)}
              />
              <span
                className="absolute left-[1em] transition-all pointer-events-none bg-transparent top-[1em] text-white/50 peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
              peer-[:not(:placeholder-shown)]:-top-[1.4em] peer-[:not(:placeholder-shown)]:left-[0.2em] 
              peer-[:not(:placeholder-shown)]:text-[0.8em]"
              >
                {t("your_name")}
              </span>
            </label>
          )}

          <label className="relative block">
            <input
              minLength={8}
              maxLength={150}
              placeholder=" "
              required
              type="email"
              autoComplete="email"
              value={email}
              className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all outline-1 focus:outline-2 outline-gray-500 focus:outline-[#4270d1]
     `}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
            <span
              className={`
   
      absolute left-[1em] top-[1em] transition-all duration-200 pointer-events-none bg-transparent
      peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em]
      peer-[:not(:placeholder-shown)]:-top-[1.5em] 
      peer-[:not(:placeholder-shown)]:left-[0.2em] 
      peer-[:not(:placeholder-shown)]:text-[0.8em]
      text-white/50 peer-focus:text-[#4270d1] peer-[:not(:placeholder-shown)]:text-[#4270d1]
      `}
            >
              {t("email_label")}
            </span>
          </label>

          <label className="relative block">
            <input
              placeholder=" "
              minLength={8}
              maxLength={30}
              required
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              type={showPass ? "text" : "password"}
              value={password}
              className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all focus:outline-2 
                ${
                  password.length > 0 && password.length < 8 && !isLoginMode
                    ? "outline-2 outline-red-500 focus:outline-red-500"
                    : "outline-1 outline-gray-500 focus:outline-[#4270d1]"
                }`}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className={`
    absolute left-[1em] transition-all pointer-events-none bg-transparent
    top-[1em] 
    peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
    peer-[:not(:placeholder-shown)]:-top-[1.5em] peer-[:not(:placeholder-shown)]:left-[0.2em] peer-[:not(:placeholder-shown)]:text-[0.8em]
   ${
     password.length > 0 && password.length < 8 && !isLoginMode
       ? "!text-red-500"
       : "text-white/50 peer-focus:text-[#4270d1]"
   }`}
            >
              {t("password_label")}
            </span>
            {password.length > 0 && password.length < 8 && !isLoginMode && (
              <span className="text-[0.7em] text-red-500 mt-1 block">
                {t("password_min_length")}
              </span>
            )}
            {!isLoginMode && (
              <button
                type="button"
                onClick={() => {
                  const pass = Math.random().toString(36).slice(-10);
                  setPassword(pass);
                  setConfirmPassword(pass);
                }}
                className="text-[#4270d1] pt-3 cursor-pointer text-sm flex items-center gap-2 hover:underline w-fit"
              >
                <span className="icon-key2"></span> {t("generate_password")}
              </button>
            )}
          </label>

          {!isLoginMode && (
            <label className="relative block">
              <input
                placeholder=" "
                required
                autoComplete={isLoginMode ? "current-password" : "new-password"}
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all focus:outline-2 
                  ${
                    confirmPassword.length > 0 && !isMatching
                      ? "outline-2 outline-red-500 focus:outline-red-500"
                      : "outline-1 outline-gray-500 focus:outline-[#4270d1]"
                  }`}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                className={`
    absolute left-[1em] transition-all pointer-events-none bg-transparent
    top-[1em] 
    peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
    peer-[:not(:placeholder-shown)]:-top-[1.5em] peer-[:not(:placeholder-shown)]:left-[0.2em] peer-[:not(:placeholder-shown)]:text-[0.8em]
  ${
    confirmPassword.length > 0 && !isMatching
      ? "!text-red-500"
      : "text-white/50 peer-focus:text-[#4270d1]"
  }`}
              >
                {t("confirm_password_label")}
              </span>
              {!isMatching && confirmPassword.length > 0 && (
                <span className="text-[0.7em] text-red-500 mt-1 block">
                  {t("passwords_not_match")}
                </span>
              )}
            </label>
          )}

          <div className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              className="accent-[#4270d1]"
              checked={showPass}
              onChange={() => setShowPass(!showPass)}
            />
            <label
              className="cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {t("show_password_label")}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4270d1] cursor-pointer text-white font-bold rounded-lg hover:bg-[#4270d9] transition-all shadow-lg active:scale-95"
          >
            {isLoginMode ? t("login_btn") : t("create_btn")}
          </button>

          <div className="text-center mt-2 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => {
                navigate(isLoginMode ? "/register" : "/login");
                if (error) {
                  setError(null);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setUserName("");
                }
              }}
              className="text-[#4270d1] cursor-pointer text-sm hover:underline"
            >
              {isLoginMode
                ? t("auth_switch_to_register")
                : t("auth_switch_to_login")}
            </button>
          </div>
        </form>
      </div>
      <div className="md:w-[40%] h-full"></div>
    </div>
  );
};
