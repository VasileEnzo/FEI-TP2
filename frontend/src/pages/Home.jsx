import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getPosts } from "../api/post";
import PostCard from "../components/PostCard";

export default function Home() {
  const { user, jwt } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let m = true;
    if (user) {
      setLoading(true);
      getPosts(jwt).then(d => m && setPosts(d)).catch(()=> m && setErr("No se pudieron cargar los posts")).finally(()=> m && setLoading(false));
    }
    return () => { m = false; };
  }, [user, jwt]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
        <main className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Bienvenido</h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Autenticación con Strapi y React lista para usar.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">Comenzar</Link>
              <Link to="/login" className="rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">Ya tengo cuenta</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
      <main className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Últimos posts</h1>
          <Link to="/create" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Nuevo post</Link>
        </div>
        {err && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{err}</p>}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:bg-white/5 h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
            {!posts.length && <p className="col-span-full rounded-xl bg-white/70 p-6 text-center text-sm text-gray-600 backdrop-blur-md dark:bg-white/5 dark:text-gray-400">No hay posts disponibles.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
