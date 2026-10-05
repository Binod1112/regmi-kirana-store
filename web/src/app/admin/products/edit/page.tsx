"use client";

import { useSearchParams } from "next/navigation";
import EditProductForm from "../[id]/edit-product-form";

export default function EditProductRoute() {
  const searchParams = useSearchParams();
  return <EditProductForm productId={searchParams.get("id") || ""} />;
}
