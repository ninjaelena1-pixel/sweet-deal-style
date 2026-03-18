import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) navigate('/', { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else setMessage('Проверьте email для подтверждения регистрации');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setMessage('Ссылка для сброса пароля отправлена на email');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
            R
          </div>
          <div>
            <div className="text-lg font-bold tracking-widest uppercase text-primary">Renewal CRM</div>
            <div className="text-[11px] text-muted-foreground tracking-wide uppercase">v6.0 · Авторизация</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h1 className="text-xl font-bold text-foreground mb-1">
            {showForgot ? 'Сброс пароля' : isLogin ? 'Вход в систему' : 'Регистрация'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {showForgot
              ? 'Введите email для получения ссылки сброса'
              : isLogin
              ? 'Введите данные для входа в CRM'
              : 'Создайте аккаунт для работы с CRM'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              {message}
            </div>
          )}

          {showForgot ? (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-10 bg-input border border-border rounded-md text-foreground text-sm px-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  placeholder="admin@company.ru"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-md bg-gradient-to-r from-primary/90 to-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Отправка...' : 'Отправить ссылку'}
              </button>
              <button type="button" onClick={() => setShowForgot(false)} className="text-sm text-primary hover:underline">
                ← Назад к входу
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-10 bg-input border border-border rounded-md text-foreground text-sm px-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  placeholder="admin@company.ru"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-10 bg-input border border-border rounded-md text-foreground text-sm px-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  placeholder="••••••••"
                />
              </div>

              {isLogin && (
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-primary hover:underline self-end -mt-2">
                  Забыли пароль?
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-md bg-gradient-to-r from-primary/90 to-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>

              <p className="text-sm text-muted-foreground text-center">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-primary hover:underline font-medium">
                  {isLogin ? 'Регистрация' : 'Войти'}
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-6 text-[11px] text-muted-foreground uppercase tracking-wide">
          © 2026 ПФК Обновление
        </div>
      </div>
    </div>
  );
}
