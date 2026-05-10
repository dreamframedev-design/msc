import { NewsEditor } from "@/components/admin/NewsEditor";

export default function CreateNewsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4">
        <NewsEditor />
      </div>
    </div>
  );
}
