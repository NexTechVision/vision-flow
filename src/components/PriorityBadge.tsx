
import { Priority } from "../types";

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  let className = "priority-badge ";

  switch (priority) {
    case "Low":
      className += "priority-low";
      break;
    case "Medium":
      className += "priority-medium";
      break;
    case "High":
      className += "priority-high";
      break;
    case "Critical":
      className += "priority-critical";
      break;
    default:
      className += "bg-secondary text-secondary-foreground";
  }

  return <span className={className}>{priority}</span>;
};

export default PriorityBadge;
