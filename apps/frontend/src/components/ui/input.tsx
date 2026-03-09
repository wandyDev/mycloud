import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-muted-foreground ml-1">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "w-full h-11 px-4 rounded-xl border border-input bg-background/50",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/50",
          "transition-all duration-200 outline-none",
          error && "border-destructive focus:ring-destructive/20",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive ml-1">{error}</p>}
    </div>
  );
}
