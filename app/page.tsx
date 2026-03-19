"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

/*   const handleLogin = () => {
    setIsLoggedIn(true)
  } */

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

/*   if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  } */

  return <Dashboard onLogout={handleLogout} />
}
