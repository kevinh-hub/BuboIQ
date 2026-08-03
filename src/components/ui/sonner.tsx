"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-dark-midnight group-[.toaster]:text-white group-[.toaster]:border-slate-gray group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-mist-gray",
          actionButton: "group-[.toast]:bg-iq-neon-green group-[.toast]:text-dark-midnight",
          cancelButton: "group-[.toast]:bg-slate-gray/20 group-[.toast]:text-mist-gray",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };