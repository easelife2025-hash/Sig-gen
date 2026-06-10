"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";

import { sendPasswordResetEmail, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsSent(true);
      toast.success("Password reset email sent!");
    } catch (error) {
       if (error instanceof FirebaseError) {
          toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-white text-xl leading-none">S</span>
          </div>
          <span className="font-bold text-3xl tracking-tight text-slate-900">SigGen</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                 <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Check your inbox</h3>
              <p className="text-slate-500 text-sm">
                We&apos;ve sent a password reset link to your email address.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Return to sign in
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-10"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send reset link"}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
