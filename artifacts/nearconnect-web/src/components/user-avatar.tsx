import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@workspace/api-client-react";

interface UserAvatarProps {
  user: Partial<User> | undefined | null;
  className?: string;
}

export function UserAvatar({ user, className = "w-10 h-10" }: UserAvatarProps) {
  const name = user?.name || "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarImage src={user?.avatar || undefined} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
    </Avatar>
  );
}
