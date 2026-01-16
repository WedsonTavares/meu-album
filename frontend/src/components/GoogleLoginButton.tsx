import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { loginWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const mutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      setSession(data);
      const redirect = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirect || "/");
    },
  });

  useEffect(() => {
    if (!clientId) return;
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    const init = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: { credential: string }) => {
          mutation.mutate(resp.credential);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        shape: "pill",
        size: "large",
        text: "continue_with",
      });
    };

    if (existing) {
      existing.addEventListener("load", init, { once: true });
      if (window.google) init();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [clientId, mutation]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="social-login">
      <div ref={buttonRef} aria-label="Continuar com Google" />
      {mutation.isError && (
        <div className="error" style={{ marginTop: 8 }}>
          Não foi possível autenticar pelo Google.
        </div>
      )}
    </div>
  );
}
