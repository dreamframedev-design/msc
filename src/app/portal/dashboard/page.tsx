"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image 
                src="/images/MSC_Logo with blk tagline (1).svg" 
                alt="MSC" 
                width={120} 
                height={40} 
                className="dark:invert"
              />
            </Link>
            <span className="text-muted-foreground font-medium">|</span>
            <span className="font-heading font-semibold">Client Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, Agilex Biolabs</span>
            <Link href="/portal" className={buttonVariants({ variant: "outline", size: "sm" })}>Sign Out</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your website updates and requests.</p>
          </div>
        </div>

        <Tabs defaultValue="new-request" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="new-request">New Request</TabsTrigger>
            <TabsTrigger value="active-requests">Active Requests (2)</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="new-request">
            <Card>
              <CardHeader>
                <CardTitle>Submit a New Request</CardTitle>
                <CardDescription>
                  Provide as much detail as possible so our team can complete your request efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6 max-w-3xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="task-type">Task Type</Label>
                      <Select>
                        <SelectTrigger id="task-type">
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="content">Content Update (Text/Images)</SelectItem>
                          <SelectItem value="page">New Page Creation</SelectItem>
                          <SelectItem value="design">Design Adjustment</SelectItem>
                          <SelectItem value="bug">Bug Fix / Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Whenever possible)</SelectItem>
                          <SelectItem value="normal">Normal (Standard turnaround)</SelectItem>
                          <SelectItem value="high">High (ASAP)</SelectItem>
                          <SelectItem value="urgent">Urgent (Site is broken)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Request Title</Label>
                    <Input id="title" placeholder="e.g., Update team member bios on About page" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Target URL (if applicable)</Label>
                    <Input id="url" placeholder="https://yourwebsite.com/about" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Please describe exactly what needs to be changed. If replacing text, provide the old text and the new text." 
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments (Images, Docs, etc.)</Label>
                    <Input id="attachments" type="file" multiple className="cursor-pointer" />
                    <p className="text-xs text-muted-foreground">Upload any new images or documents needed for this update.</p>
                  </div>

                  <Button type="button" className="w-full md:w-auto">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active-requests">
            <Card>
              <CardHeader>
                <CardTitle>Active Requests</CardTitle>
                <CardDescription>Track the status of your ongoing website updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-042</TableCell>
                      <TableCell>Add new press release to News section</TableCell>
                      <TableCell>May 8, 2026</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex w-fit items-center gap-1">
                          <Clock className="w-3 h-3" /> In Progress
                        </Badge>
                      </TableCell>
                      <TableCell>Normal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-043</TableCell>
                      <TableCell>Fix broken link in footer</TableCell>
                      <TableCell>May 9, 2026</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Pending Review
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Completed Requests</CardTitle>
                <CardDescription>View your past website updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-038</TableCell>
                      <TableCell>Update hero image on homepage</TableCell>
                      <TableCell>Apr 24, 2026</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex w-fit items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-035</TableCell>
                      <TableCell>Add new team member bio</TableCell>
                      <TableCell>Apr 12, 2026</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex w-fit items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
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
