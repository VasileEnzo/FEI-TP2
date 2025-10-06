import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getPostByDocumentId } from "../api/post";

const API = (process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/+$/, "");

function getFirstImageUrl(evidences) {
  const file = evidences?.data?.[0] || evidences?.[0];
  const url = file?.attributes?.url || file?.url;
  return url ? `${API}${url}` : null;
}

export default function PostDetail() {
  const { documentId } = useParams(); // ← ahora viene la cadena larga
  const { jwt } = useAuth();

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!documentId || documentId === "undefined") throw new Error("ID inválido");
        const data = await getPostByDocumentId(documentId, jwt || undefined);
        if (!data) throw new Error("Post no encontrado");
        if (alive) setPost(data);
      } catch (e) {
        if (alive) setErr(e?.message || "No se pudo cargar el post");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [documentId, jwt]);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (err) return <div className="p-6 text-red-600">{err} <br /><Link to="/" className="underline">Volver</Link></div>;
  if (!post) return null;

  const imgUrl = getFirstImageUrl(post.evidences);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <Link to="/" className="text-indigo-600 underline text-sm">← Volver</Link>
      <h1 className="text-3xl font-bold">{post.title || "(Sin título)"}</h1>
      {post.description && <p className="text-gray-700 whitespace-pre-line">{post.description}</p>}
      {imgUrl && <img src={imgUrl} alt={post.title || ""} className="w-full rounded-xl object-cover max-h-[480px]" />}
    </main>
  );
}
