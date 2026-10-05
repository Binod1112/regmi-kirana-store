"use client";

import Image from "next/image";
import { storeCopy } from "./store-copy";
import { sitePath } from "../../lib/site-path";

export function StoreHeader() {
  return <header className="topbar"><a className="brand" href={sitePath("/store")} aria-label="Regmi Kirana Store home"><Image src="/Store logo.png" alt="Regmi Kirana Store logo" width={44} height={44} priority /><span><strong>Regmi Kirana Store</strong><small>MadhyaNepal-6, Lamjung</small></span></a><div className="top-actions"><a className="admin-link" href={sitePath("/admin")} target="_blank" rel="noreferrer">{storeCopy.admin}</a></div></header>;
}

export function StoreBottomNav({ active }: { active: "home" | "categories" | "contact" | "direction" }) {
  return <nav className="bottom-nav" aria-label="Store navigation"><a className={`bottom-nav-item ${active === "home" ? "active" : ""}`} href={sitePath("/store")}><span>⌂</span><small>{storeCopy.home}</small></a><a className={`bottom-nav-item ${active === "categories" ? "active" : ""}`} href={sitePath("/categories")}><span>▦</span><small>{storeCopy.categories}</small></a><a className={`bottom-nav-item ${active === "contact" ? "active" : ""}`} href={sitePath("/contact")}><span>☎</span><small>{storeCopy.contact}</small></a><a className={`bottom-nav-item ${active === "direction" ? "active" : ""}`} href={sitePath("/direction")}><span>⌖</span><small>{storeCopy.direction}</small></a></nav>;
}