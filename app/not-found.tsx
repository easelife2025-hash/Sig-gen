import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-4">404 - Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">The page you were looking for could not be found. It might have been removed or the URL may be incorrect.</p>
      <div className="flex gap-4">
        <Button render={<Link href="/" />} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Return Home
        </Button>
      </div>
    </div>
  );
}
