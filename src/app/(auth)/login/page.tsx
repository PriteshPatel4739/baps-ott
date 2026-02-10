"use client";
import LoginPage from "@/components/LoginPage";
import { useState } from "react";

type AuthMode = "login" | "register";

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return <LoginPage mode={mode} setMode={setMode} />;
};

export default Login;
