"use client";

import { storeCopy } from "../components/store-copy";
import { StoreBottomNav, StoreHeader } from "../components/store-navigation";
import { defaultSettings, getStoreSettings, type StoreSettings } from "../../lib/store-data";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  useEffect(() => { getStoreSettings().then(setSettings).catch(() => undefined); }, []);
  const phone = settings.phone.replace(/\s/g, "");
  const whatsapp = settings.whatsapp.replace(/\D/g, "");
  return <main className="store-shell"><StoreHeader /><section className="standalone-section contact-section" id="contact"><div><p className="eyebrow">{storeCopy.contactEyebrow}</p><h1>{storeCopy.contactTitle}</h1><p className="section-muted">{storeCopy.contactIntro}</p></div><div className="contact-actions"><a className="contact-action" href={`tel:${phone}`}><span>☎</span><strong>{storeCopy.call} {settings.phone}</strong><small>Talk to the store directly</small></a><a className="contact-action" href={`https://wa.me/977${whatsapp}`} target="_blank" rel="noreferrer"><span className="whatsapp-logo" aria-hidden="true">☎</span><strong>{storeCopy.whatsapp}</strong><small>Send a message about your items</small></a></div></section><StoreBottomNav active="contact" /></main>;
}
