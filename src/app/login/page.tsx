import { authenticate } from './actions'

type Props = { searchParams: { error?: string } }

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-400 mb-1">Commodity Trading</h1>
        <p className="text-slate-400 text-sm mb-6">Enter your class password to continue.</p>
        <form action={authenticate} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Class password"
            required
            autoFocus
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-500"
          />
          {searchParams.error && (
            <p className="text-red-400 text-sm">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  )
}
