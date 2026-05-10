import { notFound } from "next/navigation";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { articles } from "@/app/news/data";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = articles.find((a) => a.id === resolvedParams.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4">
        <NewsEditor initialData={article} isEditing />
      </div>
    </div>
  );
}
