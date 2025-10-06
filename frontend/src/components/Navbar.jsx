import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/70 backdrop-blur-md dark:bg-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">Mi App</Link>
        <button onClick={()=>setOpen(!open)} className="md:hidden rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">
          Menu
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">Inicio</NavLink>
          {user ? (
            <>
              
              <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">Hola {user.username}</span>
              <button onClick={logout} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">Login</NavLink>
              <NavLink to="/register" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Crear cuenta</NavLink>
            </>
          )}
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            <NavLink onClick={()=>setOpen(false)} to="/" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">Inicio</NavLink>
            {user ? (
              <>
                <NavLink onClick={()=>setOpen(false)} to="/dashboard" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">Dashboard</NavLink>
                <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">Hola {user.username}</span>
                <button onClick={()=>{logout(); setOpen(false);}} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Salir</button>
              </>
            ) : (
              <>
                <NavLink onClick={()=>setOpen(false)} to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/10">Login</NavLink>
                <NavLink onClick={()=>setOpen(false)} to="/register" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Crear cuenta</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
