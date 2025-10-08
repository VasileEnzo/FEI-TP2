export default function CommentList({ comments, currentUserId, postOwnerId, onDelete }) {
  if (!comments?.length) return <p className="text-sm text-gray-500">Sé el primero en comentar.</p>;
  return (
    <ul className="space-y-3">
      {comments.map(c => {
        const isMine = c.userId && c.userId === currentUserId;
        const iOwnPost = postOwnerId && currentUserId === postOwnerId;
      
        const canDelete = isMine || iOwnPost;
        
        return (
          
          <li key={c.id} className="rounded-lg border border-gray-200 p-3 flex justify-between gap-3">
            <div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                <span>{isMine ? "Yo" : c.userName || "Anónimo"}</span>
                {c.createdAt && <span>• {new Date(c.createdAt).toLocaleString()}</span>}
              </div>
            </div>
            {canDelete && (
              <button
                onClick={() => onDelete?.(c)}
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
  );
}
