import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { createPost } from "../api/post";

export default function CreatePost() {
  const { user, jwt } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        Debes iniciar sesión para crear posts.{" "}
        <Link to="/login" className="underline text-indigo-600">Ir a Login</Link>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!title.trim() || !description.trim()) {
      setErr("Título y descripción son obligatorios");
      return;
    }

    setLoading(true);
    try {
      // Si tu modelo requiere categoría, pasá categoryId aquí (un ID válido)
      await createPost({ title, description, imageFile, jwt, user /*, categoryId: 1, locale: 'es' */ });
      navigate("/");
    } catch (e) {
      setErr(e?.message || "No se pudo crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crear post</h1>
        <Link to="/" className="text-sm text-indigo-600 underline">← Volver</Link>
      </div>

      {err && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Mi primer post"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Descripción</span>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Contenido del post…"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Imagen (opcional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creando…" : "Publicar"}
        </button>
      </form>
    </main>
  );
}
