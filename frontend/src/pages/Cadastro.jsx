import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setFormData(prev => ({ ...prev, cpf: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const [firstName, ...rest] = formData.nome.trim().split(' ');
      const lastName = rest.join(' ') || '';
      const cleanDocument = formData.cpf.replace(/\D/g, '');

      const data = await authService.register({
        firstName,
        lastName,
        email: formData.email,
        document: cleanDocument,
        password: formData.senha,
        isForeigner: false,
      });

      login({ id: data.userId, firstName: data.firstName, lastName: data.lastName, role: data.role }, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/icon.png" alt="Gradua" className="h-20 w-auto" />
          </div>
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">
            Gestão Acadêmica
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-gradua-inicio text-center">
            Criar nova conta
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2 font-medium">
            Preencha os dados abaixo para acessar o sistema.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center justify-center text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Email Institucional
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Confirmar
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gradua-inicio focus:ring-2 focus:ring-gradua-inicio/20 focus:bg-white outline-none transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradua-inicio text-white py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gradua-inicio/20 mt-4">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm font-medium">
            Já tem uma conta?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-gradua-inicio font-bold hover:underline underline-offset-2 transition-all">
              Entrar
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Cadastro;
