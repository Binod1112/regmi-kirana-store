"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { deleteProduct, getCategories, getProducts, saveProduct, uploadProductImage, type Category, type Product, type StockStatus } from "../../../lib/store-data";
import { sitePath } from "../../../lib/site-path";
import "../../admin/admin.css";
import "../../admin/product-photo.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", unit: "", price: "", sortOrder: "", imageUrl: "", stockStatus: "in-stock" as StockStatus });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([nextProducts, nextCategories]) => { setProducts(nextProducts); setCategories(nextCategories); })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const visible = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search]);

  function openAddForm() {
    setError("");
    setForm({ name: "", category: categories[0]?.name || "", unit: "", price: "", sortOrder: String(products.length + 1), imageUrl: "", stockStatus: "in-stock" });
    setShowAddForm(true);
  }

  function closeAddForm() {
    setShowAddForm(false);
    setForm({ name: "", category: "", unit: "", price: "", sortOrder: "", imageUrl: "", stockStatus: "in-stock" });
  }

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setBusy(true);
    setError("");
    try {
      const imageUrl = await uploadProductImage(file);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await saveProduct({ name: form.name.trim(), category: form.category, unit: form.unit.trim(), price: Number(form.price), sortOrder: Number(form.sortOrder) || products.length + 1, available: form.stockStatus !== "out-of-stock", stockStatus: form.stockStatus, imageUrl: form.imageUrl });
      setProducts(await getProducts());
      closeAddForm();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      setProducts(await getProducts());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  return <main className="admin-page"><header className="admin-topbar"><a className="brand" href={sitePath("/admin")}><strong>Regmi Kirana Store</strong><small>Admin panel</small></a><a className="admin-link" href={sitePath("/admin")}>Back to admin</a></header><section className="admin-subpage"><div className="admin-subpage-heading"><p className="eyebrow">CATALOG</p><h1>Products</h1><p>Search and manage every product in the store.</p></div><div className="admin-page-actions"><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for products" aria-label="Search for products" /></label><button className="button button-primary" type="button" onClick={openAddForm}>Add new product</button></div>{error && <p className="error-status" role="alert">{error}</p>}{showAddForm && <form className="add-form admin-inline-editor" onSubmit={submit}><div className="panel-heading"><div><p className="eyebrow">ADD PRODUCT</p><h2>New product</h2></div><button className="text-button" type="button" onClick={closeAddForm}>Cancel</button></div><div className="product-photo-editor">{form.imageUrl ? <img src={form.imageUrl} alt="Product preview" /> : <span>No photo selected</span>}<label className="photo-picker">{busy ? "Uploading..." : "Choose photo"}<input type="file" accept="image/*" onChange={selectImage} disabled={busy} /></label></div><div className="form-grid"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name" aria-label="Product name" /><select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} aria-label="Category"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select><input required value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} placeholder="Unit, e.g. 1 kg" aria-label="Unit" /><input required type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price in NPR" aria-label="Price in NPR" /><input required type="number" min="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} placeholder="Display position" aria-label="Display position" /></div><label className="availability-field"><span>Availability</span><select value={form.stockStatus} onChange={(event) => setForm({ ...form, stockStatus: event.target.value as StockStatus })} aria-label="Availability"><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">Out of Stock</option></select></label><button className="button button-primary" type="submit" disabled={busy}>Add product</button></form>}<div className="admin-item-grid">{visible.map((product) => <article className="admin-item-card" key={product.id}><span className="admin-item-image">{product.imageUrl ? <img src={product.imageUrl} alt="" /> : product.name.charAt(0)}</span><strong>{product.name}</strong><small>Position {product.sortOrder} · {product.category} · {product.unit} · NPR {product.price.toLocaleString("en-NP")}</small><div className="admin-card-actions"><a className="button button-primary"   href={sitePath(`/admin/products/${product.id}`)}>Edit</a><button className="button button-secondary" type="button" onClick={() => remove(product)}>Delete</button></div></article>)}</div></section></main>;
}
