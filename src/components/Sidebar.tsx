
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ListTodo,
  Users,
  BarChart,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeGroup, setActiveGroup] = useState("projects");

  const mainNavItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "My Tasks",
      icon: ListTodo,
      path: "/my-tasks",
    },
    {
      title: "Teams",
      icon: Users,
      path: "/teams",
    },
    {
      title: "Reports",
      icon: BarChart,
      path: "/reports",
    },
  ];

  const toggleGroup = (group: string) => {
    setActiveGroup(activeGroup === group ? "" : group);
  };

  return (
    <aside
      className={cn(
        "bg-background border-r transition-all duration-300 z-30 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center overflow-hidden">
          {isOpen ? (
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NexTechVision
            </h1>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              N
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-2"
        >
          {isOpen ? (
            <ChevronsLeft className="h-5 w-5" />
          ) : (
            <ChevronsRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted",
                  !isOpen && "px-2"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                {isOpen && <span>{item.title}</span>}
              </Button>
            ))}
          </nav>

          <div className="mt-6">
            <div className="px-3 mb-2">
              <div
                className="flex items-center justify-between cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => toggleGroup("projects")}
              >
                {isOpen && <span className="text-xs font-medium">PROJECTS</span>}
                {isOpen && (
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {(activeGroup === "projects" || !isOpen) && (
              <div className="space-y-1">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location.pathname === `/projects/${project.id}`
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted",
                      !isOpen && "px-2"
                    )}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Layers className={cn("h-5 w-5", isOpen && "mr-2")} />
                    {isOpen && (
                      <span className="truncate">{project.name}</span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            location.pathname === "/settings"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted",
            !isOpen && "px-2"
          )}
          onClick={() => navigate("/settings")}
        >
          <Settings className={cn("h-5 w-5", isOpen && "mr-2")} />
          {isOpen && <span>Settings</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
