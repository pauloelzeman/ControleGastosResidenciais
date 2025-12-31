/**
 * Layout principal da aplicação
 * Contém navegação lateral e área de conteúdo
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FolderOpen, Receipt, Calculator } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

// Itens de navegação
const navItems = [
  { path: '/', label: 'Pessoas', icon: Users },
  { path: '/categorias', label: 'Categorias', icon: FolderOpen },
  { path: '/transacoes', label: 'Transações', icon: Receipt },
  { path: '/totais', label: 'Totais', icon: Calculator },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-primary-foreground">
            💰 Controle de Gastos
          </h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">
            Sistema Residencial
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            Versão 1.0
          </p>
          <p className="text-xs text-sidebar-foreground/50 text-center">
            Paulo Elzeman © 2025
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
