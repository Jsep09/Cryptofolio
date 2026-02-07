"use client"; // ใช้ Client Component เพื่อรองรับการคลิกเปิด-ปิดในอนาคต

import React, { useState } from "react";
import { LayoutDashboard, Wallet, History, Settings, Menu, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils"; // ฟังก์ชันช่วยจัดการ Class ของ Shadcn
import { useAuth } from "@/components/auth-provider";

import { Background } from "@/app/components/ui/background";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // กำหนดเมนู Sidebar
  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    // { name: "Transactions", href: "/transactions", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen text-foreground overflow-hidden relative">
      <Background />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Desktop + Mobile) --- */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-6 md:block">
          <h2 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-lime bg-clip-text text-transparent">
            Cryptofolio
          </h2>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-lime flex items-center justify-center text-background font-bold text-xs shrink-0">
                    {user?.email?.[0].toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                <p className="text-xs font-medium truncate">{user?.email || "Guest"}</p>
                <p className="text-[10px] text-primary truncate">{user ? "Pro Member" : "Free Plan"}</p>
                </div>
            </div>
            {user && (
                 <button 
                 onClick={() => signOut()}
                 className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                 title="Sign Out"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            )}
           
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-xl">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            {/* ปุ่มเลือกค่าเงินหรือปุ่มแจ้งเตือนจะอยู่ตรงนี้ */}
            <div className="text-xs font-mono font-medium px-3 py-1.5 bg-secondary rounded-lg border border-border">
              USD/THB: <span className="text-primary">35.50</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

