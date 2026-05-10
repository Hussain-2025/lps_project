import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../auth/AuthProvider";
import { Field, FormMessage } from "../components/forms";
import { loginFormSchema, type LoginFormValues } from "../features/auth/api";
import { env } from "../lib/env";
import { getApiError } from "../lib/api/errors";

export function ERPLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const nextRoute = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from;
    return from || null;
  }, [location.state]);

  function getDefaultRoute(role: string) {
    if (role === "admin" || role === "super_admin") {
      return "/admin";
    }

    if (role === "teacher") {
      return "/erp/teacher";
    }

    if (role === "student") {
      return "/erp/student";
    }

    return "/erp/parent";
  }

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);
    try {
      const user = await login(values.email, values.password);
      navigate(nextRoute ?? getDefaultRoute(user.role), { replace: true });
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    }
  }

  return (
    <section className="section login-section">
      <div className="container login-grid">
        <div className="feature-panel">
          <p className="eyebrow">ERP Portal</p>
          <h1>Secure school access for staff and portal users</h1>
          <p className="lead">
            The login flow is connected to the backend JWT and refresh-cookie session model.
          </p>
          <img alt="School crest" className="login-crest" src="/logo.png" />
        </div>
        <form className="card surface-card form-card" onSubmit={form.handleSubmit(onSubmit)}>
          <h2>Sign in</h2>
          <Field error={form.formState.errors.email?.message} label="Email">
            <input type="email" {...form.register("email")} />
          </Field>
          <Field error={form.formState.errors.password?.message} label="Password">
            <input type="password" {...form.register("password")} />
          </Field>
          {errorMessage ? <FormMessage type="error">{errorMessage}</FormMessage> : null}
          <button className="button button-primary" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Signing in..." : "Login"}
          </button>
          {env.VITE_ENABLE_GOOGLE_OAUTH ? (
            <a className="button button-secondary" href={`${env.VITE_API_BASE_URL}/api/v1/auth/google`}>
              Continue with Google
            </a>
          ) : null}
        </form>
      </div>
    </section>
  );
}
