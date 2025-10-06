import { Link } from "react-router-dom";
const API = (process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/+$/, "");

function getFirstImageUrl(evidences) {
  const file = evidences?.data?.[0] || evidences?.[0];
  const url = file?.attributes?.url || file?.url;
  return url ? `${API}${url}` : null;
}

export default function PostCard({ post }) {
  const imgUrl = getFirstImageUrl(post.evidences);

  return (
    <article className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm dark:bg-white/5">
      {imgUrl && <img src={imgUrl} alt={post.title || ""} className="mb-3 aspect-video w-full rounded-lg object-cover" />}
      <h2 className="line-clamp-2 text-lg font-semibold">{post.title || "Sin título"}</h2>
      {post.description && <p className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>}

      {/* 👇 usar documentId en la URL */}
      <div className="mt-3">
        {post.documentId ? (
          <Link to={`/post/${post.documentId}`} className="text-xs font-semibold text-indigo-600 hover:underline">
            Leer más
          </Link>
        ) : (
          <span className="text-xs text-gray-500">Sin documentId</span>
        )}
      </div>
    </article>
  );
}
