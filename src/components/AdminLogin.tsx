// SECURITY: admin auth is a hardcoded password check that runs in the
// browser. This is a known gap — the anon Supabase key + permissive RLS
// policies mean any client can read/delete submissions regardless of this
// check. Migrate to Supabase Auth and tighten RLS before exposing publicly.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('podFinder_isAdmin', 'true');
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the admin password to view submissions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">Incorrect password.</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <a href="/" className="inline-block mt-4 text-sm text-primary hover:underline">
            &larr; Back to Survey
          </a>
        </div>
      </motion.div>
    </div>
  );
}
