import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(session){
        redirect("/user/dashboard")
    }
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}