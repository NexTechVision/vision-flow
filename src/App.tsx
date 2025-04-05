import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiProvider } from "./contexts/ApiContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyTasks from "./pages/MyTasks";
import ProjectBoard from "./pages/ProjectBoard";
import TaskDetail from "./pages/TaskDetail";
import Teams from "./pages/Teams";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { Reuleaux } from 'ldrs/react';
import 'ldrs/react/Reuleaux.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Simulate loading (replace with real API, auth, or init check)
      await new Promise((resolve) => requestIdleCallback(resolve));

      // Optional: hide HTML loader
      const el = document.getElementById('initial-loader');
      if (el) el.remove();

      setAppReady(true);
    };

    init();
  }, []);

  if (!appReady) {
    return (
        <div className="flex justify-center items-center h-screen bg-white">
          <Reuleaux
              size="37"
              stroke="5"
              strokeLength="0.15"
              bgOpacity="0.1"
              speed="1.2"
              color="black"
          />
        </div>
    );
  }

  return (
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/projects/:id" element={<ProjectBoard />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ApiProvider>
      </QueryClientProvider>
  );
};

export default App;
