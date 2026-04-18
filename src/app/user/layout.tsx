import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast"


export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/auth/login")
  }
  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}