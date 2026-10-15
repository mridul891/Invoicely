"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createBusinessAction } from "@/app/actions/businessActions";
import {
  CreateBusinessSchema,
  type CreateBusinessInput,
} from "@/schema/business";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Small professional radius — overrides the pill-shaped `rounded-4xl`
// default locally, without touching the global design system.
const inputClassName = "rounded-lg";
const buttonClassName = "rounded-lg";

export function OnboardingForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreateBusinessInput>({
    resolver: zodResolver(CreateBusinessSchema),
    defaultValues: {
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
  });

  function onSubmit(values: CreateBusinessInput) {
    startTransition(async () => {
      const payload: CreateBusinessInput = {
        ...values,
        phone:
          values.phone?.trim() === "" || !values.phone
            ? undefined
            : values.phone,
        taxId:
          values.taxId?.trim() === "" || !values.taxId
            ? undefined
            : values.taxId,
      };
      const result = await createBusinessAction(payload);

      // Reaches here only on failure — success redirects to /dashboard
      // from inside the server action.
      if (result) {
        toast.error("Could not create business", {
          description: result.error ?? "Please check the form and try again.",
        });
      }
    });
  }

  return (
    <div className="w-full">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Step 1 of 1 · Business profile
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Set up your business
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        This information appears on your invoices. You can change it later.
      </p>

      <form
        id="business-onboarding-form"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-6"
      >
        <FieldGroup className="gap-6">
          <section aria-labelledby="business-details-heading">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary"
              >
                1
              </span>
              <div>
                <h2
                  id="business-details-heading"
                  className="text-sm font-semibold"
                >
                  Business details
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  The name and contact shown to your customers.
                </p>
              </div>
            </div>
            <FieldGroup className="gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="business-name">
                      Business name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="business-name"
                      placeholder="Acme Studio Pvt. Ltd."
                      autoComplete="organization"
                      aria-invalid={fieldState.invalid}
                      className={inputClassName}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid items-start gap-3 sm:grid-cols-2">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-email">
                        Business email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="business-email"
                        type="email"
                        placeholder="billing@acme.in"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-phone">
                        Phone{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="business-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="taxId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="business-tax-id">
                      GSTIN / Tax ID{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="business-tax-id"
                      placeholder="22AAAAA0000A1Z5"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      className={inputClassName}
                    />
                    <FieldDescription>
                      Printed on invoices for tax compliance.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </section>

          <section aria-labelledby="business-address-heading">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary"
              >
                2
              </span>
              <div>
                <h2
                  id="business-address-heading"
                  className="text-sm font-semibold"
                >
                  Business address
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Your billing address — printed on every invoice.
                </p>
              </div>
            </div>
            <FieldGroup className="gap-4">
              <Controller
                name="address.addressLine1"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="business-address-line1">
                      Street address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="business-address-line1"
                      placeholder="14, MG Road"
                      autoComplete="street-address"
                      aria-invalid={fieldState.invalid}
                      className={inputClassName}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid items-start gap-3 sm:grid-cols-2">
                <Controller
                  name="address.city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-city">City</FieldLabel>
                      <Input
                        {...field}
                        id="business-city"
                        placeholder="Bengaluru"
                        autoComplete="address-level2"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="address.state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-state">
                        State / Province
                      </FieldLabel>
                      <Input
                        {...field}
                        id="business-state"
                        placeholder="Karnataka"
                        autoComplete="address-level1"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid items-start gap-3 sm:grid-cols-2">
                <Controller
                  name="address.postalCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-postal-code">
                        Postal code
                      </FieldLabel>
                      <Input
                        {...field}
                        id="business-postal-code"
                        placeholder="560001"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="address.country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="business-country">
                        Country
                      </FieldLabel>
                      <Input
                        {...field}
                        id="business-country"
                        placeholder="India"
                        autoComplete="country-name"
                        aria-invalid={fieldState.invalid}
                        className={inputClassName}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </section>
        </FieldGroup>
      </form>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isPending}
          className={buttonClassName}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="business-onboarding-form"
          disabled={isPending}
          className={buttonClassName}
        >
          {isPending ? "Creating…" : "Create business"}
        </Button>
      </div>
    </div>
  );
}
