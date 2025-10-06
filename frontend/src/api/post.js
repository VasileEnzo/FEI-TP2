const API = process.env.REACT_APP_API_URL;

export async function getPosts(jwt) {
  const headers = { Accept: 'application/json' };
  let qs = 'populate=*&sort[0]=createdAt:desc';
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
    qs += '&publicationState=preview';
  }
  const res = await fetch(`${API}/api/posts?${qs}`, { headers });
  if (!res.ok) throw new Error('Error cargando posts');
  const json = await res.json();
  return json.data ?? [];
}

export async function createPost({ title, description, imageFile, jwt }) {
  if (!jwt) throw new Error("Token JWT no encontrado");
  const fechaActual = new Date().toISOString();

  if (imageFile) {
    const fd = new FormData();
    fd.append("data", JSON.stringify({ title, description, fecha_creacion: fechaActual }));
    fd.append("files.evidences", imageFile);

    const res = await fetch(`${API}/api/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: fd,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    return JSON.parse(text).data;
  }

  const body = { data: { title, description, fecha_creacion: fechaActual } };

  const res = await fetch(`${API}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text).data;
}

export async function getPostByPostId(postIdValue, jwt) {
  const headers = { Accept: "application/json" };
  const params = new URLSearchParams({
    populate: "*",
    locale: "all",
    "filters[post_id][$eq]": String(postIdValue),
    "pagination[pageSize]": "1",
  });

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
    params.set("publicationState", "preview");
  }

  const url = `${API}/api/posts?${params.toString()}`;
  const res = await fetch(url, { headers });
  const text = await res.text();

  if (!res.ok) {
    console.error("GET /api/posts?filters[post_id] ERROR", res.status, text);
    throw new Error("Error al cargar el post");
  }

  const json = JSON.parse(text);
  const item = (json.data || [])[0];
  if (!item) throw new Error("Post no encontrado");
  return item;
}
