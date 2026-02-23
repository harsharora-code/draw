"use client"
import { useState } from "react"
import Signin from "../../app/signin/page"
import  Signup  from "../../app/signup/page"

export default function AuthPage() {
  const [mode, setMode] = useState("signin")

  return (
    <>
      {mode === "signin" ? (
        <Signin onSwitch={() => setMode("signup")} />
      ) : (
        <Signup onSwitch={() => setMode("signin")} />
      )}
    </>
  )
}