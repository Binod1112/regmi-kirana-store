import EditCategoryForm from "./edit-category-form";

export function generateStaticParams() {
  return [{ id: "rice" }, { id: "sugar" }, { id: "dal" }, { id: "masala" }, { id: "flour" }, { id: "oil" }, { id: "fruits" }, { id: "vegetables" }, { id: "others" }];
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  return <EditCategoryForm params={params} />;
}
