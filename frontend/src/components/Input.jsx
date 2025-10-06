export default function Input({ label, type="text", value, onChange, placeholder }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/10"
      />
    </label>
  );
}
