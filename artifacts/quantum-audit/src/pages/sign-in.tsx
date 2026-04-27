import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/react";
import { useLocation } from "wouter";
import { getPostAuthRedirect } from "@/contexts/click-gate-context";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLocation(getPostAuthRedirect());
    }
  }, [isSignedIn, isLoaded, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground mt-2">
          You have explored the free preview. Sign in to continue.
        </p>
      </div>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}
