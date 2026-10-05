"use client";

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "../../lib/firebase";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch { setError("The email or password is incorrect."); }
  }

  if (!ready) return <main className="admin-page"><p className="admin-empty">Loading admin panel...</p></main>;
  if (!user) return <main className="admin-page"><section className="admin-login"><p className="eyebrow">REGMI KIRANA STORE</p><h1>Admin sign in</h1><p>Sign in to manage products, categories, and store details.</p><form className="stack-form" onSubmit={submit}><div className="setting-field"><span>Email</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="setting-field"><span>Password</span><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>{error && <p className="error-status" role="alert">{error}</p>}<button className="button button-primary" type="submit">Sign in</button></form></section></main>;
  return <>{children}<button className="admin-sign-out button button-secondary" type="button" onClick={() => signOut(auth)}>Sign out</button></>;
}
