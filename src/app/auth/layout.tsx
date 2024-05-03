import { Button } from "@/components/ui/button";
import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function AuthLayout() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();

  if (!user) {
    return <Link href={signInUrl}>Sign in</Link>;
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
      <Button type="submit">Sign out</Button>
    </form>
  );
}
