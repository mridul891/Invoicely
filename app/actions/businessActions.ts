"use server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import { CreateBusinessInput, CreateBusinessSchema } from "@/schema/business";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client";
export async function createBusinessAction(input: CreateBusinessInput) {
  // authenticate the user
  const user = await requireUser();

  // validate the user
  const validated = CreateBusinessSchema.safeParse(input);

  if (!validated.success) {
    return {
      status: false as const,
      error: "Invalid business information",
      fieldErrors: z.treeifyError(validated.error),
    };
  }

  //   create the business
  const data = validated.data;

  //   check whether the user already has a business

  const existingBusiness = await prisma.business.findFirst({
    where: {
      ownerId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (existingBusiness) {
    return {
      status: false as const,
      error: "You already have a business",
    };
  }

  //   create the business

  try {
    const business = await prisma.business.create({
      data: {
        name: data.name,
        ownerId: user.id,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
        address: data.address,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      status: true as const,
      businessId: business.id,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: false as const,
        error: "You already have a business",
      };
    }

    console.error("Failed to create business:", error);

    return {
      status: false as const,
      error: "Failed to create business",
    };
  }
}
