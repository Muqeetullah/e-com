import {auth} from "@/auth";
import {redirect} from "next/navigation";
import React, {ReactNode} from "react";
import AdminSidebar from "@/components/AdminNavbar";

interface Props {
  children: ReactNode;
}

async function AdminLayout({children}: Props) {
  const session = await auth();
  const user = session?.user;

  const isAdmin = user?.role === "admin";

  // Redirect if not authenticated or not an admin
  if (!session || !isAdmin) {
    redirect("/auth/signin");
    return null;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}

export default AdminLayout;
