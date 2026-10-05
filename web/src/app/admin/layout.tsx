import type { Metadata } from "next";
import { AdminAuth } from "./admin-auth";

export const metadata: Metadata = {
  title: "Store Desk | Regmi Kirana Store",
  description: "Manage the Regmi Kirana Store catalog and public details.",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminAuth>{children}</AdminAuth>;
}