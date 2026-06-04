import { authenticate } from './actions'

type Props = { searchParams: { error?: string } }

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-blue-500 text-xs font-mono tracking-widest uppercase mb-3">Université Paris-Panthéon-Assas</div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Commodity Trading</h1>
          <p className="text-slate-500 text-sm mt-2">Masterclass · Enter your access code</p>
        </div>
        <form action={authenticate} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Access code"
            required
            autoFocus
            className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 text-center text-lg tracking-widest"
          />
          {searchParams.error && (
            <p className="text-red-400 text-xs text-center font-mono">Incorrect access code</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  )
}
