import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
  isConnected?: boolean
  address?: string
  onConnect?: () => void
  onDisconnect?: () => void
}

export function AppShell({
  children,
  isConnected = false,
  address,
  onConnect,
  onDisconnect
}: AppShellProps) {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold">PuenteFreela</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Jobs
              </Link>
              <Link
                to="/create"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Criar Job
              </Link>
            </div>

            {isConnected ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Desconectar
                </button>
              </div>
            ) : (
            <button
              onClick={onConnect}
              className="inline-flex items-center gap-2 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all rounded-md px-4 py-2 text-sm font-medium"
            >
              <Wallet className="w-4 h-4" />
              Conectar
            </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        {children}
      </main>
    </div>
  )
}

