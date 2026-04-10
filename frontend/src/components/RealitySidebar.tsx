import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface RealitySidebarProps {
  claim: string;
  truth: string;
}

const RealitySidebar: React.FC<RealitySidebarProps> = ({ claim, truth }) => {
  if (!claim || !truth) return null;

  return (
    <div className="my-12 overflow-hidden rounded-3xl border border-border bg-muted/30 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm font-sans group">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* The Claim */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-border/50">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Hype Claim</span>
          </div>
          <blockquote className="text-base md:text-lg leading-relaxed text-muted-foreground/80 italic font-medium">
            &ldquo;{claim}&rdquo;
          </blockquote>
        </div>

        {/* The Truth */}
        <div className="p-8 bg-foreground/[0.03] dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-4 text-foreground/80 transition-colors group-hover:text-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Reality</span>
          </div>
          <p className="text-base md:text-lg leading-relaxed font-semibold text-foreground">
            {truth}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealitySidebar;
