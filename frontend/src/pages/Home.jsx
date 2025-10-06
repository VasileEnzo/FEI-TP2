// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getPosts } from "../api/post";
import PostCard from "../components/PostCard";

export default function Home() {
  const { jwt, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getPosts(jwt || undefined);
        if (alive) setPosts(list);
      } catch (e) {
        if (alive) setErr(e?.message || "Error cargando posts");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [jwt]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {user && (
        <div className="mb-4 flex justify-end">
          <Link
            to="/create"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700"
          >
            + Nuevo post
          </Link>
        </div>
      )}

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-600">{err}</div>}
      {!loading && !err && !posts.length && <div>No hay posts.</div>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
