"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertCircle, ExternalLink, Paperclip, MessageSquare, PlusCircle, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { articles } from "../news/data";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image 
                src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
                alt="MSC" 
                width={32} 
                height={32} 
              />
            </Link>
            <span className="text-muted-foreground font-medium">|</span>
            <span className="font-heading font-semibold text-primary">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: CEO</span>
            <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>Back to Site</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tickets" className="w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage client requests and website content.</p>
            </div>
            <TabsList>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Client Tickets
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                News Articles
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tickets">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ticket Management</h2>
              <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="agilex">Agilex Biolabs</SelectItem>
                <SelectItem value="actym">Actym Therapeutics</SelectItem>
                <SelectItem value="resolve">Resolve Therapeutics</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="active">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active (Pending/In Progress)</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">High Priority</Badge>
                      <span className="text-sm text-muted-foreground">#REQ-043 • May 9, 2026</span>
                    </div>
                    <h3 className="text-xl font-bold">Fix broken link in footer</h3>
                    <p className="text-sm text-muted-foreground mt-1">Client: Agilex Biolabs</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Pending Review
                  </Badge>
                </div>
                <p className="text-sm mt-4 p-4 bg-muted rounded-md">
                &quot;The link to our privacy policy in the footer is currently returning a 404 error. We need this fixed ASAP for compliance reasons. The correct URL should be /legal/privacy-policy.&quot;
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ExternalLink className="w-4 h-4 mr-2" /> View Page
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageSquare className="w-4 h-4 mr-2" /> Reply to Client
                  </Button>
                  <div className="flex-1" />
                  <Select defaultValue="pending">
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Normal Priority</Badge>
                      <span className="text-sm text-muted-foreground">#REQ-042 • May 8, 2026</span>
                    </div>
                    <h3 className="text-xl font-bold">Add new press release to News section</h3>
                    <p className="text-sm text-muted-foreground mt-1">Client: Agilex Biolabs</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> In Progress
                  </Badge>
                </div>
                <p className="text-sm mt-4 p-4 bg-muted rounded-md">
                &quot;Please add the attached press release regarding our new clinical trial phase. I&apos;ve included the Word document with the text and a high-res image to use as the thumbnail.&quot;
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" /> press_release_v2.docx
                  </Button>
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" /> trial_header.jpg
                  </Button>
                  <div className="flex-1" />
                  <Select defaultValue="progress">
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Pending Review</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">In Progress</span>
                  <Badge className="bg-blue-500">1</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Completed (30d)</span>
                  <Badge className="bg-green-500">12</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create Ticket for Client
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Global Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">News & Insights</h2>
              <Link href="/admin/news/create" className={buttonVariants({ variant: "default" })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Article
              </Link>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Read Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.date}</TableCell>
                        <TableCell>{article.readTime}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/news/edit/${article.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            Edit
                          </Link>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
