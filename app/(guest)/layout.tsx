import {auth} from "@/auth";
import Navbar from "@/components/Navbar";
import {redirect} from "next/navigation";
import React, {ReactNode} from "react";

interface Props {
  children: ReactNode;
}
async function GuestLayout({children}: Props) {
  const session = await auth();

  if (session) return redirect("/");

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default GuestLayout;
