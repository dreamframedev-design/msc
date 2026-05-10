import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default function PortalLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8">
        <Link href="/">
          <Image 
            src="/images/MSC_Logo with blk tagline (1).svg" 
            alt="Mighty Spark Communications" 
            width={200} 
            height={66} 
            className="dark:invert"
          />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-heading">Client Portal</CardTitle>
          <CardDescription>
            Sign in to manage your website updates and requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="client@company.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Link href="/portal/dashboard" className={buttonVariants({ className: "w-full" })}>Sign In</Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
