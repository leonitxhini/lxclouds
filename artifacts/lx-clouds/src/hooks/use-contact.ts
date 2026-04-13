import { useMutation } from "@tanstack/react-query";

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactData) => {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "ff0f38d4-cdc5-49b5-a0e8-00c4c585ce19",
          subject: `New enquiry from ${data.name} — LX CLOUDS`,
          from_name: "LX CLOUDS Website",
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message ?? "Failed to send message. Please try again.");
      }

      return result;
    },
  });
}
