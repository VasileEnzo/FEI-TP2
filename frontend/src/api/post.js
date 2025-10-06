// src/api/post.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

// Normaliza un post (v5 = plano, v4 = en attributes)
function normalize(raw) {
  if (!raw) return null;
  const a = raw.attributes ? raw.attributes : raw;
  return {
    // ids
    id: raw.id,
    documentId: raw.documentId ?? a.documentId ?? null,
    // campos propios
    title: a.title ?? "",
    description: a.description ?? "",
    post_id: a.post_id ?? null,
    evidences: a.evidences ?? null, // media/relaciones (mantengo la forma original con .data)
  };
}

// ===== LISTA =====
export async function getPosts(jwt) {
  const params = new URLSearchParams({
    populate: "*",
    "sort[0]": "createdAt:desc",
    locale: "all",
  });
  if (jwt) params.set("publicationState", "preview");

  const res = await axios.get(`${API_URL}/api/posts?${params.toString()}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });

  const rows = res.data?.data ?? [];
  return rows.map(normalize);
}

// ===== DETALLE por id interno (Opción A) =====
export async function getPost(id, jwt) {
  const params = new URLSearchParams({ populate: "*", locale: "all" });
  if (jwt) params.set("publicationState", "preview");

  const res = await axios.get(`${API_URL}/api/posts/${id}?${params.toString()}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });

  const raw = res.data?.data ?? null;
  return normalize(raw);
}


// createPost en Strapi v5: sube imagen primero, luego crea el post referenciando el media
export async function createPost({ title, description, imageFile, jwt, user, categoryId, locale }) {
  if (!jwt) throw new Error("Token JWT no encontrado");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

  // ===== 1) Upload (si hay imagen) =====
  let mediaId = null;
  if (imageFile) {
    const fd = new FormData();
    fd.append("files", imageFile);

    const upRes = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` }, // NO seteamos Content-Type
      body: fd,
    });

    const upText = await upRes.text();
    if (!upRes.ok) {
      let msg = upText;
      try { msg = JSON.parse(upText)?.error?.message || upText; } catch {}
      console.error("UPLOAD ERROR ->", msg);
      throw new Error(`Upload falló: ${msg}`);
    }
    const uploaded = JSON.parse(upText); // v5 devuelve array
    mediaId = uploaded?.[0]?.id ?? null;
  }

  // ===== 2) Crear el Post =====
  const data = {
    title,
    description,
    fecha_creacion: new Date().toISOString(),
  };

  // Si tu modelo tiene i18n y necesitás setear explicitamente:
  if (locale) data.locale = locale; // ej: "es"

  // Si tu modelo tiene relación con usuario y la querés setear:
  if (user?.id) data.users_permissions_user = user.id;

  // Si tu modelo exige categoría (ajustá si tu campo es required)
  if (categoryId) data.category = categoryId;

  // Campo media Multiple: NOMBRE EXACTO = "evidences"
  if (mediaId) data.evidences = [mediaId];

  // DEBUG: mirá qué estamos mandando
  console.log("POST /api/posts data ->", data);

  const res = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data }),
  });

  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.error?.message || text; } catch {}
    console.error("CREATE ERROR ->", msg);
    throw new Error(msg);
  }

  return JSON.parse(text).data;
}


export async function getPostByDocumentId(documentId, jwt) {
  const params = new URLSearchParams({ populate: "*", locale: "all" });
  if (jwt) params.set("publicationState", "preview");

  const res = await axios.get(`${API_URL}/api/posts/${documentId}?${params.toString()}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });

  return normalize(res.data?.data ?? null);
}