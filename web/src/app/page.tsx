"use client";

import { useEffect, useState } from "react";
import { defaultSettings, getStoreSettings } from "../lib/store-data";
import { sitePath } from "../lib/site-path";

export default function Home() {
  const [settings, setSettings] = useState(defaultSettings);
  useEffect(() => { getStoreSettings().then(setSettings).catch(() => undefined); }, []);
  return <main className="welcome-page"><div className="welcome-overlay" /><section className="welcome-content" aria-labelledby="welcome-title"><img className="welcome-logo" src={sitePath("/Store logo.png")} alt="Regmi Kirana Store logo" /><p className="welcome-store-name">Regmi Kirana Store</p><p className="welcome-kicker">YOUR NEIGHBORHOOD GROCERY STORE</p><h1 id="welcome-title">{settings.tagline}</h1><p className="welcome-description">Fresh everyday essentials for the people of Bhorletar.</p><div className="welcome-actions"><a className="button welcome-primary" href={sitePath("/store")}>Start Shopping</a><a className="button welcome-secondary" href={settings.mapUrl}>Get Direction<span className="location-pin" aria-hidden="true" /></a></div></section></main>;
}
