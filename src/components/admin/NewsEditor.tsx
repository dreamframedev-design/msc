"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string[];
    imageUrl: string;
  };
  isEditing?: boolean;
}

export function NewsEditor({ initialData, isEditing = false }: NewsEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content?.join("\n\n") || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "/images/news hero.avif");
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-bold">
            {isEditing ? "Edit Article" : "Create New Article"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#F0564A] hover:bg-[#D94D42]">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Article"}
        </Button>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article title"
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="font-mono text-sm text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary for the news listing page..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/..."
                />
                <Button variant="outline" type="button">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown or plain text with double newlines for paragraphs)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article here..."
                className="min-h-[400px] font-sans text-base leading-relaxed"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Tip: Leave a blank line between paragraphs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
