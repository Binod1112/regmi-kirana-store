import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type Product = { id: number; name: string; category: string; unit: string; price: number; available: boolean; stockStatus?: StockStatus; imageUrl?: string; sortOrder?: number };
export type Category = { id: string; name: string; imageUrl: string; sortOrder?: number };
export type StoreSettings = { phone: string; whatsapp: string; address: string; hours: string; mapUrl: string; tagline: string };
export const productCategories = ["Rice", "Sugar", "Dal", "Masala", "Flour", "Oil", "Fruits", "Vegetables", "Others"];
export const defaultCategories: Category[] = [
  { id: "rice", name: "Rice", imageUrl: "/categories/Rice.jpg" },
  { id: "sugar", name: "Sugar", imageUrl: "/categories/Sugar.jpg" },
  { id: "dal", name: "Dal", imageUrl: "/categories/Daal.jpg" },
  { id: "masala", name: "Masala", imageUrl: "/categories/Masala-Spices.jpg" },
  { id: "flour", name: "Flour", imageUrl: "/categories/Flour.jpg" },
  { id: "oil", name: "Oil", imageUrl: "/categories/Oil.jpg" },
  { id: "fruits", name: "Fruits", imageUrl: "/categories/Fruits.jpg" },
  { id: "vegetables", name: "Vegetables", imageUrl: "/categories/Vegetables.jpg" },
  { id: "others", name: "Others", imageUrl: "" },
];

export const defaultProducts: Product[] = [
  { id: 1, name: "Premium Rice", category: "Rice", unit: "5 kg", price: 525, available: true, imageUrl: "" },
  { id: 2, name: "Fine Sugar", category: "Sugar", unit: "1 kg", price: 108, available: true },
  { id: 3, name: "Masoor Dal", category: "Dal", unit: "1 kg", price: 185, available: true },
  { id: 4, name: "Kitchen Masala", category: "Masala", unit: "100 g", price: 65, available: true },
  { id: 5, name: "Besan", category: "Flour", unit: "1 kg", price: 145, available: true },
  { id: 6, name: "Sunflower Oil", category: "Oil", unit: "1 litre", price: 215, available: false, stockStatus: "out-of-stock" },
];

export const defaultSettings: StoreSettings = { phone: "9846010948", whatsapp: "9846010948", address: "MadhyaNepal-6, Bhorletar Lamjung", hours: "6:00 AM - 8:00 PM", mapUrl: "https://www.google.com/maps/place/Regmi+Grocery+Store+(%E0%A4%B0%E0%A5%87%E0%A4%97%E0%A5%8D%E0%A4%AE%E0%A5%80+%E0%A4%95%E0%A4%BF%E0%A4%B0%E0%A4%BE%E0%A4%A8%E0%A4%BE+%E0%A4%AA%E0%A4%B8%E0%A4%B2)/@28.154956,84.2401666,46m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3995a0389d25966d:0x416c1ff848858d04!2sShree+Ishaneshwor+Higher+Secondary+School!8m2!3d28.1554512!4d84.2417554!16s%2Fg%2F11g8_8558p!3m5!1s0x3995a100579ad80d:0xf4a6759123baae72!8m2!3d28.1549179!4d84.2401895!16s%2Fg%2F11ygl1fpyb?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D", tagline: "गुणस्तरीय सामान आफ्नै घरछेउमा" };

function localProducts() {
  const saved = window.localStorage.getItem("regmi-kirana-catalog");
  const products = saved ? JSON.parse(saved) as Product[] : defaultProducts;
  return products.map((product, index) => ({ ...product, stockStatus: product.stockStatus ?? (product.available ? "in-stock" : "out-of-stock"), sortOrder: product.sortOrder ?? index + 1 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function localCategories() {
  const saved = window.localStorage.getItem("regmi-kirana-categories");
  const categories = saved ? JSON.parse(saved) as Category[] : defaultCategories;
  return categories.map((category, index) => ({ ...category, sortOrder: category.sortOrder ?? index + 1 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getCategories() {
  const snapshot = await getDocs(collection(db, "categories"));
  if (!snapshot.empty) return snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as Category)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return localCategories();
}

export async function saveCategory(category: Category) {
  const categories = await getCategories();
  const remaining = categories.filter((item) => item.id !== category.id);
  const requestedPosition = Math.max(1, Math.min(Math.round(category.sortOrder || remaining.length + 1), remaining.length + 1));
  remaining.splice(requestedPosition - 1, 0, { ...category, sortOrder: requestedPosition });
  const next = remaining.map((item, index) => ({ ...item, sortOrder: index + 1 }));
  await Promise.all(next.map((item) => setDoc(doc(db, "categories", item.id), item)));
  return next.find((item) => item.id === category.id);
}

export async function deleteCategory(category: Category) {
  const products = (await getProducts()).filter((product) => product.category !== category.name);
  await Promise.all((await getProducts()).filter((product) => product.category === category.name).map((product) => deleteDoc(doc(db, "products", String(product.id)))));
  await Promise.all(products.map((product, index) => setDoc(doc(db, "products", String(product.id)), { ...product, sortOrder: index + 1 })));
  await deleteDoc(doc(db, "categories", category.id));
}

function localSettings(): StoreSettings {
  const saved = window.localStorage.getItem("regmi-kirana-settings");
  const mapUrl = window.localStorage.getItem("regmi-kirana-map-url");
  return saved ? { ...defaultSettings, ...JSON.parse(saved), mapUrl: mapUrl || JSON.parse(saved).mapUrl || defaultSettings.mapUrl } : { ...defaultSettings, mapUrl: mapUrl || defaultSettings.mapUrl };
}

export async function getProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  if (snapshot.empty) return localProducts();
  return snapshot.docs.map((item) => ({ ...item.data(), id: Number(item.id), imageUrl: item.data().imageUrl || "", stockStatus: item.data().stockStatus || (item.data().available ? "in-stock" : "out-of-stock") } as Product)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function saveProduct(product: Omit<Product, "id"> & { id?: number }) {
  const products = await getProducts();
  const stockStatus: StockStatus = product.stockStatus ?? (product.available ? "in-stock" : "out-of-stock");
  const productToSave: Product = { ...product, id: product.id ?? Date.now(), stockStatus, available: stockStatus !== "out-of-stock" };
  const remaining = products.filter((item) => item.id !== productToSave.id);
  const requestedPosition = Math.max(1, Math.min(Math.round(productToSave.sortOrder || remaining.length + 1), remaining.length + 1));
  remaining.splice(requestedPosition - 1, 0, productToSave);
  const orderedProducts = remaining.map((item, index) => ({ ...item, sortOrder: index + 1 }));
  await Promise.all(orderedProducts.map((item) => setDoc(doc(db, "products", String(item.id)), item)));
  return orderedProducts;
}

export async function uploadProductImage(file: File) {
  return await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}

export async function deleteProduct(id: number) {
  await deleteDoc(doc(db, "products", String(id)));
  const remaining = (await getProducts()).map((item, index) => ({ ...item, sortOrder: index + 1 }));
  await Promise.all(remaining.map((item) => setDoc(doc(db, "products", String(item.id)), item)));
}

export async function getStoreSettings() {
  const snapshot = await getDocs(collection(db, "storeSettings"));
  const data = snapshot.docs.find((item) => item.id === "main")?.data();
  return data ? { ...defaultSettings, ...data } as StoreSettings : localSettings();
}

export async function saveStoreSettings(settings: StoreSettings) {
  await setDoc(doc(db, "storeSettings", "main"), { ...settings, updatedAt: new Date().toISOString() });
}