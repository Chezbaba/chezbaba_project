"use client";

import { FormEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// UI components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Components
import FormErrorMessage from "@/components/auth/FormErrorMessage";
import FieldErrorMessage from "@/components/auth/FieldErrorMessage";

// Utils
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { update } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams && typeof searchParams.get === 'function' ? searchParams.get("callbackUrl") : null;
  const loginHref = callbackUrl
    ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/login";

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMessage("Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nom,
          prenom,
          tel,
        }),
      });

      const responseJson = await response.json();
      if (!response.ok) {
        setErrorMessage(responseJson?.error || "Une erreur est survenue.");
        if (responseJson?.data) {
          const errors: Record<string, string> = {};
          responseJson.data.forEach(
            (err: { field: string; message: string }) => {
              errors[err.field] = err.message;
            }
          );
          setFieldErrors(errors);
        }
        return;
      }

      await update();
      toast(responseJson.message || "Inscription réussie.");

      const safeCallbackUrl =
        callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/";

      router.push(
        `/auth/verify-email?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
      );
      router.refresh();
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-11"
              onClick={() => signIn("google", { callbackUrl: callbackUrl || "/" })}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuer avec Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continuer avec e-mail
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="flex flex-col gap-6">
                {/* email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {fieldErrors.email && (
                    <FieldErrorMessage message={fieldErrors.email} />
                  )}
                </div>

                {/* password */}
                <div className="grid gap-3 relative">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3/4 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                    ></i>
                  </button>
                  {fieldErrors.password && (
                    <FieldErrorMessage message={fieldErrors.password} />
                  )}
                </div>

                {/* nom */}
                <div className="grid gap-3">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="ZANNOU"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                  {fieldErrors.nom && (
                    <FieldErrorMessage message={fieldErrors.nom} />
                  )}
                </div>

                {/* prenom */}
                <div className="grid gap-3">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Théophile"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                  {fieldErrors.prenom && (
                    <FieldErrorMessage message={fieldErrors.prenom} />
                  )}
                </div>

                {/* téléphone */}
                <div className="grid gap-3">
                  <Label htmlFor="tel">Téléphone</Label>
                  <PhoneInput
                    value={tel}
                    onChange={setTel}
                    disabled={isLoading}
                  />
                  {fieldErrors.tel && (
                    <FieldErrorMessage message={fieldErrors.tel} />
                  )}
                </div>


                {/* accept terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="accept-terms" className="font-normal leading-snug text-muted-foreground cursor-pointer">
                    <span>
                      J&apos;accepte les <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Conditions d&apos;utilisation</Link> et la <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Politique de confidentialité</Link>
                    </span>
                  </Label>
                </div>


                {/* submit button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </Button>

                {/* Error Message */}
                <FormErrorMessage message={errorMessage} />
              </div>

              {/* link to register page  */}
              <div className="mt-4 text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <Link href={loginHref} className="underline underline-offset-4">
                  Connectez-vous
                </Link>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
