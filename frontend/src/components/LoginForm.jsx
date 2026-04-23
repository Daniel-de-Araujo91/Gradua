import React, { useState } from "react";

const LoginForm = ({ onLoginSuccess }) => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) value = value.slice(0, 11); 

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setCpf(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 1000);

    } catch (err) {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src="/icon.png" alt="Gradua" className="h-24 w-auto" />
        </div>
        <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">
          Gradua
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-black text-gradua-inicio text-center">
          Bem-vindo de volta!
        </h2>
        <p className="text-gray-500 text-sm text-center mt-2 font-medium">
          Acesse sua conta utilizando seu CPF e senha institucionais.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center justify-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            CPF
          </label>
          <input
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium"
            required
          />
        </div>

        <div className="flex justify-center mb-2">
          <button type="button" className="text-sm font-bold text-gradua-inicio hover:opacity-80 transition-opacity">
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradua-inicio text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gradua-inicio/20">
          {loading ? "Entrando..." : "Entrar na Conta"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;