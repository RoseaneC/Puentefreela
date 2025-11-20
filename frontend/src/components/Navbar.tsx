import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
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
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all text-red-400"
              >
                Desconectar
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
