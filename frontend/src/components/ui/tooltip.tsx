// Tooltip simplificado para evitar dependências complexas
import * as React from "react";

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const TooltipTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <span className={className}>{children}</span>
);

const TooltipContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={`hidden ${className || ""}`}>{children}</div>
);

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
