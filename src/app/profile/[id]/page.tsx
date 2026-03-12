import { getSession } from "@/lib/auth";
import { getUserById, getPosts } from "@/lib/firestore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/feed/PostCard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, user] = await Promise.all([
    getSession(),
    getUserById(id),
  ]);

  if (!user) redirect("/");

  const { posts } = await getPosts({ userId: id, limit: 50 });
  const isOwn = session?.uid === user.uid;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProfileHeader user={user} isOwn={isOwn} />

      <h2 className="font-heading font-semibold text-lg mb-3">
        {isOwn ? "Your Posts" : `${user.displayName}'s Posts`}
      </h2>

      {posts.length === 0 ? (
        <p className="text-bark-light text-center py-8">No posts yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={{ ...post, user }} />
          ))}
        </div>
      )}
    </div>
  );
}
