"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Поръчка Потвърдена!</h1>
        <p className="text-muted-foreground">
          Благодарим ви за покупката. Вашата поръчка e получена.
        </p>
      </div>

      {orderId && (
        <Alert className="text-left">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Поръчка #{orderId}</AlertTitle>
          <AlertDescription>
            Ще изпратим потвърждение на имейла ви скоро. Вашият парфюм e на път!
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Продължете към магазина
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
