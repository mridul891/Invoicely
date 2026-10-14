import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { requireUser } from "./requireUser";

export default async function requireOnboardedUser() {
  const user = await requireUser();

  const isBusiness = await prisma.business.findFirst({
    where: {
      ownerId: user.id,
    },
  });

  if (!isBusiness) {
    redirect("/onboarding");
  }

  return { user, business: isBusiness };
}
