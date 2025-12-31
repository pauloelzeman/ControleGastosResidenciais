/**
 * Aplicação principal - Controle de Gastos Residenciais
 * Configura roteamento e providers globais
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import PessoasPage from "@/pages/PessoasPage";
import CategoriasPage from "@/pages/CategoriasPage";
import TransacoesPage from "@/pages/TransacoesPage";
import TotaisPage from "@/pages/TotaisPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Página inicial - Cadastro de Pessoas */}
            <Route path="/" element={<PessoasPage />} />
            
            {/* Cadastro de Categorias */}
            <Route path="/categorias" element={<CategoriasPage />} />
            
            {/* Cadastro de Transações */}
            <Route path="/transacoes" element={<TransacoesPage />} />
            
            {/* Consulta de Totais */}
            <Route path="/totais" element={<TotaisPage />} />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
