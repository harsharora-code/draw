import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// We define a localized schema for the form since we just need the email
export const waitlistFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      // Validate before sending (redundant if using react-hook-form, but safe)
      const validated = api.waitlist.join.input.parse(data);
      
      const res = await fetch(api.waitlist.join.path, {
        method: api.waitlist.join.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.waitlist.join.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to join waitlist. Please try again.");
      }

      return api.waitlist.join.responses[201].parse(await res.json());
    },
  });
}
