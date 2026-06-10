"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">
          Your Profile
        </h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
           <Card className="border-slate-200 shadow-sm text-center py-8">
             <CardContent>
                <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-4 text-3xl font-bold uppercase">
                  {user?.displayName ? user.displayName.charAt(0) : user?.email?.charAt(0) || "U"}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 truncate px-2">
                  {user?.displayName || "My Account"}
                </h3>
                <p className="text-sm text-slate-500 truncate px-2 mb-6">
                  {user?.email}
                </p>
                <Button variant="outline" className="w-full">
                   Edit Profile
                </Button>
             </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
           <Card className="border-slate-200 shadow-sm">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  Personal Information
               </CardTitle>
               <CardDescription>Update your personal details here.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div>
                   <label className="text-sm font-medium text-slate-500">Full Name</label>
                   <p className="text-slate-900 mt-1">{user?.displayName || "Not set"}</p>
                </div>
                <div>
                   <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                     Email Address
                     {user?.emailVerified && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                     )}
                   </label>
                   <p className="text-slate-900 mt-1">{user?.email}</p>
                </div>
             </CardContent>
           </Card>

           <Card className="border-slate-200 shadow-sm">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Shield className="w-5 h-5 text-indigo-500" />
                 Account Security
               </CardTitle>
               <CardDescription>Manage your security preferences.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between border-b pb-4">
                 <div>
                   <h4 className="font-medium text-slate-900">Password</h4>
                   <p className="text-sm text-slate-500">Last changed recently</p>
                 </div>
                 <Button variant="outline" size="sm">Change</Button>
               </div>
               <div className="flex items-center justify-between pt-2 text-rose-600">
                 <div>
                   <h4 className="font-medium">Delete Account</h4>
                   <p className="text-sm text-rose-500/80">Permanently delete your data</p>
                 </div>
                 <Button variant="ghost" size="sm" className="hover:bg-rose-50 text-rose-600">Delete</Button>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
