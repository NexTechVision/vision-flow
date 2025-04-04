
import { useState } from "react";
import { Bell, Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "./Avatar";
import { currentUser, notifications } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    key: ""
  });
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNewProject = () => {
    if (!newProject.name.trim() || !newProject.key.trim()) {
      toast({
        title: "Missing information",
        description: "Project name and key are required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call to create a project
    toast({
      title: "Project created",
      description: `"${newProject.name}" has been created successfully`
    });
    
    // Reset form and close dialog
    setNewProject({
      name: "",
      description: "",
      key: ""
    });
    setIsNewProjectDialogOpen(false);
    
    // Navigate to dashboard to see the new project
    navigate('/');
  };

  return (
    <header className="bg-background z-10 border-b">
      <div className="px-4 h-16 flex justify-between items-center">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="hidden md:flex md:w-96 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-secondary"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1"
            onClick={() => setIsNewProjectDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-popover shadow-lg rounded-md border z-50 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-muted cursor-pointer ${
                        !notification.read ? "bg-accent/10" : ""
                      }`}
                      onClick={() => {
                        if (notification.link) {
                          navigate(notification.link);
                        }
                        setIsNotificationOpen(false);
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${
                          notification.type === 'info' ? 'bg-blue-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t">
                  <Button variant="link" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Avatar user={currentUser} size="sm" showStatus />
        </div>
      </div>

      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  placeholder="Project name" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="projectKey">Key</Label>
                <Input 
                  id="projectKey" 
                  placeholder="KEY" 
                  value={newProject.key}
                  onChange={(e) => setNewProject({...newProject, key: e.target.value.toUpperCase()})}
                  maxLength={5}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea 
                id="projectDescription" 
                placeholder="Project description" 
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNewProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
