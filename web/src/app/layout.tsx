import type { Metadata } from "next";
import "./globals.css";
import "./sections.css";
import "./sticky-header.css";
import "./routes.css";
import "./product-media.css";

export const metadata: Metadata = {
  title: "Regmi Kirana Store | Everyday groceries",
  description: "Browse everyday groceries from Regmi Kirana Store in Bhorletar, Lamjung.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
