import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/post"; // <- ojo: plural
import { useAuth } from "../AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";

export default function CreatePost() {
  const { user, jwt } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // -> description en Strapi
  const [image, setImage] = useState(null);   // File | null
  const [previewUrl, setPreviewUrl] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  if (!user) return <div className="p-6 text-center">Debes iniciar sesión para crear posts.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!title.trim() || !content.trim()) {
      setErr("Título y contenido son obligatorios");
      return;
    }
    try {
      setLoading(true);
      await createPost({
        title,
        description: content,
        imageFile: image || undefined, // crea con imagen si Upload está activo, si no crea sin imagen
        jwt,
      });
      navigate("/");
    } catch (error) {
      console.error("Create post error:", error);
      setErr(error?.message || "Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
      <main className="relative mx-auto max-w-xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Crear nuevo post</h1>

        {err && <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{String(err).slice(0,400)}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del post"
          />

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí tu post..."
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/10"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Imagen (opcional)</span>
            <input type="file" accept="image/*" onChange={(e)=> setImage(e.target.files?.[0] || null)} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 h-40 w-full rounded-xl object-cover border border-gray-200"
              />
            )}
          </label>

          <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Publicar post"}</Button>
        </form>
      </main>
    </div>
  );
}
