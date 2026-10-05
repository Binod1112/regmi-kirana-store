"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { deleteCategory, getCategories, saveCategory, uploadProductImage, type Category } from "../../../lib/store-data";
import { sitePath } from "../../../lib/site-path";
import "../../admin/admin.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", sortOrder: "", imageUrl: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { getCategories().then(setCategories); }, []);
  const visible = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  function openAddForm() { setError(""); setForm({ name: "", sortOrder: String(categories.length + 1), imageUrl: "" }); setShowAddForm(true); }
  function closeAddForm() { setShowAddForm(false); setForm({ name: "", sortOrder: "", imageUrl: "" }); }
  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setBusy(true);
    setError("");
    try { const imageUrl = await uploadProductImage(file); setForm((current) => ({ ...current, imageUrl })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `category-${Date.now()}`;
    if (categories.some((category) => category.id === id || category.name.toLowerCase() === name.toLowerCase())) { setError("A category with this name already exists."); return; }
    try {
      await saveCategory({ id, name, sortOrder: Number(form.sortOrder) || categories.length + 1, imageUrl: form.imageUrl });
      setCategories(await getCategories());
      closeAddForm();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }
  async function remove(category: Category) {
    if (!window.confirm(`Delete ${category.name} and all products in it? This cannot be undone.`)) return;
    try { await deleteCategory(category); setCategories(await getCategories()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }
  return <main className="admin-page"><header className="admin-topbar"><a className="brand" href={sitePath("/admin")}><strong>Regmi Kirana Store</strong><small>Admin panel</small></a><a className="admin-link" href={sitePath("/admin")}>Back to admin</a></header><section className="admin-subpage"><div className="admin-subpage-heading"><p className="eyebrow">CATALOG</p><h1>Categories</h1><p>Search and manage every category in the store.</p></div><div className="admin-page-actions"><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for categories" aria-label="Search for categories" /></label><button className="button button-primary" type="button" onClick={openAddForm}>Add new category</button></div>{error && <p className="error-status" role="alert">{error}</p>}{showAddForm && <form className="add-form admin-inline-editor" onSubmit={submit}><div className="panel-heading"><div><p className="eyebrow">ADD CATEGORY</p><h2>New category</h2></div><button className="text-button" type="button" onClick={closeAddForm}>Cancel</button></div><div className="product-photo-editor">{form.imageUrl ? <img src={form.imageUrl} alt="Category preview" /> : <span>No photo selected</span>}<label className="photo-picker">{busy ? "Uploading..." : "Choose photo"}<input type="file" accept="image/*" onChange={selectImage} disabled={busy} /></label></div><label className="category-name-field"><span>Category name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Category name" /></label><label className="category-name-field"><span>Display position</span><input required type="number" min="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} placeholder="Display position" /></label><button className="button button-primary" type="submit" disabled={busy}>Add category</button></form>}<div className="admin-item-grid">{visible.map((category) => <article className="admin-item-card" key={category.id}><span className="admin-item-image">{category.imageUrl ? <img src={category.imageUrl} alt="" /> : category.name.charAt(0)}</span><strong>{category.name}</strong><small>Position {category.sortOrder} · Edit name or picture</small><div className="admin-card-actions"><a className="button button-primary"   href={sitePath(`/admin/categories/${category.id}`)}>Edit</a><button className="button button-secondary" type="button" onClick={() => remove(category)}>Delete</button></div></article>)}</div></section></main>;
}
