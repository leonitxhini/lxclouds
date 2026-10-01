export const site = {
  name: "Leonit Xhini",
  domain: "lxclouds.com",
  url: "https://lxclouds.com",
  email: "info@lxclouds.com",
  // Add profiles here ({ label, href }) – the footer renders whatever is listed.
  socials: [] as { label: string; href: string }[],
};

/** Sections of the home page that the navigation points to. */
export const navSections = ["work", "services", "about", "contact"] as const;

export const mailto = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
