
import { User, Task } from "../types";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import Avatar from "./Avatar";
import { Calendar, MessageSquare, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div
      className="task-card group animate-fade-in"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} />
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-2 text-muted-foreground text-xs">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {task.attachments.length > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar user={task.assignee} size="sm" />
        )}
      </div>
      
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-secondary text-xs rounded-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
