import { AcctPage } from "@/components/accounts/acct-page";
import { AcctTypeCarousel } from "@/components/accounts/acct-type-carousel";
import { TAccountType } from "@/types";

export default async function Accounts({
  searchParams,
}: {
  searchParams: { type: TAccountType };
}) {
  return (
    <>
      <AcctTypeCarousel type={searchParams.type ?? "savings"} />

      <AcctPage type={searchParams.type ?? "savings"} />
    </>
  );
}
