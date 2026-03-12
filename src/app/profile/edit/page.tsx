import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/firestore";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.uid);
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProfileForm user={user} />
    </div>
  );
}
