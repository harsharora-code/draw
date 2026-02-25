import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useJoinWaitlist, waitlistFormSchema, type WaitlistFormValues } from "@/hooks/use-waitlist";

export default function WaitlistForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const joinWaitlist = useJoinWaitlist();

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: WaitlistFormValues) => {
    joinWaitlist.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        
        // Playful success confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      },
      onError: (error) => {
        toast({
          title: "Oops!",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-3 bg-primary/5 rounded-2xl sketchy-border rotate-slight-right w-full max-w-md mx-auto">
        <div className="h-12 w-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="font-sketch text-2xl font-bold text-foreground">You're on the list!</h3>
        <p className="text-center text-muted-foreground text-sm">
          We'll notify you as soon as your canvas is ready. Keep an eye on your inbox.
        </p>
        <Button 
          variant="outline" 
          className="mt-4 sketchy-border"
          onClick={() => setIsSuccess(false)}
        >
          Join with another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <div className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            id="waitlist-form"
            placeholder="you@awesome.com"
            className={`h-12 px-5 bg-background sketchy-border text-base transition-shadow focus-visible:ring-primary/20 ${
              form.formState.errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""
            }`}
            {...form.register("email")}
            disabled={joinWaitlist.isPending}
          />
          {form.formState.errors.email && (
            <span className="absolute -bottom-6 left-2 text-xs font-medium text-destructive font-sketch">
              {form.formState.errors.email.message}
            </span>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={joinWaitlist.isPending}
          className="h-12 px-8 sketchy-border-primary text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          {joinWaitlist.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Join 2,400+ creative minds already waiting
      </p>
    </form>
  );
}
