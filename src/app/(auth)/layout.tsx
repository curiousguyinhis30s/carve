import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="text-2xl font-bold text-white">
          Hendshake
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Hendshake. All rights reserved.
      </footer>
    </div>
  )
}
