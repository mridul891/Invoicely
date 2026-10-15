"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { getProfileAction, updateProfileAction } from "@/app/actions/profileActions";
import { BusinessSchema } from "@/schema/business";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  business: BusinessSchema,
});

type ProfileInput = z.infer<typeof ProfileSchema>;

const inputClassName = "rounded-lg";
const buttonClassName = "rounded-lg";

function FieldShell({
  label,
  htmlFor,
  optional,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: { message?: string };
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={htmlFor}>
        {label}{" "}
        {optional && (
          <span className="text-muted-foreground">(optional)</span>
        )}
      </FieldLabel>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  );
}

export function ProfileForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(true);
  const [email, setEmail] = React.useState("");

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      business: {
        name: "",
        email: "",
        phone: "",
        taxId: "",
        address: {
          addressLine1: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      },
    },
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getProfileAction();
      if (cancelled) return;
      if (result.status === "error" || !result.data) {
        toast.error("Could not load profile", {
          description: result.status === "error" ? result.message : undefined,
        });
        setIsLoading(false);
        return;
      }
      form.reset({
        name: result.data.name,
        business: {
          name: result.data.business.name,
          email: result.data.business.email,
          phone: result.data.business.phone,
          taxId: result.data.business.taxId,
          address: result.data.business.address,
        },
      });
      setEmail(result.data.email);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [form]);

  function onSubmit(values: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction({
        name: values.name,
        business: {
          ...values.business,
          phone: values.business.phone?.trim() ? values.business.phone : undefined,
          taxId: values.business.taxId?.trim() ? values.business.taxId : undefined,
        },
      });

      if (result.status === "error") {
        toast.error("Could not update profile", {
          description: result.message,
        });
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-4xl flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-5 py-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-64" />
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-4xl flex-col gap-6"
    >
      {/* Personal information */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-[-0.01em]">
            Personal information
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your personal details and account information.
          </p>
        </div>

        <FieldGroup className="grid gap-5 p-5 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell label="Full name" htmlFor="profile-name" error={fieldState.error}>
                <Input
                  {...field}
                  id="profile-name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />

          <Field data-invalid={false}>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input
              id="profile-email"
              value={email}
              disabled
              className={`${inputClassName} bg-muted text-muted-foreground`}
            />
            <p className="text-xs text-muted-foreground">
              Your sign-in email cannot be changed.
            </p>
          </Field>
        </FieldGroup>
      </section>

      {/* Business information */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-[-0.01em]">
            Business information
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Details that will appear on your invoices and business documents.
          </p>
        </div>

        <FieldGroup className="grid gap-5 p-5 sm:grid-cols-2">
          <Controller
            name="business.name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell
                label="Business name"
                htmlFor="profile-business-name"
                error={fieldState.error}
              >
                <Input
                  {...field}
                  id="profile-business-name"
                  placeholder="Acme Studio Pvt. Ltd."
                  autoComplete="organization"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />

          <Controller
            name="business.email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell
                label="Business email"
                htmlFor="profile-business-email"
                error={fieldState.error}
              >
                <Input
                  {...field}
                  id="profile-business-email"
                  type="email"
                  placeholder="billing@acme.in"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />

          <Controller
            name="business.phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell
                label="Phone"
                htmlFor="profile-business-phone"
                optional
                error={fieldState.error}
              >
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="profile-business-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />

          <Controller
            name="business.taxId"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell
                label="GSTIN / Tax ID"
                htmlFor="profile-business-tax-id"
                optional
                hint="Printed on invoices for tax compliance."
                error={fieldState.error}
              >
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="profile-business-tax-id"
                  placeholder="22AAAAA0000A1Z5"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />
        </FieldGroup>
      </section>

      {/* Business address */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-[-0.01em]">
            Business address
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your registered business address.
          </p>
        </div>

        <FieldGroup className="grid gap-5 p-5">
          <Controller
            name="business.address.addressLine1"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldShell
                label="Street address"
                htmlFor="profile-address-line1"
                error={fieldState.error}
              >
                <Input
                  {...field}
                  id="profile-address-line1"
                  placeholder="14, MG Road"
                  autoComplete="street-address"
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
              </FieldShell>
            )}
          />

          <div className="grid items-start gap-5 sm:grid-cols-2">
            <Controller
              name="business.address.city"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldShell label="City" htmlFor="profile-city" error={fieldState.error}>
                  <Input
                    {...field}
                    id="profile-city"
                    placeholder="Bengaluru"
                    autoComplete="address-level2"
                    aria-invalid={fieldState.invalid}
                    className={inputClassName}
                  />
                </FieldShell>
              )}
            />
            <Controller
              name="business.address.state"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldShell
                  label="State / Province"
                  htmlFor="profile-state"
                  error={fieldState.error}
                >
                  <Input
                    {...field}
                    id="profile-state"
                    placeholder="Karnataka"
                    autoComplete="address-level1"
                    aria-invalid={fieldState.invalid}
                    className={inputClassName}
                  />
                </FieldShell>
              )}
            />
          </div>

          <div className="grid items-start gap-5 sm:grid-cols-2">
            <Controller
              name="business.address.postalCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldShell
                  label="Postal code"
                  htmlFor="profile-postal-code"
                  error={fieldState.error}
                >
                  <Input
                    {...field}
                    id="profile-postal-code"
                    placeholder="560001"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
                    className={inputClassName}
                  />
                </FieldShell>
              )}
            />
            <Controller
              name="business.address.country"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldShell
                  label="Country"
                  htmlFor="profile-country"
                  error={fieldState.error}
                >
                  <Input
                    {...field}
                    id="profile-country"
                    placeholder="India"
                    autoComplete="country-name"
                    aria-invalid={fieldState.invalid}
                    className={inputClassName}
                  />
                </FieldShell>
              )}
            />
          </div>
        </FieldGroup>
      </section>

      <div className="flex items-center justify-end border-t pt-5">
        <Button
          type="submit"
          disabled={isPending}
          className={`${buttonClassName} min-h-10 min-w-32`}
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <span className="sr-only" aria-live="polite">
        {errors.root?.message}
      </span>
    </form>
  );
}
