
import { Status } from "../types";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
}

const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  let className = `font-medium rounded-full ${sizeClasses[size]} `;

  switch (status) {
    case "To Do":
      className += "status-todo text-slate-900";
      break;
    case "In Progress":
      className += "status-in-progress text-yellow-800";
      break;
    case "Review":
      className += "status-review text-blue-800";
      break;
    case "Done":
      className += "status-done text-green-800";
      break;
    default:
      className += "bg-secondary text-secondary-foreground";
  }

  return <span className={className}>{status}</span>;
};

export default StatusBadge;
