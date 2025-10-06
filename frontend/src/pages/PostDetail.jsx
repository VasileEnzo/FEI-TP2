import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
// IMPORTA desde singular si tu archivo es src/api/post.js
import { getPostByPostId } from "../api/post";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

export default function PostDetail() {
  const { postId } = useParams(); // /post/:postId
  const { jwt } = useAuth();

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!postId) throw new Error("postId inválido");
        const data = await getPostByPostId(postId, jwt || undefined);
        if (alive) setPost(data);
      } catch (e) {
        if (alive) setErr(e?.message || "No se pudo cargar el post");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [postId, jwt]);

  if (loading) return <div className="p-6 text-center">Cargando…</div>;
  if (err) return (
    <div className="p-6 text-center text-red-600">
      {err} <br />
      <Link className="text-indigo-600 underline" to="/">Volver</Link>
    </div>
  );
  if (!post) return null;

  const a = post.attributes || {};
  const imgUrl = a?.evidences?.data?.[0]?.attributes?.url
    ? `${API}${a.evidences.data[0].attributes.url}`
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
      <main className="relative mx-auto max-w-3xl px-6 py-10">
        <Link to="/" className="text-indigo-600 underline text-sm mb-4 inline-block">← Volver</Link>
        <article className="bg-white/80 dark:bg-white/5 rounded-2xl shadow p-6 space-y-5 backdrop-blur">
          <h1 className="text-3xl font-bold">{a.title}</h1>
          {a.description && <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{a.description}</p>}
          {imgUrl && <img src={imgUrl} alt={a.title || ""} className="w-full rounded-xl object-cover max-h-[480px]" />}
        </article>
      </main>
    </div>
  );
}
