import { PageHeader } from "@/components/common/page-header";
import { SideNav } from "@/components/nav/side-nav";
import { createCashAccountForUser } from "@/lib/db/mutations/accounts.mutations";
import { createUser } from "@/lib/db/mutations/users.mutations";
import { getCashBank } from "@/lib/db/queries/banks.queries";
import { getUserWithCashAcctById } from "@/lib/db/queries/users.queries";
import { getUser } from "@workos-inc/authkit-nextjs";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getUser({ ensureSignedIn: true });
  const cash = await getCashBank();
  const profile = await getUserWithCashAcctById(user.id, cash.id);
  if (!profile) {
    await createUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.profilePictureUrl,
    });
    await createCashAccountForUser(user.id, cash.id);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/90">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <PageHeader />
        {children}
      </div>
    </div>
  );
}
