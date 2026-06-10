"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmailSignatures() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">
          HTML Email Signatures
        </h1>
        <p className="text-slate-500">Design premium email signatures for your organization.</p>
      </div>

      <Card className="border-dashed border-2 border-slate-200 bg-slate-50 text-center py-20">
        <CardContent className="flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
             <Mail className="w-8 h-8 text-indigo-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-800 mb-2">Email Designer is moving</h3>
           <p className="text-slate-500 max-w-md mx-auto mb-6">
             We are upgrading the HTML Email Signature designer. In the meantime, you can explore the handwritten signature tools.
           </p>
           <Link href="/dashboard">
             <Button className="bg-indigo-600 hover:bg-indigo-700">
               Go to Handwritten Signatures <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
           </Link>
        </CardContent>
      </Card>
    </div>
  );
}
