"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { storeCopy } from "./store-copy";
import { getCategories, getProducts, productCategories, type Category, type Product } from "../../lib/store-data";

export function CatalogView({ categoriesOnly = false, compact = false, showCategories = true, searchPlaceholder }: { categoriesOnly?: boolean; compact?: boolean; showCategories?: boolean; searchPlaceholder?: string }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryRecords, setCategoryRecords] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchPinned, setSearchPinned] = useState(false);
  const [searchHeight, setSearchHeight] = useState(0);
  const searchToolsRef = useRef<HTMLDivElement>(null);
  const searchPinnedRef = useRef(false);
  const searchFocusedRef = useRef(false);
  const configuredCategories = categoryRecords.length ? categoryRecords.map((item) => item.name) : productCategories;
  const categories = ["All", ...new Set([...configuredCategories, ...products.map((product) => product.category)])];
  const filteredProducts = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [category, products, search]);
  const visibleCategories = categories.filter((item) => item === "All" || item.toLowerCase().includes(search.toLowerCase()) || products.some((product) => product.category === item && product.name.toLowerCase().includes(search.toLowerCase())));
  const showProducts = !categoriesOnly || category !== "All" || search.trim().length > 0;

  useEffect(() => {
    const loadCatalog = () => { Promise.all([getProducts(), getCategories()]).then(([nextProducts, nextCategories]) => { setProducts([...nextProducts].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))); setCategoryRecords([...nextCategories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))); }).finally(() => setLoaded(true)); };
    loadCatalog();
    window.addEventListener("storage", loadCatalog);
    window.addEventListener("catalog-updated", loadCatalog);
    return () => { window.removeEventListener("storage", loadCatalog); window.removeEventListener("catalog-updated", loadCatalog); };
  }, []);

  useEffect(() => {
    const updateSearchPosition = () => {
      const tools = searchToolsRef.current;
      if (!tools) return;
      const originalTop = Number(tools.dataset.originalTop || 0);
      const nextPinned = searchFocusedRef.current || window.scrollY >= originalTop;
      searchPinnedRef.current = nextPinned;
      setSearchPinned((current) => current === nextPinned ? current : nextPinned);
      if (!nextPinned) setSearchHeight(tools.offsetHeight);
    };
    const measure = () => {
      const tools = searchToolsRef.current;
      if (!tools) return;
      setSearchHeight(tools.offsetHeight);
      if (searchPinnedRef.current) return;
      tools.dataset.originalTop = String(tools.getBoundingClientRect().top + window.scrollY);
      updateSearchPosition();
    };
    const pinSearchForTyping = () => {
      const tools = searchToolsRef.current;
      if (!tools) return;
      searchFocusedRef.current = true;
      if (searchPinnedRef.current) return;
      setSearchHeight(tools.offsetHeight);
      searchPinnedRef.current = true;
      setSearchPinned(true);
    };
    const releaseSearchPin = () => {
      searchFocusedRef.current = false;
      updateSearchPosition();
    };
    measure();
    window.addEventListener("scroll", updateSearchPosition, { passive: true });
    window.addEventListener("resize", measure);
    searchToolsRef.current?.querySelector("input")?.addEventListener("focus", pinSearchForTyping);
    searchToolsRef.current?.querySelector("input")?.addEventListener("blur", releaseSearchPin);
    return () => { window.removeEventListener("scroll", updateSearchPosition); window.removeEventListener("resize", measure); searchToolsRef.current?.querySelector("input")?.removeEventListener("focus", pinSearchForTyping); searchToolsRef.current?.querySelector("input")?.removeEventListener("blur", releaseSearchPin); };
  }, []);

  const placeholder = searchPlaceholder ?? (categoriesOnly ? storeCopy.searchCategories : storeCopy.searchProducts);
  return <section className={`catalog-page-section ${compact ? "catalog-compact" : ""} ${categoriesOnly ? "categories-catalog" : ""}`}><div className="catalog-page-heading">{!compact && !categoriesOnly && <><div><p className="eyebrow">{storeCopy.shelf}</p><h1>{storeCopy.shop}</h1></div><span className="product-count">{filteredProducts.length} items</span></>}</div><div className={`catalog-page-tools-wrap ${searchPinned ? "is-pinned" : ""}`} style={searchPinned ? { height: searchHeight } : undefined}><div className={`catalog-page-tools ${searchPinned ? "is-fixed" : ""}`} ref={searchToolsRef}><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>{showCategories && !categoriesOnly && <div className="category-list" role="tablist" aria-label="Product categories">{categories.map((item) => <button className={`category-button ${category === item ? "active" : ""}`} key={item} type="button" onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item}</button>)}</div>}</div></div>{categoriesOnly && <h1 className="categories-title">Categories</h1>}{categoriesOnly && <div className="category-cards">{visibleCategories.filter((item) => item !== "All").map((item) => { const record = categoryRecords.find((categoryItem) => categoryItem.name === item); return <button className={`category-card ${category === item ? "selected" : ""}`} key={item} type="button" onClick={() => setCategory(item)}><span className="category-card-image">{record?.imageUrl ? <img src={record.imageUrl} alt="" /> : <span>{item.charAt(0)}</span>}</span><strong>{item}</strong></button>; })}</div>}{showProducts && <div className="product-grid">{loaded && filteredProducts.map((product) => { const stockStatus = product.stockStatus ?? (product.available ? "in-stock" : "out-of-stock"); return <article className={`product-card ${stockStatus}`} key={product.id}><div className="product-image">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span className="product-placeholder">{product.name.charAt(0)}</span>}</div><p className="category">{product.category}</p><h3>{product.name}</h3><div className="product-meta"><small>{product.unit}</small><strong>NPR {product.price.toLocaleString("en-NP")}</strong></div></article>; })}</div>}</section>;
}