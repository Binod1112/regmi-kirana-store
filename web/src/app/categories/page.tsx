import { CatalogView } from "../components/catalog-view";
import { StoreBottomNav, StoreHeader } from "../components/store-navigation";

export default function CategoriesPage() {
  return <main><StoreHeader /><div className="categories-page"><CatalogView categoriesOnly /></div><StoreBottomNav active="categories" /></main>;
}
