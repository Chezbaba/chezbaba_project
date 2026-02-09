import RestrictedAccess from "@/components/common/RestrictedAccess";
import OrderPageMain from "@/components/store/orderpage";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const session = await auth();

  if (!session) {
    return <RestrictedAccess />;
  }

  if (session.user.role !== UserRole.CLIENT) {
    return (
      <RestrictedAccess message="Vous n'avez pas l'autorisation d'accéder à cette page, qui est réservée uniquement aux clients." />
    );
  }

  if (!session.user.tel) {
    redirect("/client/settings?error=missing_phone");
  }

  return <OrderPageMain />;
}
