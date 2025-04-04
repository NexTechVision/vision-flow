
import { useState } from "react";
import { Bell, Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "./Avatar";
import { currentUser, notifications } from "../data/mockData";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;

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
            onClick={() => navigate('/projects/new')}
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
    </header>
  );
};

export default Navbar;
