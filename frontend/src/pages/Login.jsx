import React from "react";
import LoginForm from "../components/LoginForm";

const Login = ({ onNavigate, onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;