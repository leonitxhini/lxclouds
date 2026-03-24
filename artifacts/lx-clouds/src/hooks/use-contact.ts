import { useMutation } from "@tanstack/react-query";

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactData) => {
      // Simulate network request for form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Contact form successfully submitted:", data);
      return { success: true, message: "Message sent successfully" };
    }
  });
}
