
import { Facebook, Twitter, Youtube, Apple, Smartphone } from "lucide-react";

export const socialIcons = {
  Facebook: () => <Facebook className="h-5 w-5" />,
  Twitter: () => <Twitter className="h-5 w-5" />,
  Youtube: () => <Youtube className="h-5 w-5" />,
  Whatsapp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.607-1.474l-6.279 1.688zm7.472-1.847c1.664.973 3.56 1.501 5.488 1.501 5.43 0 9.875-4.444 9.875-9.874 0-2.653-1.04-5.14-2.9-6.998s-4.344-2.9-6.974-2.9c-5.43 0-9.875 4.444-9.875 9.875 0 2.02.59 3.94 1.634 5.63l-1.19 4.35z" />
    </svg>
  ),
  Apple: () => <Apple className="h-5 w-5" />,
  Android: () => <Smartphone className="h-5 w-5" />,
};
