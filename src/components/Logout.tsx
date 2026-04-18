'use client'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

const Logout = () => {
    async function handleLogout(){
        await authClient.signOut({
            fetchOptions:{
                onSuccess:()=>{
                    redirect("/auth/login")
                }
            }
        })
    }
    return (
        <button onClick={handleLogout} className="w-full text-left text-red-400 hover:underline">
            Logout
        </button>
    )
}

export default Logout