import { useState } from "react";

export default function CommentForm({ onSubmit, loading }) {
  const [body, setBody] = useState("");
  const handle = async (e) => {
    e.preventDefault();
    const v = body.trim();
    if (!v) return;
    await onSubmit(v);
    setBody("");
  };
  return (
    <form onSubmit={handle} className="space-y-2">
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
          disabled={loading || !body.trim()}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Comentar"}
        </button>
      </div>
    </form>
  );
}
