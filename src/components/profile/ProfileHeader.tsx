import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/types";
import Link from "next/link";

interface ProfileHeaderProps {
  user: User;
  isOwn: boolean;
}

export function ProfileHeader({ user, isOwn }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar src={user.avatarUrl} alt={user.displayName} size="lg" />
      <div className="flex-1">
        <h1 className="font-heading font-bold text-2xl">{user.displayName}</h1>
        {user.dogName && (
          <p className="text-bark-light">
            {user.dogName}
            {user.dogBreed ? ` the ${user.dogBreed}` : ""}
          </p>
        )}
        <p className="text-bark-light/60 text-sm">{user.email}</p>
      </div>
      {isOwn && (
        <Link
          href="/profile/edit"
          className="bg-sand hover:bg-sand-dark text-bark px-4 py-2 rounded-2xl text-sm font-heading font-semibold transition-colors"
        >
          Edit
        </Link>
      )}
    </div>
  );
}
