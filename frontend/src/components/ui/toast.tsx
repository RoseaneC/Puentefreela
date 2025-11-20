// Toast simplificado para evitar dependências complexas
import * as React from "react";

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const ToastViewport: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={`fixed top-0 right-0 z-[100] p-4 ${className || ""}`}>
    {children}
  </div>
);

const Toast: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string
}> = ({ children, variant = "default", className }) => {
  const baseClasses = "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all";
  const variantClasses = variant === "destructive"
    ? "border-destructive bg-destructive text-destructive-foreground"
    : "border bg-background text-foreground";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className || ""}`}>
      {children}
    </div>
  );
};

const ToastAction: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void
}> = ({ children, className, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary ${className || ""}`}
  >
    {children}
  </button>
);

const ToastClose: React.FC<{ className?: string; onClick?: () => void }> = ({
  className,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 ${className || ""}`}
  >
    ✕
  </button>
);

const ToastTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={`text-sm font-semibold ${className || ""}`}>{children}</div>
);

const ToastDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={`text-sm opacity-90 ${className || ""}`}>{children}</div>
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
