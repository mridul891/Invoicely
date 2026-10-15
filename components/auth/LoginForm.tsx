"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import GoogleIcon from "@hugeicons/core-free-icons/GoogleIcon";

import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setErrorMessage(null);
    setIsPending(true);

    void authClient.signIn.social(
      { provider: "google", callbackURL: "/dashboard" },
      {
        onError: () => {
          setIsPending(false);
          setErrorMessage("Unable to sign in with Google. Please try again.");
        },
      },
    );
  };

  return (
    <div className={cn("p-6 sm:p-8", className)} {...props}>
      <div className="mb-5 flex flex-col gap-7">
        <FieldGroup className="gap-7">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back
          </h1>

          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="h-12 w-full rounded-lg shadow-sm"
          >
            <HugeiconsIcon icon={GoogleIcon} className="size-4" />
            {isPending ? "Redirecting..." : "Sign in with Google"}
          </Button>
          {errorMessage ? (
            <FieldDescription className="text-center text-destructive">
              {errorMessage}
            </FieldDescription>
          ) : null}
        </FieldGroup>
      </div>
      <FieldDescription className="mt-8 text-left text-xs leading-relaxed">
        By signing in, you agree to our Terms &amp; Conditions and Privacy
        Policy.
      </FieldDescription>
    </div>
  );
}
