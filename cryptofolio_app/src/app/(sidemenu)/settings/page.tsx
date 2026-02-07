"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="bg-card backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-secondary/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email is managed via Supabase Auth
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>User ID</Label>
                 <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={user?.id || ""} 
                    disabled 
                    className="bg-secondary/50 font-mono text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-card backdrop-blur-xl border-border border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Actions that affect your account session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
