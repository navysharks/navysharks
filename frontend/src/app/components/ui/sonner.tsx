"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#0f172a', // slate-900
          color: '#f8fafc', // slate-50
          borderColor: '#1e293b', // slate-800
        },
        className: 'border-slate-800',
        descriptionClassName: 'text-slate-400 font-medium',
      }}
      {...props}
    />
  );
};

export { Toaster };
