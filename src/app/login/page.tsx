import { authenticate } from './actions'

type Props = { searchParams: { error?: string } }

export default function LoginPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border-t-2 border-amber-500 bg-zinc-900 border border-zinc-700 p-8">
          <div className="text-amber-400 text-xs font-mono mb-1 tracking-widest uppercase">Terminal Access</div>
          <h1 className="text-2xl font-bold text-white mb-1">Commodity Trading</h1>
          <p className="text-zinc-500 text-xs mb-6 font-mono">Enter class password to continue</p>
          <form action={authenticate} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              required
              autoFocus
              className="w-full bg-black text-amber-400 font-mono px-3 py-2 border border-zinc-600 focus:border-amber-500 focus:outline-none placeholder:text-zinc-600 tracking-wider text-sm"
            />
            {searchParams.error && (
              <p className="text-red-400 text-xs font-mono">ERR: Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 text-sm tracking-widest uppercase transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
