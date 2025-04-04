
import { User } from "../types";

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const Avatar = ({ user, size = "md", showStatus = false }: AvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  if (!user.avatar) {
    // Display initials if no avatar
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="relative">
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium`}
        >
          {initials}
        </div>
        {showStatus && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {showStatus && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
      )}
    </div>
  );
};

export default Avatar;
