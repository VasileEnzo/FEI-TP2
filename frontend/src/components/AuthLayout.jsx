export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/70 shadow-xl backdrop-blur-md dark:bg-white/5">
          <div className="px-8 pt-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <div className="p-8 pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
