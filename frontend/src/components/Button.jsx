export default function Button({ children, type="button", onClick, className="" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
