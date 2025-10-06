import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await register(username, email, password);
      navigate('/');
    } catch {
      setErr('No se pudo registrar');
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Registrate para comenzar">
      <form onSubmit={onSubmit} className="space-y-4">
        {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{err}</p>}
        <Input label="Usuario" value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" />
        <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@correo.com" />
        <Input label="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit">Crear cuenta</Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tenés cuenta? <Link className="font-semibold text-indigo-600 hover:underline" to="/login">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
