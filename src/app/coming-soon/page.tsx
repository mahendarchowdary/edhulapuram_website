import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-lg transform-gpu transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Construction className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Coming Soon!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This feature is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            The service you are trying to access will be linked soon. We are
            working hard to bring you a fully connected experience.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
