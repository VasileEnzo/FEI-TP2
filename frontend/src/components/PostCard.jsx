import { Link } from "react-router-dom";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

export default function PostCard({ post }) {
  const a = post?.attributes || {};
  const imgUrl = a?.evidences?.data?.[0]?.attributes?.url
    ? `${API}${a.evidences.data[0].attributes.url}`
    : null;

  return (
    <article className="group rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur-md transition hover:shadow-lg dark:bg-white/5">
      {imgUrl && <img src={imgUrl} alt={a.title || ""} className="mb-3 aspect-video w-full rounded-lg object-cover" />}
      <h2 className="line-clamp-2 text-lg font-semibold">{a.title || "Sin título"}</h2>
      {a.description && <p className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{a.description}</p>}
      <div className="mt-3 flex items-center justify-between">
        <Link to={`/post/${a.post_id}`} className="text-xs font-semibold text-indigo-600 hover:underline">
          Leer más
        </Link>
      </div>
    </article>
  );
}
