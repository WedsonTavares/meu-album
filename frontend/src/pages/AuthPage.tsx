import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { login, register as registerUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GoogleLoginButton } from "../components/GoogleLoginButton";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome").optional(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  mode: "login" | "register";
}

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) =>
      mode === "login" ? login(data) : registerUser(data),
    onSuccess: (data) => {
      setSession(data);
      const redirect = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirect || "/");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  const actionIcon = mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />;
  const actionLabel =
    mutation.isPending ? "Enviando..." : mode === "login" ? "Entrar" : "Concluir";
  const helperText = mode === "login" ? "Cadastre-se" : "Cancelar";

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Dr. TIS</span>
          <h1>Meus álbuns de fotos</h1>
          <p className="auth-subtitle">
            {mode === "login" ? "Autentique-se" : "Faça seu cadastro"}
          </p>
        </div>

        <form className="stack" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <Input
              label="Nome"
              placeholder="Como devemos te chamar?"
              {...register("name")}
              error={errors.name?.message}
            />
          )}
          <Input
            label="E-mail"
            type="email"
            placeholder="email@exemplo.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            {...register("password")}
            error={errors.password?.message}
          />

          {mutation.error && (
            <div className="error">
              {(mutation.error as Error).message || "Não foi possível autenticar"}
            </div>
          )}

          <div className="auth-actions">
            <Link className="auth-link" to={mode === "login" ? "/register" : "/login"}>
              {helperText}
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending}
              icon={actionIcon}
            >
              {actionLabel}
            </Button>
          </div>
        </form>

        <div className="divider" />
        <div className="stack">
          <div className="tagline" style={{ textAlign: "center" }}>
            Prefere acessar com o Google?
          </div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
