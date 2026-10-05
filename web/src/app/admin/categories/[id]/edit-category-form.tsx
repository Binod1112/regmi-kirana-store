"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getCategories, saveCategory, uploadProductImage, type Category } from "../../../../lib/store-data";
import "../../../admin/admin.css";
import "../../../admin/product-photo.css";

export default function EditCategoryForm({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", sortOrder: "", imageUrl: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { params.then(({ id }) => getCategories().then((categories) => { const current = categories.find((item) => item.id === id); if (current) { setCategory(current); setForm({ name: current.name, sortOrder: String(current.sortOrder ?? 1), imageUrl: current.imageUrl }); } })); }, [params]);
  async function selectImage(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; setBusy(true); try { const imageUrl = await uploadProductImage(file); setForm((current) => ({ ...current, imageUrl })); } finally { setBusy(false); } }
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!category) return; await saveCategory({ ...category, name: form.name.trim(), sortOrder: Number(form.sortOrder) || 1, imageUrl: form.imageUrl }); window.location.href = "/admin/categories"; }
  if (!category) return <main className="admin-page"><p className="admin-empty">Category not found.</p></main>;
  return <main className="admin-page"><header className="admin-topbar"><a className="brand" href="/admin/categories"><strong>Regmi Kirana Store</strong><small>Edit category</small></a><a className="admin-link" href="/admin/categories">Back to categories</a></header><section className="admin-subpage admin-edit-page"><p className="eyebrow">EDIT CATEGORY</p><h1>{category.name}</h1><form className="add-form" onSubmit={submit}><div className="product-photo-editor">{form.imageUrl ? <img src={form.imageUrl} alt="Category preview" /> : <span>No photo selected</span>}<label className="photo-picker">{busy ? "Uploading..." : "Choose photo"}<input type="file" accept="image/*" onChange={selectImage} disabled={busy} /></label></div><label className="category-name-field"><span>Category name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="category-name-field"><span>Display position</span><input required type="number" min="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} /></label><button className="button button-primary" type="submit" disabled={busy}>Save changes</button></form></section></main>;
}
