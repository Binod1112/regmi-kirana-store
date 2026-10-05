"use client";

import { useSearchParams } from "next/navigation";
import EditCategoryForm from "../[id]/edit-category-form";

export default function EditCategoryRoute() {
  const searchParams = useSearchParams();
  return <EditCategoryForm categoryId={searchParams.get("id") || ""} />;
}
