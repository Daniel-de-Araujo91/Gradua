import React from "react";
import LoginForm from "../components/LoginForm";

const Login = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;