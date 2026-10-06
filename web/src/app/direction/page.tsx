"use client";

import { useEffect, useState } from "react";
import { storeCopy } from "../components/store-copy";
import { defaultSettings, getStoreSettings, type StoreSettings } from "../../lib/store-data";
import { StoreBottomNav, StoreHeader } from "../components/store-navigation";

export default function DirectionPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  useEffect(() => {
    const loadMapUrl = () => { getStoreSettings().then(setSettings).catch(() => setSettings(defaultSettings)); };
    loadMapUrl();
    window.addEventListener("storage", loadMapUrl);
    window.addEventListener("store-settings-updated", loadMapUrl);
    return () => { window.removeEventListener("storage", loadMapUrl); window.removeEventListener("store-settings-updated", loadMapUrl); };
  }, []);
  return <main className="store-shell"><StoreHeader /><section className="standalone-section direction-section" id="direction"><div><p className="eyebrow">{storeCopy.directionEyebrow}</p><h1>{storeCopy.directionTitle}</h1><p className="section-muted">{settings.address}<br />{settings.hours} · Every day</p><a className="button button-primary" href={settings.mapUrl}>{storeCopy.directions} ↗</a></div><div className="map-card"><span>Regmi Kirana Store</span><small>{settings.address}</small></div></section><StoreBottomNav active="direction" /></main>;
}
