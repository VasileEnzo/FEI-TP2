const API = (process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/+$/, "");

function normalize(raw) {
  if (!raw) return null;
  const a = raw.attributes || raw;
  const u = a.user || raw.user;
  const userId = u?.id ?? u?.data?.id ?? null;
  const userName = u?.username || u?.email || u?.data?.attributes?.username || "Anónimo";
  return { id: raw.id, body: a.body ?? "", createdAt: a.createdAt ?? null, userId, userName };
}

export async function getCommentsByPostId(postId, jwt) {
  const q = new URLSearchParams({ "filters[post][id][$eq]": String(postId), "sort[0]": "createdAt:desc" });
  q.set("populate[user]", "*");
  const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
  const r = await fetch(`${API}/api/comments?${q.toString()}`, { headers });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  const j = JSON.parse(t);
  return (j.data ?? []).map(normalize);
}

export async function createComment({ postId, body, jwt }) {
  if (!jwt) throw new Error("Necesitas iniciar sesión");
  const payload = { data: { body, post: postId } };
  const r = await fetch(`${API}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(payload)
  });
  const t = await r.text();
  if (!r.ok) throw new Error(JSON.parse(t)?.error?.message || t);
  return normalize(JSON.parse(t).data);
}

export async function deleteComment({ id, jwt }) {
  if (!jwt) throw new Error("Necesitas iniciar sesión");
  const r = await fetch(`${API}/api/comments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${jwt}` } });
  const t = await r.text();
  if (!r.ok) throw new Error(JSON.parse(t)?.error?.message || t);
  return normalize(JSON.parse(t).data);
}
