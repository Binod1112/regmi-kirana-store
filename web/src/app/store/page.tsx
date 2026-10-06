import { CatalogView } from "../components/catalog-view";
import { StoreBottomNav, StoreHeader } from "../components/store-navigation";

export default function StorePage() {
  return <main className="store-shell"><StoreHeader /><section className="home-catalog store-catalog"><CatalogView compact showCategories={false} /></section><StoreBottomNav active="home" /><footer><span>© Regmi Kirana Store</span><span>Made for Bhorletar</span></footer></main>;
}
