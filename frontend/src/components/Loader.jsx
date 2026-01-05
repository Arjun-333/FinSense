import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

const Loader = ({ size = "md", fullScreen = false }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const content = (
    <div className="flex flex-col items-center gap-3">
        <Loader2 className={clsx("animate-spin text-slate-800 dark:text-slate-200", sizeClasses[size])} />
        {fullScreen && <p className="text-slate-500 text-xs font-medium tracking-wide uppercase">Loading</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
