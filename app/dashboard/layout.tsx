"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PenTool, Settings, LogOut, FileText, User } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Handwritten Sigs", icon: PenTool },
    { href: "/dashboard/email", label: "Email Signatures", icon: FileText },
    { href: "/dashboard/learn", label: "Learn to Sign", icon: PenTool },
    { href: "/dashboard/collection", label: "My Collection", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white leading-none">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SigGen</span>
            </Link>
          </div>
          
          <div className="px-6 py-4 border-b border-slate-100">
             <div className="text-sm font-medium text-slate-900 truncate">
               {user?.displayName || "My Account"}
             </div>
             <div className="text-xs text-slate-500 truncate">
               {user?.email}
             </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="h-16 bg-white border-b border-slate-200 md:hidden flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white leading-none">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SigGen</span>
            </Link>
            <button onClick={handleSignOut} className="p-2 text-slate-500 hover:text-slate-900 rounded-md">
              <LogOut className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
