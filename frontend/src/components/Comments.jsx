import { useEffect, useMemo, useState } from "react";

const API = (process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/+$/, "");

async function fetchPostOwnerId(postId, jwt) {
  const p = new URLSearchParams();
  p.set("filters[id][$eq]", String(postId));
  p.set("populate[users_permissions_user][fields][0]", "username");
  p.set("populate[users_permissions_user][fields][1]", "email");
  p.set("pagination[pageSize]", "1");
  if (jwt) p.set("publicationState", "preview");

  const r = await fetch(`${API}/api/posts?${p.toString()}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  const j = JSON.parse(t);
  const item = (j?.data || [])[0];
  const a = item?.attributes || {};
  return a?.users_permissions_user?.data?.id ?? null;
}

async function fetchCommentsAllPages(postId, documentId, jwt) {
  const headers = jwt ? { Authorization: `Bearer ${jwt}` } : undefined;
  const pageSize = 100;
  let page = 1;
  let out = [];

  while (true) {
    const p = new URLSearchParams();

    
     p.set("filters[post][id][$eq]", String(postId))

    p.set("sort[0]", "createdAt:desc");
    p.set("populate[user][fields][0]", "username");
    p.set("populate[user][fields][1]", "email");
    p.set("pagination[page]", String(page));
    p.set("pagination[pageSize]", String(pageSize));
    if (jwt) p.set("publicationState", "preview");
console.log("URL:", `${API}/api/comments?${p.toString()}`);
    const r = await fetch(`${API}/api/comments?${p.toString()}`, { headers });
    const t = await r.text();
    if (!r.ok) throw new Error(t);
    const j = JSON.parse(t);

    const items = j.data || [];
    const meta = j.meta?.pagination || { page, pageSize, pageCount: 1 };

    const mapped = items.map((raw) => {
      const a = raw.attributes || raw;
      const u = a.user || a.users_permissions_user || raw.user || raw.users_permissions_user || null;
      const userId = (u && u.id) ?? (u && u.data && u.data.id) ?? null;
      const userName =(u && u.data && u.data.attributes && u.data.attributes.username)|| "Anónimo";
      return { id: raw.id, body: a.body ?? "", createdAt: a.createdAt ?? null, userId, userName };
    });

    out = out.concat(mapped);

    if (page >= (meta.pageCount || 1)) break;
    page += 1;
  }

  return out;
}

async function createComment(postId, body, jwt) {
  const payload = { data: { body, post: postId } };
  const r = await fetch(`${API}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(payload),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(JSON.parse(t)?.error?.message || t);
  return true;
}

async function destroyComment(id, jwt) {
  const r = await fetch(`${API}/api/comments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const t = await r.text();
  if (!r.ok) throw new Error(JSON.parse(t)?.error?.message || t);
  return true;
}

export default function Comments({ postId, jwt, currentUserId }) {
  const [ownerId, setOwnerId] = useState(null);
  const [list, setList] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const canDelete = useMemo(() => {
    return (authorId) => authorId === currentUserId || (ownerId && ownerId === currentUserId);
  }, [currentUserId, ownerId]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [own, comments] = await Promise.all([
  fetchPostOwnerId(postId, jwt || undefined),
  fetchCommentsAllPages(postId, jwt || undefined), // 👈 acá
]);
        if (!alive) return;
        setOwnerId(own);
        setList(comments);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "No se pudo cargar comentarios");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [postId, jwt]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = body.trim();
    if (!v || !jwt) return;
    setSending(true);
    try {
      await createComment(postId, v, jwt);
      const comments = await fetchCommentsAllPages(postId, jwt || undefined);
      setList(comments);
      setBody("");
    } catch (e) {
      alert(e?.message || "No se pudo comentar");
    } finally {
      setSending(false);
    }
  };

  const onDelete = async (c) => {
    if (!jwt) return;
    if (!canDelete(c.userId)) return;
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try {
      await destroyComment(c.id, jwt);
      setList((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      alert(e?.message || "No se pudo eliminar");
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Cargando comentarios…</div>;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="space-y-4">
      {jwt ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe tu comentario…"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {sending ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Inicia sesión para comentar.</p>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-gray-500">Sé el primero en comentar.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const isMine = c.userId && c.userId === currentUserId;
            const showDelete = canDelete(c.userId);
            return (
              <li key={c.id} className="rounded-lg border border-gray-200 p-3 flex justify-between gap-3">
                <div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                    <span>{isMine ? "Yo" : c.userName || "Anónimo"}</span>
                    {c.createdAt && <span>• {new Date(c.createdAt).toLocaleString()}</span>}
                  </div>
                </div>
                {showDelete && (
                  <button
                    onClick={() => onDelete(c)}
                    className="shrink-0 rounded-md border px-2 py-1 text-[11px] hover:bg-red-50 hover:text-red-700"
                    title="Eliminar comentario"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}



