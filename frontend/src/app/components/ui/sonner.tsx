"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-100 group-[.toaster]:border-slate-800 shadow-lg",
          description: "group-[.toast]:text-slate-400",
          actionButton: "group-[.toast]:bg-slate-50 group-[.toast]:text-slate-900",
          cancelButton: "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
