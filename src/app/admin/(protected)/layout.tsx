import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8">{children}</main>
      <Toaster />
    </div>
  );
}
