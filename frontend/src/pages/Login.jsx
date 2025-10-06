import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await login(identifier, password);
      navigate('/');
    } catch {
      setErr('Credenciales inválidas');
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Accedé a tu cuenta para continuar">
      <form onSubmit={onSubmit} className="space-y-4">
        {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{err}</p>}
        <Input label="Email o usuario" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="usuario@correo.com" />
        <Input label="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit">Entrar</Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tenés cuenta? <Link className="font-semibold text-indigo-600 hover:underline" to="/register">Crear una</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
