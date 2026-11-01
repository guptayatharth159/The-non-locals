export const runtime = "edge";

import React from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Operations Portal | THE NON LOCALS",
  description: "Private operations portal for managing expeditions, departure dates, and website settings.",
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}

