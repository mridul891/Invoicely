"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import { BusinessSchema } from "@/schema/business";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  business: BusinessSchema,
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export async function getProfileAction() {
  const user = await requireUser();

  const business = await prisma.business.findFirst({
    where: { ownerId: user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      taxId: true,
      address: true,
    },
  });

  if (!business) {
    return { status: "error" as const, message: "Cannot find profile" };
  }

  return {
    status: "success" as const,
    data: {
      name: user.name ?? "",
      email: user.email,
      business: {
        name: business.name,
        email: business.email,
        phone: business.phone ?? "",
        taxId: business.taxId ?? "",
        address: business.address as {
          addressLine1: string;
          city: string;
          state: string;
          postalCode: string;
          country: string;
        },
      },
    },
  };
}

export async function updateProfileAction(input: UpdateProfileInput) {
  const user = await requireUser();

  const validated = UpdateProfileSchema.safeParse(input);

  if (!validated.success) {
    return { status: "error" as const, message: "Invalid profile information" };
  }

  const { name, business } = validated.data;

  const existing = await prisma.business.findFirst({
    where: { ownerId: user.id },
    select: { id: true },
  });

  if (!existing) {
    return { status: "error" as const, message: "Cannot find profile" };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { name },
      }),
      prisma.business.update({
        where: { id: existing.id },
        data: {
          name: business.name,
          email: business.email,
          phone: business.phone || null,
          taxId: business.taxId || null,
          address: business.address,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { status: "error" as const, message: "Failed to update profile" };
  }

  return { status: "success" as const, message: "Profile updated successfully." };
}
