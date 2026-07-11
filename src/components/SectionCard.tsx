import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-4 shadow-[0_30px_120px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  );
}
