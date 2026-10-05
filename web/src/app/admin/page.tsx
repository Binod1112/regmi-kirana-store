"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import "./admin.css";
import "./admin-overrides.css";
import "./settings-form.css";
import "./admin-mobile.css";
import "./product-photo.css";
import { defaultProducts, defaultSettings, getProducts, getStoreSettings, saveStoreSettings, type Product, type StoreSettings } from "../../lib/store-data";
import { sitePath } from "../../lib/site-path";
import { assetPath } from "../../lib/site-path";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getStoreSettings()])
      .then(([nextProducts, nextSettings]) => { setProducts(nextProducts); setSettings(nextSettings); })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { await saveStoreSettings(settings); setNotice("Store settings saved."); } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }

  return <main className="admin-page">
    <header className="admin-topbar"><a className="brand" href={sitePath("/")}><Image src={assetPath("/Store logo.png")} alt="Regmi Kirana Store logo" width={44} height={44} priority /><span><strong>Regmi Kirana Store</strong><small>Store desk</small></span></a><a className="admin-link" href={sitePath("/")}>View store ↗</a></header>
    <div className="admin-layout">
      <aside className="admin-panel settings-panel"><div className="panel-heading"><div><p className="eyebrow">STORE SETTINGS</p><h2>Public details</h2></div></div><form className="stack-form" onSubmit={submitSettings}><div className="setting-field"><span>Phone number</span><input required value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} /></div><div className="setting-field"><span>WhatsApp number</span><input required value={settings.whatsapp} onChange={(event) => setSettings({ ...settings, whatsapp: event.target.value })} /></div><div className="setting-field"><span>Address</span><textarea required rows={2} value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} /></div><div className="setting-field"><span>Opening hours</span><input required value={settings.hours} onChange={(event) => setSettings({ ...settings, hours: event.target.value })} /></div><div className="setting-field"><span>Homepage punchline</span><input required value={settings.tagline} onChange={(event) => setSettings({ ...settings, tagline: event.target.value })} /></div><button className="button button-primary" type="submit">Save public details</button><p className="form-status" role="status">{notice || error}</p></form></aside>
      <section className="admin-panel admin-catalog-panel"><div className="admin-section-links"><a className="admin-section-button" href={sitePath("/admin/products")}><strong>Products</strong><span>{products.length} items · Manage products</span></a><a className="admin-section-button" href={sitePath("/admin/categories")}><strong>Categories</strong><span>Manage categories</span></a></div></section>
    </div>
  </main>;
}
